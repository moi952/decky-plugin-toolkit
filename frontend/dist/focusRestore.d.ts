export interface ExpansionFocus {
    markExpanded(): void;
    isExpansionFresh(): boolean;
}
export declare const makeExpansionFocus: () => ExpansionFocus;
export declare const pluginUpdateFocus: ExpansionFocus;
export declare const otherPluginsFocus: ExpansionFocus;
