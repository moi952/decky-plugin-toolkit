// Shared "land on this section, expanded and focused" signal, for a
// Settings page's own remount-restore logic (a QAM close/reopen tears
// down and recreates the whole React tree — these survive that as plain
// module state, restored only within a short window after the fact).
// One instance per named section — call makeExpansionFocus("my-section")
// once per section that needs this, not per component instance.
const RESTORE_WINDOW_MS = 5000;
export const makeExpansionFocus = () => {
    let expandedAt = 0;
    return {
        markExpanded: () => {
            expandedAt = Date.now();
        },
        isExpansionFresh: () => Date.now() - expandedAt < RESTORE_WINDOW_MS,
    };
};
// Ready-made instances for this package's own two collapsible sections
// (plugin update, other plugins) — a consumer's SettingsView imports these
// directly rather than calling makeExpansionFocus() itself, so the same
// instance is shared between wherever it's marked (e.g. a banner's
// onClick) and wherever it's read (the section's own initial state).
export const pluginUpdateFocus = makeExpansionFocus();
export const otherPluginsFocus = makeExpansionFocus();
