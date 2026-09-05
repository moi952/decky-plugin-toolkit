import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { ButtonItem, DialogButton, Navigation, PanelSectionRow, ProgressBarWithInfo } from "@decky/ui";
import { toaster } from "@decky/api";
import { useTranslation } from "react-i18next";
import { AnchoredDropdown, CollapsibleSection } from "@moi952/decky-ui-kit";
import { compareVersions } from "./versions";
import { getDeckyBackend, installPlugin, PluginInstallType } from "./deckyInstall";
const installTypeFor = (targetVersion, currentVersion) => {
    const cmp = compareVersions(targetVersion, currentVersion);
    if (cmp > 0)
        return PluginInstallType.UPDATE;
    if (cmp < 0)
        return PluginInstallType.DOWNGRADE;
    return PluginInstallType.REINSTALL;
};
// Same remount issue as PluginUpdateContext's own lastInfo: picking this
// dropdown's option makes Decky tear down and recreate the whole panel
// (QAM close/reopen), which would otherwise silently drop the pick back
// to whatever the effect below defaults to. Persisted outside React,
// restored only within a short window after the fact.
const SELECTION_RESTORE_WINDOW_MS = 5000;
let lastSelectedTag = "";
let lastSelectedTagAt = 0;
// Same remount problem, for the actual install/download progress this
// time — Decky's own download keeps running across a QAM close/reopen,
// but `installing`/`downloadActive` are plain component state, so without
// this they'd silently reset to "not installing" and the button would
// become clickable again mid-download. No restore window here (unlike
// the selection above): these must survive for as long as the operation
// they track actually runs, however long that is.
let persistedInstalling = false;
let persistedDownloadActive = false;
let persistedDownloadPercent = 0;
// If Decky's own loader install dies silently (e.g. a dead asset URL),
// nothing else would ever flip the "installing" state back off — this is
// an inactivity reset (re-armed on every progress tick), not a single fixed
// deadline, so a legitimately slow download isn't falsely flagged.
const INSTALL_WATCHDOG_TIMEOUT_MS = 45000;
// Small notice, clickable — renders nothing until an update is actually
// confirmed. Uses the "plugin_update" i18n namespace — see this
// package's translations.ts for the resource bundle to merge into the
// consumer's own i18n.init().
export function PluginUpdateBanner({ info, onClick }) {
    const { t } = useTranslation("plugin_update");
    if (!info?.has_update)
        return null;
    return (_jsxs("div", { style: { margin: "0 16px 8px" }, children: [_jsx("style", { children: `
        .dpt-update-btn:focus {
          background: #4caf50 !important;
          color: #fff !important;
          border-color: #4caf50 !important;
        }
      ` }), _jsx(DialogButton, { className: "dpt-update-btn", onClick: onClick, style: {
                    padding: "6px 10px",
                    background: "#1a2a1a",
                    border: "1px solid #4caf50",
                    borderRadius: "6px",
                    fontSize: 11,
                    color: "#4caf50",
                    textAlign: "center",
                    width: "100%",
                }, children: t("banner", { version: info.latest_version }) })] }));
}
// Collapsed-by-default details section: current/latest version, a link to
// the release page, and a version picker (defaults to latest) that installs
// via Decky Loader's own installer — same route the plugin store uses.
export function PluginUpdateSection({ info, checking, expanded, onToggle, onCheckNow, fetchReleases, }) {
    const { t } = useTranslation("plugin_update");
    const [installing, setInstallingState] = useState(persistedInstalling);
    const [downloadActive, setDownloadActiveState] = useState(persistedDownloadActive);
    const [downloadPercent, setDownloadPercentState] = useState(persistedDownloadPercent);
    const setInstalling = (v) => {
        persistedInstalling = v;
        setInstallingState(v);
    };
    const setDownloadActive = (v) => {
        persistedDownloadActive = v;
        setDownloadActiveState(v);
    };
    const setDownloadPercent = (v) => {
        persistedDownloadPercent = v;
        setDownloadPercentState(v);
    };
    const downloadActiveRef = useRef(persistedDownloadActive);
    const watchdogRef = useRef(null);
    const [releases, setReleases] = useState(null);
    const [loadingReleases, setLoadingReleases] = useState(false);
    const [selectedTag, setSelectedTagState] = useState(() => Date.now() - lastSelectedTagAt < SELECTION_RESTORE_WINDOW_MS ? lastSelectedTag || null : null);
    const setSelectedTag = (tag) => {
        lastSelectedTag = tag;
        lastSelectedTagAt = Date.now();
        setSelectedTagState(tag);
    };
    // Lazy-load the release list once, the first time this section is opened.
    useEffect(() => {
        if (!expanded || releases !== null || loadingReleases)
            return;
        setLoadingReleases(true);
        fetchReleases()
            .then((list) => {
            setReleases(list);
            if (list.length > 0 && !selectedTag)
                setSelectedTag(list[0].tag);
        })
            .finally(() => setLoadingReleases(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded, releases, loadingReleases]);
    // Mirrors Decky's own loader install progress — the install_plugin call
    // below only registers the request (Decky pops its own confirm modal and
    // does the actual download/extract), so this is how we know it's moving.
    useEffect(() => {
        const backend = getDeckyBackend();
        const name = info?.plugin_display_name;
        if (!backend || !name)
            return;
        const clearWatchdog = () => {
            if (watchdogRef.current !== null) {
                clearTimeout(watchdogRef.current);
                watchdogRef.current = null;
            }
        };
        const armWatchdog = () => {
            clearWatchdog();
            watchdogRef.current = setTimeout(() => {
                if (!downloadActiveRef.current)
                    return;
                downloadActiveRef.current = false;
                setDownloadActive(false);
                setInstalling(false);
                toaster.toast({ title: t("install_failed_title"), body: t("install_timeout") });
            }, INSTALL_WATCHDOG_TIMEOUT_MS);
        };
        const onStart = (eventName) => {
            if (eventName !== name)
                return;
            downloadActiveRef.current = true;
            setDownloadActive(true);
            setDownloadPercent(0);
            armWatchdog();
        };
        const onInfo = (percent) => {
            if (!downloadActiveRef.current)
                return;
            setDownloadPercent(percent);
            armWatchdog();
        };
        const onFinish = (eventName) => {
            if (eventName !== name)
                return;
            downloadActiveRef.current = false;
            setDownloadPercent(100);
            setDownloadActive(false);
            setInstalling(false);
            clearWatchdog();
            backend.call("loader/reload_plugin", name).catch(() => { });
        };
        if (downloadActiveRef.current)
            armWatchdog();
        backend.addEventListener("loader/plugin_download_start", onStart);
        backend.addEventListener("loader/plugin_download_info", onInfo);
        backend.addEventListener("loader/plugin_download_finish", onFinish);
        return () => {
            backend.removeEventListener("loader/plugin_download_start", onStart);
            backend.removeEventListener("loader/plugin_download_info", onInfo);
            backend.removeEventListener("loader/plugin_download_finish", onFinish);
            clearWatchdog();
        };
    }, [info?.plugin_display_name, t]);
    const installRelease = async (displayName, version, assetUrl, sha256) => {
        if (!getDeckyBackend()) {
            toaster.toast({ title: t("install_failed_title"), body: t("no_backend") });
            return;
        }
        setInstalling(true);
        try {
            await installPlugin(assetUrl, displayName, version, sha256, installTypeFor(version, info?.current_version ?? version));
        }
        catch (e) {
            setInstalling(false);
            toaster.toast({ title: t("install_failed_title"), body: e instanceof Error ? e.message : String(e) });
        }
    };
    const selectedRelease = releases?.find((r) => r.tag === selectedTag) ?? null;
    const selectedIsCurrent = !!selectedRelease && !!info && selectedRelease.version === info.current_version;
    const onInstallSelected = () => {
        if (!info || !selectedRelease)
            return;
        installRelease(info.plugin_display_name, selectedRelease.version, selectedRelease.asset_url, selectedRelease.sha256);
    };
    // Navigation.NavigateToExternalWeb opens Steam's own browser overlay —
    // unlike a plain <a target="_blank">, it's reachable through the
    // gamepad-driven focus system the rest of this UI relies on.
    const onViewRelease = () => {
        if (info?.release_url)
            Navigation.NavigateToExternalWeb(info.release_url);
    };
    const busy = installing || downloadActive || checking;
    return (_jsxs(CollapsibleSection, { label: t("section_label"), expanded: expanded, onToggle: onToggle, children: [_jsx(PanelSectionRow, { children: _jsx("div", { style: { fontSize: 12, opacity: 0.85, marginTop: 4 }, children: t("current", { version: info?.current_version || "?" }) }) }), _jsx(PanelSectionRow, { children: _jsx("div", { style: { fontSize: 12, opacity: 0.85, marginBottom: 4 }, children: !info || !info.checked_ok ? t("check_failed") : info.has_update ? t("latest", { version: info.latest_version }) : t("up_to_date") }) }), (downloadActive || installing) && (_jsx(PanelSectionRow, { children: _jsx(ProgressBarWithInfo, { layout: "inline", bottomSeparator: "none", nProgress: downloadPercent, sOperationText: downloadActive ? t("downloading") : t("installing") }) })), info?.release_url && (_jsx(PanelSectionRow, { children: _jsx(ButtonItem, { layout: "below", onClick: onViewRelease, disabled: busy, children: t("view_release") }) })), _jsx(PanelSectionRow, { children: _jsx(ButtonItem, { layout: "below", onClick: onCheckNow, disabled: busy, children: checking ? t("checking") : t("check_button") }) }), _jsx(PanelSectionRow, { children: _jsx("div", { style: { fontSize: 12, opacity: 0.85, marginTop: 8 }, children: t("choose_version_label") }) }), releases && releases.length > 0 && (_jsx(PanelSectionRow, { children: _jsx(AnchoredDropdown, { options: releases.map((r) => ({
                        value: r.tag,
                        label: r.prerelease ? `${r.version} (pre-release)` : r.version,
                    })), selectedValue: selectedTag ?? "", onChange: setSelectedTag }) })), releases && releases.length === 0 && (_jsx(PanelSectionRow, { children: _jsx("div", { style: { fontSize: 12, opacity: 0.7 }, children: t("no_releases") }) })), _jsx(PanelSectionRow, { children: _jsx(ButtonItem, { layout: "below", onClick: onInstallSelected, disabled: busy || !selectedRelease || selectedIsCurrent, children: loadingReleases
                        ? t("checking")
                        : selectedIsCurrent
                            ? t("already_installed", { version: selectedRelease.version })
                            : selectedRelease
                                ? t("install_button", { version: selectedRelease.version })
                                : t("check_button") }) })] }));
}
