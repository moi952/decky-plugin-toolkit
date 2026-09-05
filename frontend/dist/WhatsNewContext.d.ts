import React from "react";
interface WhatsNewContextValue {
    currentVersion: string;
    visible: boolean;
    dismiss: () => void;
}
export declare const useWhatsNew: () => WhatsNewContextValue;
interface WhatsNewProviderProps {
    currentVersion: string;
    children: React.ReactNode;
}
export declare const WhatsNewProvider: React.FC<WhatsNewProviderProps>;
export {};
