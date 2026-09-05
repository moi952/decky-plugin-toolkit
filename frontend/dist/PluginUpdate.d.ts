import { PluginRelease, PluginUpdateInfo } from "./types";
export type { PluginUpdateInfo, PluginRelease };
interface PluginUpdateBannerProps {
    info: PluginUpdateInfo | null;
    onClick: () => void;
}
export declare function PluginUpdateBanner({ info, onClick }: PluginUpdateBannerProps): import("react/jsx-runtime").JSX.Element | null;
interface PluginUpdateSectionProps {
    info: PluginUpdateInfo | null;
    checking: boolean;
    expanded: boolean;
    onToggle: () => void;
    onCheckNow: () => void;
    fetchReleases: () => Promise<PluginRelease[]>;
}
export declare function PluginUpdateSection({ info, checking, expanded, onToggle, onCheckNow, fetchReleases, }: PluginUpdateSectionProps): import("react/jsx-runtime").JSX.Element;
