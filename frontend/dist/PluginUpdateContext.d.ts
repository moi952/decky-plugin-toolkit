import React from "react";
import { PluginUpdateInfo } from "./types";
interface PluginUpdateContextValue {
    info: PluginUpdateInfo | null;
    checking: boolean;
    checkNow: () => Promise<void>;
}
export declare const PluginUpdateProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const usePluginUpdate: () => PluginUpdateContextValue;
export {};
