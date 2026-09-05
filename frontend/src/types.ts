// Shapes shared with the Python side (decky_plugin_toolkit.plugin_updater) —
// keep in sync with PluginUpdaterMixin.check_plugin_update_now's return dict.
export interface PluginUpdateInfo {
  current_version: string;
  latest_version: string;
  has_update: boolean;
  release_url: string;
  asset_url: string;
  sha256: string;
  plugin_display_name: string;
  checked_ok: boolean;
}

export interface PluginRelease {
  tag: string;
  version: string;
  url: string;
  asset_url: string;
  sha256: string;
  prerelease: boolean;
}

// Matches the schema at https://github.com/moi952/decky-plugins (plugins.json).
export interface OtherPluginEntry {
  id: string;
  name: string;
  url: string;
  icon: string;
  steamOsOnly?: boolean;
  description: Record<string, string>;
}

export interface OtherPluginsManifest {
  schemaVersion: number;
  plugins: OtherPluginEntry[];
}

// description is keyed by locale, with en-US as the guaranteed fallback.
export const localizedDescription = (entry: OtherPluginEntry, locale: string): string =>
  entry.description[locale] ?? entry.description["en-US"] ?? "";

// The default manifest every one of moi952's plugins shares — override via
// OtherPluginsProvider's own `manifestUrl` prop only if a consumer ever
// needs a different one.
export const DEFAULT_OTHER_PLUGINS_MANIFEST_URL =
  "https://cdn.jsdelivr.net/gh/moi952/decky-plugins@main/plugins.json";

// Same Ko-fi page for every one of moi952's plugins — override via
// SupportSection's own `kofiUrl` prop only if a consumer ever needs a
// different one.
export const DEFAULT_KOFI_URL = "https://ko-fi.com/moi952";
