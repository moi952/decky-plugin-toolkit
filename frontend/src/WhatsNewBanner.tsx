import React from "react";
import { useTranslation } from "react-i18next";

import { useWhatsNew } from "./WhatsNewContext";
import { WhatsNewCard, WhatsNewVersionEntry } from "./WhatsNewCard";
import { currentVersionKey } from "./whatsNewVersions";

interface WhatsNewBannerProps {
  versions: WhatsNewVersionEntry[];
  onFeatureRequest?: () => void;
}

// Home-screen banner: shows only while the current version hasn't been
// dismissed yet (see WhatsNewProvider). Renders nothing once dismissed, or
// if this version has no changelog entry (e.g. a release with no
// user-facing bullet) — never points at unrelated older history instead.
export const WhatsNewBanner: React.FC<WhatsNewBannerProps> = ({ versions, onFeatureRequest }) => {
  const { t } = useTranslation("whats_new");
  const { t: tCommon } = useTranslation("settings_common");
  const { currentVersion, visible, dismiss } = useWhatsNew();

  if (!visible) return null;

  const key = currentVersionKey(currentVersion);
  if (!versions.some((v) => v.key === key)) return null;

  return (
    <div style={{ margin: "0 16px 12px" }}>
      <WhatsNewCard
        versions={versions}
        initialVersionKey={key}
        dismissLabel={t("dismiss")}
        onDismiss={dismiss}
        onFeatureRequest={onFeatureRequest}
        featureRequestLabel={onFeatureRequest ? tCommon("feature_request_button") : undefined}
      />
    </div>
  );
};
