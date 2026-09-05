import React from "react";
export interface WhatsNewVersionEntry {
    key: string;
    title: string;
    items: string[];
}
interface WhatsNewCardProps {
    versions: WhatsNewVersionEntry[];
    initialVersionKey?: string;
    dismissLabel?: string;
    onDismiss?: () => void;
    onFeatureRequest?: () => void;
    featureRequestLabel?: React.ReactNode;
}
export declare const WhatsNewCard: React.FC<WhatsNewCardProps>;
export {};
