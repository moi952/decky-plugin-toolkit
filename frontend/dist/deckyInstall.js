import { call } from "@decky/api";
// Decky Loader's own PluginInstallType enum — verified against
// backend/decky_loader/browser.py in SteamDeckHomebrew/decky-loader. Only
// used for labeling Decky's own native install-confirm dialog; the actual
// install always installs whatever artifact/version/hash was passed
// regardless of this value.
export var PluginInstallType;
(function (PluginInstallType) {
    PluginInstallType[PluginInstallType["INSTALL"] = 0] = "INSTALL";
    PluginInstallType[PluginInstallType["REINSTALL"] = 1] = "REINSTALL";
    PluginInstallType[PluginInstallType["UPDATE"] = 2] = "UPDATE";
    PluginInstallType[PluginInstallType["DOWNGRADE"] = 3] = "DOWNGRADE";
})(PluginInstallType || (PluginInstallType = {}));
// window.DeckyBackend lives on whichever window actually created this
// document. In Gaming Mode the Quick Access panel renders inside a popup
// window (opened via window.open by Big Picture Mode) — DeckyBackend is
// undefined on that popup's own `window` there, but reachable via
// `window.opener`.
export const getDeckyBackend = () => window.DeckyBackend ?? window.opener?.DeckyBackend ?? null;
// Same native installer the Decky Store itself uses — not scoped to any
// one plugin, so it works just as well for triggering an install of a
// completely different one (see OtherPluginsContext). Only registers the
// request and pops Decky's own native confirm modal (which owns the
// actual download/install and its own progress bar) — returns as soon as
// that request is registered, not when the install itself finishes.
export const installPlugin = (assetUrl, displayName, version, sha256, installType) => {
    const backend = getDeckyBackend();
    if (!backend)
        return Promise.reject(new Error("no_backend"));
    return backend.call("utilities/install_plugin", assetUrl, displayName, version, sha256 || "", installType);
};
// Owner/repo parsed straight from a plain https://github.com/<owner>/<repo>
// URL — every entry in decky-plugins' own manifest already has one.
const parseGitHubRepo = (repoUrl) => {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)\/?$/);
    return match ? { owner: match[1], repo: match[2] } : null;
};
// Latest release for an arbitrary public GitHub repo (not just the
// calling plugin's own) — resolved via THIS plugin's own backend method
// `resolve_other_plugin_release` (see PluginUpdaterMixin in the Python
// package), the same api.github.com-free lookup a plugin's own
// self-update check uses — valid for any repo whose release.yml follows
// the same "<plugin_name>-<tag>.zip" asset-naming convention (every
// plugin in moi952/decky-plugins' manifest does). `parsed.repo` doubles
// as the plugin name that convention needs.
export const fetchLatestReleaseFor = async (repoUrl) => {
    const parsed = parseGitHubRepo(repoUrl);
    if (!parsed)
        return null;
    try {
        return await call("resolve_other_plugin_release", parsed.owner, parsed.repo, parsed.repo);
    }
    catch {
        return null;
    }
};
