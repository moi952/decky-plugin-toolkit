import React from "react";
import { OtherPluginEntry } from "./types";
interface OtherPluginsContextValue {
    others: OtherPluginEntry[];
    newOnes: OtherPluginEntry[];
    dismissNew: () => void;
}
export declare const useOtherPlugins: () => OtherPluginsContextValue;
interface OtherPluginsProviderProps {
    selfPluginId: string;
    manifestUrl?: string;
    children: React.ReactNode;
}
export declare const OtherPluginsProvider: React.FC<OtherPluginsProviderProps>;
export {};
