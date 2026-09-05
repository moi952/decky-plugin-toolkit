// description is keyed by locale, with en-US as the guaranteed fallback.
export const localizedDescription = (entry, locale) => entry.description[locale] ?? entry.description["en-US"] ?? "";
// The default manifest every one of moi952's plugins shares — override via
// OtherPluginsProvider's own `manifestUrl` prop only if a consumer ever
// needs a different one.
export const DEFAULT_OTHER_PLUGINS_MANIFEST_URL = "https://cdn.jsdelivr.net/gh/moi952/decky-plugins@main/plugins.json";
