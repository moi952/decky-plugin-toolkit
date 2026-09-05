import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { call } from "@decky/api";
// Fixed RPC contract every consumer's backend implements via
// PluginUpdaterMixin (see the Python package in this same repo).
const fetchInfo = async () => {
    try {
        return await call("check_plugin_update_now");
    }
    catch {
        return {
            current_version: "",
            latest_version: "",
            has_update: false,
            release_url: "",
            asset_url: "",
            sha256: "",
            plugin_display_name: "",
            checked_ok: false,
        };
    }
};
const PluginUpdateContext = createContext(null);
// Survives a remount of whatever renders this Provider (e.g. the QAM
// closing/reopening) — module-level, not component state, so `info`
// doesn't reset to null and flash "checking..." again every time the
// panel is reopened.
let lastInfo = null;
export const PluginUpdateProvider = ({ children }) => {
    const [info, setInfoState] = useState(lastInfo);
    const [checking, setChecking] = useState(false);
    const setInfo = (value) => {
        lastInfo = value;
        setInfoState(value);
    };
    useEffect(() => {
        fetchInfo().then(setInfo);
    }, []);
    const checkNow = async () => {
        setChecking(true);
        try {
            setInfo(await fetchInfo());
        }
        finally {
            setChecking(false);
        }
    };
    return (_jsx(PluginUpdateContext.Provider, { value: { info, checking, checkNow }, children: children }));
};
export const usePluginUpdate = () => {
    const ctx = useContext(PluginUpdateContext);
    if (!ctx)
        throw new Error("usePluginUpdate must be used within PluginUpdateProvider");
    return ctx;
};
