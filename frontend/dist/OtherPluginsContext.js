import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { call } from "@decky/api";
import { useRemoteJson } from "@moi952/decky-ui-kit";
import { DEFAULT_OTHER_PLUGINS_MANIFEST_URL } from "./types";
const OtherPluginsContext = createContext({
    others: [],
    newOnes: [],
    dismissNew: () => { },
});
export const useOtherPlugins = () => useContext(OtherPluginsContext);
export const OtherPluginsProvider = ({ selfPluginId, manifestUrl = DEFAULT_OTHER_PLUGINS_MANIFEST_URL, children, }) => {
    const { data } = useRemoteJson(manifestUrl);
    // null while loading — never treat "not fetched yet" as "nothing seen",
    // which would flash every entry as new for a moment on every load.
    const [seenIds, setSeenIds] = useState(null);
    useEffect(() => {
        call("get_other_plugins_seen_ids")
            .then(setSeenIds)
            .catch(() => setSeenIds([]));
    }, []);
    const others = (data?.plugins ?? []).filter((p) => p.id !== selfPluginId);
    const newOnes = seenIds === null ? [] : others.filter((p) => !seenIds.includes(p.id));
    const dismissNew = () => {
        const ids = others.map((p) => p.id);
        setSeenIds(ids);
        call("set_other_plugins_seen_ids", ids).catch(() => { });
    };
    return (_jsx(OtherPluginsContext.Provider, { value: { others, newOnes, dismissNew }, children: children }));
};
