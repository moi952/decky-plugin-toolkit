import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, StatusCard } from "@moi952/decky-ui-kit";
import { FiPackage } from "react-icons/fi";

import { useOtherPlugins } from "./OtherPluginsContext";
import { useWhatsNew } from "./WhatsNewContext";
import { localizedDescription } from "./types";
import { otherPluginsFocus, otherPluginItemFocus } from "./focusRestore";

interface OtherPluginsBannerProps {
  onOpenSettings: () => void;
}

// Home-screen banner for newly-added plugins in the manifest. What's New
// takes priority — if WhatsNewBanner is currently visible, this renders
// nothing, so a consumer can render both banners unconditionally and
// never gets two competing for space at once.
export const OtherPluginsBanner: React.FC<OtherPluginsBannerProps> = ({ onOpenSettings }) => {
  const { t, i18n } = useTranslation("other_plugins");
  const { newOnes, dismissNew } = useOtherPlugins();
  const { visible: whatsNewVisible } = useWhatsNew();

  if (whatsNewVisible || newOnes.length === 0) return null;

  // One button regardless of count: it expands every announced plugin's
  // own row in the Settings list (SupportSection reads this same mark)
  // and lands focus on the first one's Install button — with just one
  // plugin that's effectively "open it and go straight to Install".
  const onPreview = () => {
    otherPluginItemFocus.markFocused(newOnes.map((p) => p.id));
    otherPluginsFocus.markExpanded();
    dismissNew();
    onOpenSettings();
  };

  return (
    <div style={{ margin: "0 16px 12px" }}>
      <StatusCard
        variant="info"
        icon={<FiPackage />}
        title={t("banner_title", { count: newOnes.length })}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginBottom: 10, textAlign: "left" }}>
          {newOnes.map((plugin) => (
            <div key={plugin.id}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{plugin.name}</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                {localizedDescription(plugin, i18n.language)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 6 }}>
          <ActionButton size="medium" width="100%" onClick={onPreview}>
            {t("preview_plugin", { count: newOnes.length })}
          </ActionButton>
        </div>
        {/* Dismisses without forcing a trip to Settings — going there is
            the only way to actually install one, but just acknowledging
            the notification shouldn't require it. */}
        <div>
          <ActionButton size="medium" onClick={dismissNew} width="100%">
            {t("dismiss")}
          </ActionButton>
        </div>
      </StatusCard>
    </div>
  );
};
