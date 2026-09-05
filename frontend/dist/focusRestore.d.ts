import type { RefObject } from "react";
export interface ExpansionFocus {
    markExpanded(): void;
    isExpansionFresh(): boolean;
    consumeIsExpansionFresh(): boolean;
}
export declare const makeExpansionFocus: () => ExpansionFocus;
export declare const pluginUpdateFocus: ExpansionFocus;
export declare const otherPluginsFocus: ExpansionFocus;
export declare const featureRequestFocus: ExpansionFocus;
export interface SetFocus {
    markFocused(ids: string[]): void;
    getFreshIds(): Set<string>;
    consumeFreshIds(): Set<string>;
}
export declare const makeSetFocus: () => SetFocus;
export declare const otherPluginItemFocus: SetFocus;
export declare function useLandOnFresh(ref: RefObject<HTMLElement | null>, isFresh: boolean, which?: "first" | "last"): void;
