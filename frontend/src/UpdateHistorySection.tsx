import React, { useState } from "react";
import { PanelSection, PanelSectionRow } from "@decky/ui";
import { CollapsibleSection } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";

import { WhatsNewCard, WhatsNewVersionEntry } from "./WhatsNewCard";

interface UpdateHistorySectionProps {
  // The consumer's own changelog — see getWhatsNewVersions().
  versions: WhatsNewVersionEntry[];
}

// Drop-in "Update history" collapse for a Settings page — collapsed by
// default, styled to match decky-apps-manager's own spacing exactly
// (margin above the row, a separator after the expanded content, margin
// between the toggle and the card).
export const UpdateHistorySection: React.FC<UpdateHistorySectionProps> = ({ versions }) => {
  const { t } = useTranslation("settings_common");
  const [expanded, setExpanded] = useState(false);

  return (
    <PanelSection>
      <PanelSectionRow>
        <div style={{ marginTop: 8 }}>
          <CollapsibleSection
            label={t("whats_new_history")}
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
            contentBottomSeparator
          >
            <div style={{ marginTop: 8 }}>
              <WhatsNewCard versions={versions} />
            </div>
          </CollapsibleSection>
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
};
