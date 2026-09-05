import json
import re
from pathlib import Path
from typing import Any, Dict, Optional

import decky

from . import http_json
from .project_config import load_project_config

# Checks GitHub Releases for a newer build of this plugin than the one
# currently installed. Meant to be called once from Plugin._main() so a
# notification can fire once per Decky Loader session even if the user
# never opens the plugin's own panel — a plain frontend fetch() only runs
# once that panel actually mounts.
PLUGIN_JSON_PATH = Path(decky.DECKY_PLUGIN_DIR) / "plugin.json"
# release.yml's own $PLUGIN_NAME comes from package.json's "name" (the npm
# package / repo name, e.g. "decky-quick-tab") — a different field from
# plugin.json's "name" (the human-readable display name, e.g. "Quick
# Tab"). Only the former matches the asset filename it actually uploads.
PACKAGE_JSON_PATH = Path(decky.DECKY_PLUGIN_DIR) / "package.json"

_TAG_RE = re.compile(r"/releases/download/([^/]+)/")


def _github_repo() -> str:
    config = load_project_config()
    return f"{config['githubOwner']}/{config['githubRepo']}"


def _version_tuple(v: str):
    """'1.2.10' -> (1, 2, 10), tolerant of a leading 'v' and non-numeric
    trailing junk (e.g. a '-beta' suffix on a hand-made tag)."""
    parts = []
    for p in v.lstrip("vV").split("."):
        m = re.match(r"\d+", p)
        parts.append(int(m.group()) if m else 0)
    return tuple(parts)


async def resolve_latest_release(repo: str, plugin_name: str) -> Optional[Dict[str, Any]]:
    """Resolves `repo`'s latest GitHub release — a tag and a matching
    asset download URL — without ever calling api.github.com, sidestepping
    its 60/hour/IP anonymous quota entirely. Costs: no sha256 digest (a
    missing one should be treated as "skip verification" by the caller's
    own installer) and no prerelease flag (moot if release.yml never
    publishes a prerelease).

    Relies on two things outside that rate-limited API:
    - github.com/<repo>/releases/latest/download/<anything> redirects to
      the real latest release's tag regardless of whether <anything> is
      an actual asset in it, so a HEAD there resolves the tag for free.
    - The consuming project's release.yml always names its single
      uploaded asset "<plugin_name>-<tag>.zip" — once the tag is known,
      the asset name can be constructed instead of looked up, and
      confirmed with one more free HEAD (not the API) rather than handed
      out blind.
    """
    location = await http_json.resolve_redirect(
        f"https://github.com/{repo}/releases/latest/download/_"
    )
    if not location:
        return None
    match = _TAG_RE.search(location)
    if not match:
        return None
    tag = match.group(1)
    asset_name = f"{plugin_name}-{tag}.zip"
    asset_url = f"https://github.com/{repo}/releases/download/{tag}/{asset_name}"
    if not await http_json.url_exists(asset_url):
        return None
    return {
        "tag": tag,
        "version": tag.lstrip("vV"),
        "url": f"https://github.com/{repo}/releases/tag/{tag}",
        "asset_url": asset_url,
        "sha256": "",
        "prerelease": False,
    }


class PluginUpdaterMixin:
    """Backend half of the plugin self-update check. Mix into a plugin's
    own `Plugin` class so its methods are reachable from `_main()` and
    from frontend `call()`s — see this package's README for the two RPC
    methods a consuming plugin should expose (thin passthroughs to
    check_plugin_update_on_load/check_plugin_update_now below)."""

    def _read_plugin_json(self) -> Dict[str, Any]:
        try:
            return json.loads(PLUGIN_JSON_PATH.read_text(encoding="utf-8"))
        except Exception as e:
            decky.logger.error(f"[plugin_updater] reading plugin.json: {e}")
            return {}

    def _read_package_json(self) -> Dict[str, Any]:
        try:
            return json.loads(PACKAGE_JSON_PATH.read_text(encoding="utf-8"))
        except Exception as e:
            decky.logger.error(f"[plugin_updater] reading package.json: {e}")
            return {}

    def _self_identity(self) -> tuple:
        """(current_version, display_name, plugin_name, repo) — plugin_name
        is package.json's "name" (release.yml's own $PLUGIN_NAME, the asset-
        naming key resolve_latest_release needs), not plugin.json's "name"
        (the human-readable display_name — a different field)."""
        plugin_json = self._read_plugin_json()
        current = str(plugin_json.get("version", ""))
        display_name = str(plugin_json.get("name", load_project_config()["displayName"]))
        plugin_name = str(self._read_package_json().get("name", "")) or _github_repo().split("/")[-1]
        return current, display_name, plugin_name, _github_repo()

    async def check_plugin_update_on_load(self) -> Optional[Dict[str, Any]]:
        """Called once from _main(). Returns the update-info dict (matching
        the frontend's PluginUpdateInfo shape) only when a newer version is
        actually available — None otherwise, including on any check failure
        (nothing to notify about in that case)."""
        current, display_name, plugin_name, repo = self._self_identity()
        release = await resolve_latest_release(repo, plugin_name)
        if release is None:
            return None

        if _version_tuple(release["version"]) <= _version_tuple(current):
            return None

        return {
            "current_version": current,
            "latest_version": release["version"],
            "has_update": True,
            "release_url": release["url"],
            "asset_url": release["asset_url"],
            "sha256": release["sha256"],
            "plugin_display_name": display_name,
            "checked_ok": True,
        }

    async def check_plugin_update_now(self) -> Dict[str, Any]:
        """Same resolution as check_plugin_update_on_load, but always
        returns the full PluginUpdateInfo shape — even with no update
        available, or the check itself failing — since this is what a
        Settings section's own on-mount check should call."""
        current, display_name, plugin_name, repo = self._self_identity()
        empty = {
            "current_version": current,
            "latest_version": "",
            "has_update": False,
            "release_url": f"https://github.com/{repo}/releases/latest",
            "asset_url": "",
            "sha256": "",
            "plugin_display_name": display_name,
            "checked_ok": False,
        }
        try:
            release = await resolve_latest_release(repo, plugin_name)
        except Exception as e:
            decky.logger.error(f"[check_plugin_update_now] {e}")
            return empty
        if release is None:
            return empty
        return {
            "current_version": current,
            "latest_version": release["version"],
            "has_update": _version_tuple(release["version"]) > _version_tuple(current),
            "release_url": release["url"],
            "asset_url": release["asset_url"],
            "sha256": release["sha256"],
            "plugin_display_name": display_name,
            "checked_ok": True,
        }

    # Resolves an *arbitrary* public GitHub repo's latest release — used by
    # a "My other plugins" list (see the frontend's OtherPluginRow) to
    # offer a one-click install of a sibling plugin, via the same
    # api.github.com-free lookup a plugin's own self-update check uses.
    # Free-standing (doesn't touch self-identity), inherited by every
    # consumer for free — no per-plugin glue code needed for this one.
    async def resolve_other_plugin_release(self, owner: str, repo: str, plugin_name: str):
        return await resolve_latest_release(f"{owner}/{repo}", plugin_name)
