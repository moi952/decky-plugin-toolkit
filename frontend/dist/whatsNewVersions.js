import i18n from "i18next";
const VERSION_KEY_RE = /^v(\d+)_(\d+)_(\d+)$/;
const parseKey = (key) => {
    const m = key.match(VERSION_KEY_RE);
    return m ? m.slice(1).map(Number) : null;
};
// Builds WhatsNewCard's `versions` prop from the consumer's own "whats_new"
// i18n namespace ("vX_Y_Z": {title, items}), newest first. The changelog
// *content* stays entirely in the consumer's own locale files — this just
// reads whatever's there, generically.
export const getWhatsNewVersions = () => {
    const bundle = i18n.getResourceBundle(i18n.language, "whats_new") || i18n.getResourceBundle("en-US", "whats_new") || {};
    return Object.keys(bundle)
        .filter((k) => VERSION_KEY_RE.test(k))
        .sort((a, b) => {
        const pa = parseKey(a);
        const pb = parseKey(b);
        for (let i = 0; i < 3; i++) {
            if (pa[i] !== pb[i])
                return pb[i] - pa[i];
        }
        return 0;
    })
        .map((key) => ({
        key,
        title: bundle[key]?.title ?? key,
        items: Array.isArray(bundle[key]?.items) ? bundle[key].items : [],
    }));
};
