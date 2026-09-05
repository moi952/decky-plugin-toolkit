const releaseFromJson = (data) => {
    const tag = data?.tag_name;
    if (!tag)
        return null;
    const assets = data.assets ?? [];
    // release.yml uploads exactly one asset per release (the zipped plugin
    // build) — pick whichever asset actually looks like it.
    const zipAsset = assets.find((a) => String(a?.name ?? "").endsWith(".zip"));
    // GitHub's release-asset "digest" field (sha256:<hex>) isn't guaranteed
    // present — Decky's own installer treats an empty checksum as "skip
    // verification", so this degrades gracefully either way.
    const digest = zipAsset?.digest ?? "";
    const sha256 = digest.startsWith("sha256:") ? digest.slice(7) : "";
    return {
        tag,
        version: String(tag).replace(/^v/i, ""),
        url: data.html_url ?? `https://github.com/${data?.full_name ?? ""}/releases/latest`,
        asset_url: zipAsset?.browser_download_url ?? "",
        sha256,
        prerelease: !!data.prerelease,
    };
};
// The Settings UI's version-picker list hits GitHub's own (rate-limited,
// 60/hour/IP anonymous) releases API directly — the api.github.com-free
// resolver (PluginUpdaterMixin.check_plugin_update_now) only ever
// resolves the single *latest* release, not the full list a picker needs.
// `repo` is "owner/name" — the only thing that varies per consumer, so
// callers pass it rather than this package guessing at project.config.json
// (which only exists in the consumer's own repo, not this package's).
export const fetchPluginReleases = async (repo) => {
    try {
        const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=15`);
        if (!res.ok)
            return [];
        const data = await res.json();
        if (!Array.isArray(data))
            return [];
        return data.map(releaseFromJson).filter((r) => !!r && !!r.asset_url);
    }
    catch {
        return [];
    }
};
