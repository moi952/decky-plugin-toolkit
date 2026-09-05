import React from "react";
import { WhatsNewVersionEntry } from "./WhatsNewCard";
interface WhatsNewBannerProps {
    versions: WhatsNewVersionEntry[];
    onFeatureRequest?: () => void;
}
export declare const WhatsNewBanner: React.FC<WhatsNewBannerProps>;
export {};
