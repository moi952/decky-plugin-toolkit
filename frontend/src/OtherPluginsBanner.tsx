import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, StatusCard } from "@moi952/decky-ui-kit";
import { FiPackage } from "react-icons/fi";

import { useOtherPlugins } from "./OtherPluginsContext";
import { useWhatsNew } from "./WhatsNewContext";
import { localizedDescription } from "./types";

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

  return (
    <div style={{ margin: "0 16px 12px" }}>
      <StatusCard
        variant="info"
        icon={<FiPackage />}
        title={t("banner_title", { count: newOnes.length })}
      >
        {/* Plain text, no image/MediaRow here — the full presentation
            (photo, install/GitHub buttons) lives in the Settings list this
            banner links to; this is just "here's what's new", not a second
            copy of that UI. */}
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
        {/* Marks the notification as seen the moment the user actually acts
            on it — going to Settings (where they can install each one)
            already IS the acknowledgment, no separate "Compris" needed. */}
        <ActionButton
          onClick={() => {
            dismissNew();
            onOpenSettings();
          }}
          width="100%"
        >
          {t("open_settings")}
        </ActionButton>
      </StatusCard>
    </div>
  );
};
