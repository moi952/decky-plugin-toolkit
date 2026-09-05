import React from "react";
import { PluginRelease } from "./types";
interface GitHubSectionProps {
    fetchReleases: () => Promise<PluginRelease[]>;
    featureRequestUrl: string;
    bugReportUrl: string;
}
export declare const GitHubSection: React.FC<GitHubSectionProps>;
export {};
