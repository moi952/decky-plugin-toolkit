import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { useWhatsNew } from "./WhatsNewContext";
import { WhatsNewCard } from "./WhatsNewCard";
import { currentVersionKey } from "./whatsNewVersions";
// Home-screen banner: shows only while the current version hasn't been
// dismissed yet (see WhatsNewProvider). Renders nothing once dismissed, or
// if this version has no changelog entry (e.g. a release with no
// user-facing bullet) — never points at unrelated older history instead.
export const WhatsNewBanner = ({ versions, onFeatureRequest }) => {
    const { t } = useTranslation("whats_new");
    const { t: tCommon } = useTranslation("settings_common");
    const { currentVersion, visible, dismiss } = useWhatsNew();
    if (!visible)
        return null;
    const key = currentVersionKey(currentVersion);
    if (!versions.some((v) => v.key === key))
        return null;
    return (_jsx("div", { style: { margin: "0 16px 12px" }, children: _jsx(WhatsNewCard, { versions: versions, initialVersionKey: key, dismissLabel: t("dismiss"), onDismiss: dismiss, onFeatureRequest: onFeatureRequest, featureRequestLabel: onFeatureRequest ? tCommon("feature_request_button") : undefined }) }));
};
