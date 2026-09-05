import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Focusable } from "@decky/ui";
import { ActionButton } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiGift, FiCoffee } from "react-icons/fi";
// Shared prev/next-paging changelog card. Uses the "whats_new" i18n
// namespace only for its own fixed strings (older/newer/support_note) —
// see this package's translations.ts for the resource bundle to merge
// into the consumer's own i18n.init().
export const WhatsNewCard = ({ versions, initialVersionKey, dismissLabel, onDismiss, onFeatureRequest, featureRequestLabel, }) => {
    const { t } = useTranslation("whats_new");
    const [index, setIndex] = useState(() => {
        const i = initialVersionKey ? versions.findIndex((v) => v.key === initialVersionKey) : 0;
        return i >= 0 ? i : 0;
    });
    if (versions.length === 0)
        return null;
    const { title, items } = versions[index];
    return (_jsxs("div", { style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "16px 14px 14px",
            borderRadius: 8,
            background: "#1a2a1a",
            border: "1px solid #4caf50",
        }, children: [_jsx(FiGift, { style: { fontSize: 30, color: "#4caf50", marginBottom: 8 } }), _jsx("div", { style: { fontSize: 14, fontWeight: 700, marginBottom: 8 }, children: title }), _jsx("ul", { style: {
                    textAlign: "left",
                    fontSize: 11,
                    opacity: 0.85,
                    margin: "0 0 14px",
                    paddingLeft: 18,
                    lineHeight: 1.5,
                }, children: items.map((item, i) => (_jsx("li", { style: { marginBottom: 4 }, children: item }, i))) }), versions.length > 1 && (_jsxs(Focusable, { style: {
                    display: "flex",
                    width: "100%",
                    gap: 8,
                    marginBottom: dismissLabel && onDismiss ? 10 : 0,
                }, "flow-children": "horizontal", children: [_jsx("div", { style: { flex: 1 }, children: _jsxs(ActionButton, { width: "100%", disabled: index === versions.length - 1, onClick: () => setIndex((i) => Math.min(i + 1, versions.length - 1)), children: [_jsx(FiChevronLeft, { size: 12, style: { marginRight: 4 } }), t("older")] }) }), _jsx("div", { style: { flex: 1 }, children: _jsxs(ActionButton, { width: "100%", disabled: index === 0, onClick: () => setIndex((i) => Math.max(i - 1, 0)), children: [t("newer"), _jsx(FiChevronRight, { size: 12, style: { marginLeft: 4 } })] }) })] })), onFeatureRequest && (_jsx("div", { style: { width: "100%", marginBottom: dismissLabel && onDismiss ? 10 : 0 }, children: _jsxs(ActionButton, { onClick: onFeatureRequest, width: "100%", children: [_jsx(FiExternalLink, { size: 12, style: { marginRight: 6 } }), featureRequestLabel] }) })), dismissLabel && onDismiss && (_jsx(ActionButton, { onClick: onDismiss, width: "100%", children: dismissLabel })), _jsxs("div", { style: { fontSize: 10, opacity: 0.6, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }, children: [_jsx(FiCoffee, { size: 11, style: { flexShrink: 0 } }), t("support_note")] })] }));
};
