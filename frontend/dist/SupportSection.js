import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { PanelSection, PanelSectionRow } from "@decky/ui";
import { CollapsibleSection, QrCodeButton } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";
import { OtherPluginRow } from "./OtherPluginRow";
import { useOtherPlugins } from "./OtherPluginsContext";
import { otherPluginsFocus, useLandOnFresh } from "./focusRestore";
import { DEFAULT_KOFI_URL } from "./types";
// Drop-in "Support" Settings section: Ko-fi QR code plus the "My other
// plugins" list (hidden entirely when the manifest has nothing new to
// show). Owns the collapse/focus-restore plumbing internally.
export const SupportSection = ({ kofiUrl = DEFAULT_KOFI_URL }) => {
    const { t } = useTranslation("settings_common");
    const { others } = useOtherPlugins();
    const [expanded, setExpandedState] = useState(otherPluginsFocus.isExpansionFresh);
    const setExpanded = (v) => {
        if (v)
            otherPluginsFocus.markExpanded();
        setExpandedState(v);
    };
    useEffect(() => {
        if (!expanded)
            return;
        const heartbeat = setInterval(otherPluginsFocus.markExpanded, 1000);
        return () => clearInterval(heartbeat);
    }, [expanded]);
    const wasRestored = useRef(expanded).current;
    const sectionRef = useRef(null);
    useLandOnFresh(sectionRef, wasRestored, "first");
    return (_jsxs(PanelSection, { title: t("support_section_title"), children: [_jsx(PanelSectionRow, { children: _jsxs("div", { children: [_jsx("div", { style: { fontSize: 11, opacity: 0.7, marginBottom: 8 }, children: t("kofi_description") }), _jsx(QrCodeButton, { value: kofiUrl, label: t("kofi_button"), hint: t("kofi_hint") })] }) }), others.length > 0 && (_jsx(PanelSectionRow, { children: _jsx("div", { ref: sectionRef, children: _jsx(CollapsibleSection, { label: t("other_plugins_section_title"), expanded: expanded, onToggle: () => setExpanded(!expanded), children: _jsx("div", { style: { marginTop: 8, marginLeft: 16 }, children: others.map((plugin) => (_jsx(OtherPluginRow, { plugin: plugin }, plugin.id))) }) }) }) }))] }));
};
