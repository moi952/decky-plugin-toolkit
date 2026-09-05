import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { PanelSection, PanelSectionRow } from "@decky/ui";
import { CollapsibleSection, QrCodeButton } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";
import { OtherPluginRow } from "./OtherPluginRow";
import { useOtherPlugins } from "./OtherPluginsContext";
import { otherPluginsFocus, otherPluginItemFocus, useLandOnFresh } from "./focusRestore";
import { DEFAULT_KOFI_URL } from "./types";
// Drop-in "Support" Settings section: Ko-fi QR code plus the "My other
// plugins" list (hidden entirely when the manifest has nothing new to
// show). Owns the collapse/focus-restore plumbing internally.
export const SupportSection = ({ kofiUrl = DEFAULT_KOFI_URL }) => {
    const { t } = useTranslation("settings_common");
    const { others } = useOtherPlugins();
    const [expanded, setExpandedState] = useState(() => otherPluginsFocus.consumeIsExpansionFresh());
    const setExpanded = (v) => {
        if (v)
            otherPluginsFocus.markExpanded();
        setExpandedState(v);
    };
    // Which plugins (if any) OtherPluginsBanner's single button just
    // announced — those rows start expanded, and only the first of them (in
    // list order) actually takes focus.
    const targetIds = useRef(otherPluginItemFocus.consumeFreshIds()).current;
    const firstTargetId = others.find((p) => targetIds.has(p.id))?.id;
    // Only for a plain remount while already expanded (QAM close/reopen)
    // with no specific plugin targeted — when one *is* targeted, that row's
    // own autoFocus below handles landing focus instead, so this doesn't
    // also fire and fight over it.
    const wasRestored = useRef(expanded && targetIds.size === 0).current;
    const sectionRef = useRef(null);
    useLandOnFresh(sectionRef, wasRestored, "first");
    return (_jsxs(PanelSection, { title: t("support_section_title"), children: [_jsx(PanelSectionRow, { children: _jsxs("div", { children: [_jsx("div", { style: { fontSize: 11, opacity: 0.7, marginBottom: 8 }, children: t("kofi_description") }), _jsx(QrCodeButton, { value: kofiUrl, label: t("kofi_button"), hint: t("kofi_hint") })] }) }), others.length > 0 && (_jsx(PanelSectionRow, { children: _jsx("div", { ref: sectionRef, children: _jsx(CollapsibleSection, { label: t("other_plugins_section_title"), expanded: expanded, onToggle: () => setExpanded(!expanded), children: _jsx("div", { style: { marginTop: 8, marginLeft: 16 }, children: others.map((plugin) => (_jsx(OtherPluginRow, { plugin: plugin, startExpanded: targetIds.has(plugin.id), autoFocus: plugin.id === firstTargetId }, plugin.id))) }) }) }) }))] }));
};
