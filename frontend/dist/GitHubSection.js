import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { PanelSection, PanelSectionRow } from "@decky/ui";
import { QrCodeButton } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";
import { PluginUpdateSection } from "./PluginUpdate";
import { usePluginUpdate } from "./PluginUpdateContext";
import { pluginUpdateFocus, featureRequestFocus, useLandOnFresh } from "./focusRestore";
// Drop-in "GitHub" Settings section: self-update (check + one-click
// install) plus feature-request/bug-report QR codes. Owns all the
// expand-state and focus-restore plumbing internally — a consumer only
// supplies the three URLs/callback that are genuinely its own.
export const GitHubSection = ({ fetchReleases, featureRequestUrl, bugReportUrl }) => {
    const { t } = useTranslation("settings_common");
    const { info, checking, checkNow } = usePluginUpdate();
    const [expanded, setExpandedState] = useState(() => pluginUpdateFocus.consumeIsExpansionFresh());
    const setExpanded = (v) => {
        if (v)
            pluginUpdateFocus.markExpanded();
        setExpandedState(v);
    };
    const wasRestored = useRef(expanded).current;
    const sectionRef = useRef(null);
    useLandOnFresh(sectionRef, wasRestored, "last");
    const featureRequestFresh = useRef(featureRequestFocus.consumeIsExpansionFresh()).current;
    const featureRequestRef = useRef(null);
    useLandOnFresh(featureRequestRef, featureRequestFresh, "first");
    return (_jsxs(PanelSection, { title: t("github_section_title"), children: [_jsx(PanelSectionRow, { children: _jsx("div", { ref: sectionRef, children: _jsx(PluginUpdateSection, { info: info, checking: checking, expanded: expanded, onToggle: () => setExpanded(!expanded), onCheckNow: checkNow, fetchReleases: fetchReleases }) }) }), _jsx(PanelSectionRow, { children: _jsx("div", { ref: featureRequestRef, children: _jsx(QrCodeButton, { value: featureRequestUrl, label: t("feature_request_button"), hint: t("feature_request_hint") }) }) }), _jsx(PanelSectionRow, { children: _jsx(QrCodeButton, { value: bugReportUrl, label: t("bug_report_button"), hint: t("bug_report_hint") }) })] }));
};
