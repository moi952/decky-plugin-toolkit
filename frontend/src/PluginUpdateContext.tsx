import React, { createContext, useContext, useEffect, useState } from "react";
import { call } from "@decky/api";

import { PluginUpdateInfo } from "./types";

// Fixed RPC contract every consumer's backend implements via
// PluginUpdaterMixin (see the Python package in this same repo).
const fetchInfo = async (): Promise<PluginUpdateInfo> => {
  try {
    return await call<[], PluginUpdateInfo>("check_plugin_update_now");
  } catch {
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

interface PluginUpdateContextValue {
  info: PluginUpdateInfo | null;
  checking: boolean;
  checkNow: () => Promise<void>;
}

const PluginUpdateContext = createContext<PluginUpdateContextValue | null>(null);

// Survives a remount of whatever renders this Provider (e.g. the QAM
// closing/reopening) — module-level, not component state, so `info`
// doesn't reset to null and flash "checking..." again every time the
// panel is reopened.
let lastInfo: PluginUpdateInfo | null = null;

export const PluginUpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [info, setInfoState] = useState<PluginUpdateInfo | null>(lastInfo);
  const [checking, setChecking] = useState(false);

  const setInfo = (value: PluginUpdateInfo | null) => {
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
    } finally {
      setChecking(false);
    }
  };

  return (
    <PluginUpdateContext.Provider value={{ info, checking, checkNow }}>{children}</PluginUpdateContext.Provider>
  );
};

export const usePluginUpdate = () => {
  const ctx = useContext(PluginUpdateContext);
  if (!ctx) throw new Error("usePluginUpdate must be used within PluginUpdateProvider");
  return ctx;
};
