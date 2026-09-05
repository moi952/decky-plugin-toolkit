# decky-plugin-toolkit

Shared building blocks for moi952's Decky Loader plugins — extracted from
decky-apps-manager/decky-proton-launch, which stay the reference
implementation for anything not (yet) generalized in here.

Two packages live in this one repo:

- **`decky_plugin_toolkit/`** — Python backend helpers (pip).
- **`frontend/`** — the Settings-page React/TS components (npm, published
  as `@moi952/decky-plugin-toolkit`).

Both are versioned and installed independently, pinned to a tag — a
plugin only picks up a newer toolkit version when *it* bumps that pin and
rebuilds, never silently on its own rebuild.

## What's in the library vs. what stays in your plugin

The rule of thumb: **anything that needs your plugin's own identity
(its repo, its version, its changelog text) stays in your plugin.
Everything else — the actual UI, the update/install mechanics, the
persistence — lives here.**

| Piece | Lives in | Why |
|---|---|---|
| `project.config.json` (githubOwner/githubRepo/displayName) | your plugin | your repo's own identity |
| `plugin_updater.py`'s `resolve_latest_release` + `PluginUpdaterMixin` | **library** | generic GitHub-release resolver |
| `Plugin(PluginUpdaterMixin)` + `_main()` wiring | your plugin | 3-4 lines of glue, see below |
| `check_plugin_update_now`/`resolve_other_plugin_release` RPC methods | **library** (inherited via the mixin) | fixed contract, no glue needed |
| `get_whats_new_seen_version`/`get_other_plugins_seen_ids` etc. | your plugin's `plugin.py` | tiny, not yet extracted — see Backlog |
| `PluginUpdateProvider`/`usePluginUpdate` | **library** | generic, calls the fixed RPC contract |
| `PluginUpdateBanner`/`PluginUpdateSection` | **library** | generic UI, takes `info`/`fetchReleases` as props |
| your own `fetchPluginReleases()` (hits *your* GitHub releases API) | your plugin | only you know your repo |
| `OtherPluginsProvider`/`useOtherPlugins`/`OtherPluginRow` | **library** | generic, manifest URL defaulted |
| your plugin's own id in the manifest (`SELF_PLUGIN_ID`) | your plugin | one constant |
| `WhatsNewProvider`/`WhatsNewCard`/`getWhatsNewVersions()` | **library** | generic paging/display |
| your changelog content (the `whats_new.vX_Y_Z` i18n entries) | your plugin | it's *your* changelog |
| `SettingsView.tsx` (which sections, in what order) | your plugin | every plugin's settings page differs |
| Ko-fi/bug-report/feature-request URLs | your plugin | your own links |

## Installing

**Python** (in your plugin's `package.sh`, before zipping — installs
straight into `py_modules`, not a `vendor/` subfolder, since Decky Loader
already puts `py_modules` on sys.path itself):

```sh
pip3 install --target py_modules --no-deps --upgrade \
  "git+https://github.com/moi952/decky-plugin-toolkit.git@v0.1.0"
```

**Frontend** (in your plugin's `package.json`):

```json
"@moi952/decky-plugin-toolkit": "^0.1.0"
```

(published to npm — see `frontend/README.md` for the exact install
spec if it's ever consumed straight from git instead)

## Using it in a plugin

**Backend** (`py_modules/<your_pkg>/plugin.py`):

```python
from decky_plugin_toolkit import PluginUpdaterMixin

class Plugin(PluginUpdaterMixin):
    async def _main(self):
        info = await self.check_plugin_update_on_load()
        if info:
            await decky.emit("plugin_update_available", info)
    # check_plugin_update_now / resolve_other_plugin_release come free,
    # inherited from PluginUpdaterMixin — no glue code needed for those.
```

Requires a `project.config.json` at the plugin root:

```json
{ "githubOwner": "moi952", "githubRepo": "decky-quick-tab", "displayName": "Quick Tab" }
```

**Frontend** (`index.tsx`):

```tsx
import { PluginUpdateProvider, OtherPluginsProvider, WhatsNewProvider } from "@moi952/decky-plugin-toolkit";

content: (
  <PluginUpdateProvider>
    <OtherPluginsProvider selfPluginId="decky-quick-tab">
      <WhatsNewProvider currentVersion={CURRENT_VERSION}>
        <YourPanel />
      </WhatsNewProvider>
    </OtherPluginsProvider>
  </PluginUpdateProvider>
)
```

**Your own SettingsView.tsx** picks which shared sections to show and
wires the two pieces only you can provide — `fetchReleases` (your repo's
release list) and `versions` (your changelog):

```tsx
import { PluginUpdateSection, WhatsNewCard, getWhatsNewVersions, usePluginUpdate } from "@moi952/decky-plugin-toolkit";
import { fetchPluginReleases } from "../utils/githubReleases"; // your own, ~15 lines

const { info, checking, checkNow } = usePluginUpdate();
<PluginUpdateSection info={info} checking={checking} onCheckNow={checkNow} fetchReleases={fetchPluginReleases} ... />
<WhatsNewCard versions={getWhatsNewVersions()} />
```

**Translations** — merge the library's fixed strings into your own
`i18n.init({ resources })` (see `frontend/src/translations.ts`):

```tsx
import { pluginToolkitTranslations } from "@moi952/decky-plugin-toolkit";
const resources = {
  "en-US": { ...pluginToolkitTranslations["en-US"], ...myOwnEnUS },
};
```

See decky-quick-tab's own `src/i18n/translations.ts` for a real example
(it needs a nested merge on the `whats_new` key specifically, since both
sides contribute to it — the library's older/newer/support_note strings,
your own version entries).

## Releasing a new version

Tag a commit (`git tag v0.1.1 && git push --tags`), publish the frontend
package (`cd frontend && npm publish`), then bump the `@v0.1.1`/`^0.1.1`
pin in whichever consuming plugin(s) should pick it up, and rebuild them.
Nothing updates automatically — that's the point.

## Backlog

Not yet extracted, still duplicated per-plugin: `get_whats_new_seen_version`/
`get_other_plugins_seen_ids` and their setters (trivial JSON-file
persistence, could become two more mixins), and `SettingsView.tsx`'s own
back-button header row (small enough it may not be worth it).
