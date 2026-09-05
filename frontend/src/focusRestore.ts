import { useEffect } from "react";
import type { RefObject } from "react";

// Shared "land on this section, expanded and focused" signal, for a
// Settings page's own remount-restore logic (a QAM close/reopen tears
// down and recreates the whole React tree — these survive that as plain
// module state, restored only within a short window after the fact).
// One instance per named section — call makeExpansionFocus() once per
// section that needs this, not per component instance.
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

// Ready-made instances for this package's own collapsible sections
// (plugin update, other plugins) and the feature-request QR code (not a
// collapsible section, but the same "was this navigated to recently"
// signal — reused as-is rather than a differently-named twin) — a
// consumer's SettingsView imports these directly rather than calling
// makeExpansionFocus() itself, so the same instance is shared between
// wherever it's marked (e.g. a banner's onClick) and wherever it's read
// (the section's own initial state / focus-restore effect).
export const pluginUpdateFocus = makeExpansionFocus();
export const otherPluginsFocus = makeExpansionFocus();
export const featureRequestFocus = makeExpansionFocus();

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
