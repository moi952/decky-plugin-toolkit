import type { RefObject } from "react";
export interface ExpansionFocus {
    markExpanded(): void;
    isExpansionFresh(): boolean;
}
export declare const makeExpansionFocus: () => ExpansionFocus;
export declare const pluginUpdateFocus: ExpansionFocus;
export declare const otherPluginsFocus: ExpansionFocus;
export declare const featureRequestFocus: ExpansionFocus;
export declare function useLandOnFresh(ref: RefObject<HTMLElement | null>, isFresh: boolean, which?: "first" | "last"): void;
