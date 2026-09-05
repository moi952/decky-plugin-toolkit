import { useEffect } from "react";
import type { RefObject } from "react";

// Survives a QAM close/reopen remount as plain module state, not React
// state — one instance per section, restored only within a short window.
const RESTORE_WINDOW_MS = 5000;

export interface ExpansionFocus {
  markExpanded(): void;
  isExpansionFresh(): boolean;
}

export const makeExpansionFocus = (): ExpansionFocus => {
  let expandedAt = 0;
  return {
    markExpanded: () => {
      expandedAt = Date.now();
    },
    isExpansionFresh: () => Date.now() - expandedAt < RESTORE_WINDOW_MS,
  };
};

// Ready-made shared instances — a consumer's SettingsView imports these
// directly so the mark (a banner's onClick) and the read (the section's
// initial state) share the same instance.
export const pluginUpdateFocus = makeExpansionFocus();
export const otherPluginsFocus = makeExpansionFocus();
export const featureRequestFocus = makeExpansionFocus();

// Same idea as ExpansionFocus, but remembers *which ones* of several items
// (e.g. several plugins in a list) should land pre-expanded — the
// OtherPluginsBanner's single button marks every plugin it's currently
// announcing here. The parent rendering the list (SupportSection) reads
// this once to decide, per row, whether it should start expanded, and
// which single one (the first match, in list order) should actually take
// focus — see OtherPluginRow's `startExpanded`/`autoFocus` props.
export interface SetFocus {
  markFocused(ids: string[]): void;
  getFreshIds(): Set<string>;
}

export const makeSetFocus = (): SetFocus => {
  let ids: Set<string> = new Set();
  let markedAt = 0;
  return {
    markFocused: (list: string[]) => {
      ids = new Set(list);
      markedAt = Date.now();
    },
    getFreshIds: () => (Date.now() - markedAt < RESTORE_WINDOW_MS ? ids : new Set()),
  };
};

export const otherPluginItemFocus = makeSetFocus();

// Focuses + scrolls to the first (or last) enabled focusable element
// inside `ref`'s container, but only when `isFresh` is true (a recent
// mark via one of the ExpansionFocus instances above) — otherwise a
// completely normal landing on this page does nothing. Retried on a few
// delays since some targets (e.g. a release-picker's install button)
// start disabled until an async fetch finishes.
export function useLandOnFresh(
  ref: RefObject<HTMLElement | null>,
  isFresh: boolean,
  which: "first" | "last" = "first",
) {
  useEffect(() => {
    if (!isFresh) return;
    const focusAndScroll = () => {
      const container = ref.current;
      if (!container) return;
      const focusables = container.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([aria-disabled="true"]), [tabindex]:not([disabled]):not([aria-disabled="true"]), a[href]',
      );
      const target = which === "last" ? focusables[focusables.length - 1] : focusables[0];
      if (!target) return;
      target.focus();
      // Delayed a couple of frames so it runs after Steam's own
      // focus-driven scroll adjustment, not before it (it overrides ours).
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.scrollIntoView({ block: "center" });
        });
      });
    };

    focusAndScroll();
    const retries = [300, 700, 1200].map((delay) => setTimeout(focusAndScroll, delay));
    return () => retries.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFresh]);
}
