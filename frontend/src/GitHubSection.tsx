import React, { useState, useRef, useEffect } from "react";
import { PanelSection, PanelSectionRow } from "@decky/ui";
import { QrCodeButton } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";

import { PluginUpdateSection } from "./PluginUpdate";
import { usePluginUpdate } from "./PluginUpdateContext";
import { PluginRelease } from "./types";
import { pluginUpdateFocus, featureRequestFocus, useLandOnFresh } from "./focusRestore";

interface GitHubSectionProps {
  // Only this plugin's own repo knows its release list — see this
  // package's githubReleases.ts (fetchPluginReleases(repo)).
  fetchReleases: () => Promise<PluginRelease[]>;
  featureRequestUrl: string;
  bugReportUrl: string;
}

// Drop-in "GitHub" Settings section: self-update (check + one-click
// install) plus feature-request/bug-report QR codes. Owns all the
// expand-state and focus-restore plumbing internally — a consumer only
// supplies the three URLs/callback that are genuinely its own.
export const GitHubSection: React.FC<GitHubSectionProps> = ({ fetchReleases, featureRequestUrl, bugReportUrl }) => {
  const { t } = useTranslation("settings_common");
  const { info, checking, checkNow } = usePluginUpdate();

  const [expanded, setExpandedState] = useState(pluginUpdateFocus.isExpansionFresh);
  const setExpanded = (v: boolean) => {
    if (v) pluginUpdateFocus.markExpanded();
    setExpandedState(v);
  };
  useEffect(() => {
    if (!expanded) return;
    const heartbeat = setInterval(pluginUpdateFocus.markExpanded, 1000);
    return () => clearInterval(heartbeat);
  }, [expanded]);

  const wasRestored = useRef(expanded).current;
  const sectionRef = useRef<HTMLDivElement>(null);
  useLandOnFresh(sectionRef, wasRestored, "last");

  const featureRequestFresh = useRef(featureRequestFocus.isExpansionFresh()).current;
  const featureRequestRef = useRef<HTMLDivElement>(null);
  useLandOnFresh(featureRequestRef, featureRequestFresh, "first");

  return (
    <PanelSection title={t("github_section_title")}>
      <PanelSectionRow>
        <div ref={sectionRef}>
          <PluginUpdateSection
            info={info}
            checking={checking}
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            onCheckNow={checkNow}
            fetchReleases={fetchReleases}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div ref={featureRequestRef}>
          <QrCodeButton value={featureRequestUrl} label={t("feature_request_button")} hint={t("feature_request_hint")} />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <QrCodeButton value={bugReportUrl} label={t("bug_report_button")} hint={t("bug_report_hint")} />
      </PanelSectionRow>
    </PanelSection>
  );
};
