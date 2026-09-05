import i18n from "i18next";

import { WhatsNewVersionEntry } from "./WhatsNewCard";

const VERSION_KEY_RE = /^v(\d+)_(\d+)_(\d+)$/;

// "0.16.2" -> "v0_16_2" — the i18n key convention every whats_new entry
// uses. Used by WhatsNewBanner to find the entry matching the version
// that's actually currently installed (not just "the newest one" — those
// can differ if a release shipped with no user-facing bullet).
export const currentVersionKey = (version: string): string => `v${version.replace(/\./g, "_")}`;

const parseKey = (key: string): number[] | null => {
  const m = key.match(VERSION_KEY_RE);
  return m ? m.slice(1).map(Number) : null;
};

// Builds WhatsNewCard's `versions` prop from the consumer's own "whats_new"
// i18n namespace ("vX_Y_Z": {title, items}), newest first. The changelog
// *content* stays entirely in the consumer's own locale files — this just
// reads whatever's there, generically.
export const getWhatsNewVersions = (): WhatsNewVersionEntry[] => {
  const bundle =
    i18n.getResourceBundle(i18n.language, "whats_new") || i18n.getResourceBundle("en-US", "whats_new") || {};

  return Object.keys(bundle)
    .filter((k) => VERSION_KEY_RE.test(k))
    .sort((a, b) => {
      const pa = parseKey(a)!;
      const pb = parseKey(b)!;
      for (let i = 0; i < 3; i++) {
        if (pa[i] !== pb[i]) return pb[i] - pa[i];
      }
      return 0;
    })
    .map((key) => ({
      key,
      title: bundle[key]?.title ?? key,
      items: Array.isArray(bundle[key]?.items) ? bundle[key].items : [],
    }));
};
