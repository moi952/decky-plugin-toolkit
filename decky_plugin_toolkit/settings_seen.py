import json
from pathlib import Path
from typing import List

import decky

# Generic "what has the user already seen" persistence — a single JSON
# value under DECKY_PLUGIN_SETTINGS_DIR, per concern (what's-new version,
# other-plugins ids). Not meant to be used directly; see the two mixins
# below.


def _read(filename: str, key: str, default):
    try:
        path = Path(decky.DECKY_PLUGIN_SETTINGS_DIR) / filename
        if path.is_file():
            return json.loads(path.read_text(encoding="utf-8")).get(key, default)
    except Exception as e:
        decky.logger.error(f"[settings_seen] reading {filename}: {e}")
    return default


def _write(filename: str, key: str, value) -> bool:
    try:
        path = Path(decky.DECKY_PLUGIN_SETTINGS_DIR) / filename
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({key: value}), encoding="utf-8")
        return True
    except Exception as e:
        decky.logger.error(f"[settings_seen] writing {filename}: {e}")
        return False


class WhatsNewSeenMixin:
    """Tracks the last app version the user has already seen the
    changelog for — see the frontend's WhatsNewContext."""

    async def get_whats_new_seen_version(self) -> str:
        return _read("whats_new_seen.json", "version", "")

    async def set_whats_new_seen_version(self, version: str) -> bool:
        return _write("whats_new_seen.json", "version", version)


class OtherPluginsSeenMixin:
    """Tracks which plugin ids from moi952/decky-plugins' manifest the
    user has already seen — see the frontend's OtherPluginsContext."""

    async def get_other_plugins_seen_ids(self) -> List[str]:
        return _read("other_plugins_seen.json", "ids", [])

    async def set_other_plugins_seen_ids(self, ids: List[str]) -> bool:
        return _write("other_plugins_seen.json", "ids", ids)
