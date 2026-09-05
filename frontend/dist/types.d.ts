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
export declare const localizedDescription: (entry: OtherPluginEntry, locale: string) => string;
export declare const DEFAULT_OTHER_PLUGINS_MANIFEST_URL = "https://cdn.jsdelivr.net/gh/moi952/decky-plugins@main/plugins.json";
