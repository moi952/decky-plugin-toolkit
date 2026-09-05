import React, { useState, useRef, useEffect } from "react";
import { PanelSection, PanelSectionRow } from "@decky/ui";
import { CollapsibleSection, QrCodeButton } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";

import { OtherPluginRow } from "./OtherPluginRow";
import { useOtherPlugins } from "./OtherPluginsContext";
import { otherPluginsFocus, useLandOnFresh } from "./focusRestore";
import { DEFAULT_KOFI_URL } from "./types";

interface SupportSectionProps {
  // Same Ko-fi page for every one of moi952's plugins by default.
  kofiUrl?: string;
}

// Drop-in "Support" Settings section: Ko-fi QR code plus the "My other
// plugins" list (hidden entirely when the manifest has nothing new to
// show). Owns the collapse/focus-restore plumbing internally.
export const SupportSection: React.FC<SupportSectionProps> = ({ kofiUrl = DEFAULT_KOFI_URL }) => {
  const { t } = useTranslation("settings_common");
  const { others } = useOtherPlugins();

  const [expanded, setExpandedState] = useState(otherPluginsFocus.isExpansionFresh);
  const setExpanded = (v: boolean) => {
    if (v) otherPluginsFocus.markExpanded();
    setExpandedState(v);
  };
  useEffect(() => {
    if (!expanded) return;
    const heartbeat = setInterval(otherPluginsFocus.markExpanded, 1000);
    return () => clearInterval(heartbeat);
  }, [expanded]);

  const wasRestored = useRef(expanded).current;
  const sectionRef = useRef<HTMLDivElement>(null);
  useLandOnFresh(sectionRef, wasRestored, "first");

  return (
    <PanelSection title={t("support_section_title")}>
      <PanelSectionRow>
        <div>
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 8 }}>{t("kofi_description")}</div>
          <QrCodeButton value={kofiUrl} label={t("kofi_button")} hint={t("kofi_hint")} />
        </div>
      </PanelSectionRow>
      {others.length > 0 && (
        <PanelSectionRow>
          <div ref={sectionRef}>
            <CollapsibleSection
              label={t("other_plugins_section_title")}
              expanded={expanded}
              onToggle={() => setExpanded(!expanded)}
            >
              <div style={{ marginTop: 8, marginLeft: 16 }}>
                {others.map((plugin) => (
                  <OtherPluginRow key={plugin.id} plugin={plugin} />
                ))}
              </div>
            </CollapsibleSection>
          </div>
        </PanelSectionRow>
      )}
    </PanelSection>
  );
};
