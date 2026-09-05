import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { PanelSection, PanelSectionRow } from "@decky/ui";
import { CollapsibleSection } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";
import { WhatsNewCard } from "./WhatsNewCard";
// Drop-in "Update history" collapse for a Settings page — collapsed by
// default, styled to match decky-apps-manager's own spacing exactly
// (margin above the row, a separator after the expanded content, margin
// between the toggle and the card).
export const UpdateHistorySection = ({ versions }) => {
    const { t } = useTranslation("settings_common");
    const [expanded, setExpanded] = useState(false);
    return (_jsx(PanelSection, { children: _jsx(PanelSectionRow, { children: _jsx("div", { style: { marginTop: 8 }, children: _jsx(CollapsibleSection, { label: t("whats_new_history"), expanded: expanded, onToggle: () => setExpanded((v) => !v), contentBottomSeparator: true, children: _jsx("div", { style: { marginTop: 8 }, children: _jsx(WhatsNewCard, { versions: versions }) }) }) }) }) }));
};
