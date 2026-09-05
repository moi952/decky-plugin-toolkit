import { PluginRelease } from "./types";
export declare enum PluginInstallType {
    INSTALL = 0,
    REINSTALL = 1,
    UPDATE = 2,
    DOWNGRADE = 3
}
export declare const getDeckyBackend: () => Window["DeckyBackend"] | null;
export declare const installPlugin: (assetUrl: string, displayName: string, version: string, sha256: string, installType: PluginInstallType) => Promise<void>;
export declare const fetchLatestReleaseFor: (repoUrl: string) => Promise<PluginRelease | null>;
