import React, { createContext, useContext, useEffect, useState } from "react";
import { call } from "@decky/api";

interface WhatsNewContextValue {
  currentVersion: string;
  visible: boolean;
  dismiss: () => void;
}

const makeDefault = (currentVersion: string): WhatsNewContextValue => ({
  currentVersion,
  visible: false,
  dismiss: () => {},
});

const WhatsNewContext = createContext<WhatsNewContextValue>(makeDefault(""));

export const useWhatsNew = () => useContext(WhatsNewContext);

interface WhatsNewProviderProps {
  // The consumer's own current version — from its `@decky/manifest`
  // (plugin.json), since that build-time value only exists in the
  // consumer's own bundle, not this package's.
  currentVersion: string;
  children: React.ReactNode;
}

export const WhatsNewProvider: React.FC<WhatsNewProviderProps> = ({ currentVersion, children }) => {
  const [seenVersion, setSeenVersion] = useState<string | null>(null);

  useEffect(() => {
    call<[], string>("get_whats_new_seen_version")
      .then((v) => setSeenVersion(v ?? ""))
      .catch(() => setSeenVersion(""));
  }, []);

  const dismiss = () => {
    setSeenVersion(currentVersion);
    call<[string], boolean>("set_whats_new_seen_version", currentVersion).catch(() => {});
  };

  // null while loading — never show (and never flash) before we actually
  // know what the user has already seen.
  const visible = seenVersion !== null && seenVersion !== currentVersion;

  return (
    <WhatsNewContext.Provider value={{ currentVersion, visible, dismiss }}>{children}</WhatsNewContext.Provider>
  );
};
