import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { ActionButton, StatusCard } from "@moi952/decky-ui-kit";
import { FiPackage } from "react-icons/fi";
import { useOtherPlugins } from "./OtherPluginsContext";
import { useWhatsNew } from "./WhatsNewContext";
import { localizedDescription } from "./types";
// Home-screen banner for newly-added plugins in the manifest. What's New
// takes priority — if WhatsNewBanner is currently visible, this renders
// nothing, so a consumer can render both banners unconditionally and
// never gets two competing for space at once.
export const OtherPluginsBanner = ({ onOpenSettings }) => {
    const { t, i18n } = useTranslation("other_plugins");
    const { newOnes, dismissNew } = useOtherPlugins();
    const { visible: whatsNewVisible } = useWhatsNew();
    if (whatsNewVisible || newOnes.length === 0)
        return null;
    return (_jsx("div", { style: { margin: "0 16px 12px" }, children: _jsxs(StatusCard, { variant: "info", icon: _jsx(FiPackage, {}), title: t("banner_title", { count: newOnes.length }), children: [_jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10, width: "100%", marginBottom: 10, textAlign: "left" }, children: newOnes.map((plugin) => (_jsxs("div", { children: [_jsx("div", { style: { fontSize: 13, fontWeight: 700 }, children: plugin.name }), _jsx("div", { style: { fontSize: 11, opacity: 0.8, marginTop: 2 }, children: localizedDescription(plugin, i18n.language) })] }, plugin.id))) }), _jsx(ActionButton, { onClick: () => {
                        dismissNew();
                        onOpenSettings();
                    }, width: "100%", children: t("open_settings") })] }) }));
};
