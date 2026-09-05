import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { call } from "@decky/api";
const makeDefault = (currentVersion) => ({
    currentVersion,
    visible: false,
    dismiss: () => { },
});
const WhatsNewContext = createContext(makeDefault(""));
export const useWhatsNew = () => useContext(WhatsNewContext);
export const WhatsNewProvider = ({ currentVersion, children }) => {
    const [seenVersion, setSeenVersion] = useState(null);
    useEffect(() => {
        call("get_whats_new_seen_version")
            .then((v) => setSeenVersion(v ?? ""))
            .catch(() => setSeenVersion(""));
    }, []);
    const dismiss = () => {
        setSeenVersion(currentVersion);
        call("set_whats_new_seen_version", currentVersion).catch(() => { });
    };
    // null while loading — never show (and never flash) before we actually
    // know what the user has already seen.
    const visible = seenVersion !== null && seenVersion !== currentVersion;
    return (_jsx(WhatsNewContext.Provider, { value: { currentVersion, visible, dismiss }, children: children }));
};
