import React, { createContext, useContext, useEffect, useState } from "react";
import { call } from "@decky/api";
import { useRemoteJson } from "@moi952/decky-ui-kit";

import { DEFAULT_OTHER_PLUGINS_MANIFEST_URL, OtherPluginEntry, OtherPluginsManifest } from "./types";

interface OtherPluginsContextValue {
  // Every other plugin in the manifest (self excluded) — for the
  // Settings "My other plugins" list, shown regardless of seen state.
  others: OtherPluginEntry[];
  // The subset of `others` not yet in the seen list — for a banner.
  newOnes: OtherPluginEntry[];
  dismissNew: () => void;
}

const OtherPluginsContext = createContext<OtherPluginsContextValue>({
  others: [],
  newOnes: [],
  dismissNew: () => {},
});

export const useOtherPlugins = () => useContext(OtherPluginsContext);

interface OtherPluginsProviderProps {
  // This plugin's own id in the manifest — excluded from its own "other
  // plugins" list (a plugin doesn't announce itself). Only the consumer
  // knows its own id.
  selfPluginId: string;
  // Defaults to the shared https://github.com/moi952/decky-plugins
  // manifest every one of moi952's own plugins uses — override only if a
  // consumer ever needs a different one.
  manifestUrl?: string;
  children: React.ReactNode;
}

export const OtherPluginsProvider: React.FC<OtherPluginsProviderProps> = ({
  selfPluginId,
  manifestUrl = DEFAULT_OTHER_PLUGINS_MANIFEST_URL,
  children,
}) => {
  const { data } = useRemoteJson<OtherPluginsManifest>(manifestUrl);
  // null while loading — never treat "not fetched yet" as "nothing seen",
  // which would flash every entry as new for a moment on every load.
  const [seenIds, setSeenIds] = useState<string[] | null>(null);

  useEffect(() => {
    call<[], string[]>("get_other_plugins_seen_ids")
      .then(setSeenIds)
      .catch(() => setSeenIds([]));
  }, []);

  const others = (data?.plugins ?? []).filter((p: OtherPluginEntry) => p.id !== selfPluginId);
  const newOnes = seenIds === null ? [] : others.filter((p: OtherPluginEntry) => !seenIds.includes(p.id));

  const dismissNew = () => {
    const ids = others.map((p: OtherPluginEntry) => p.id);
    setSeenIds(ids);
    call<[string[]], boolean>("set_other_plugins_seen_ids", ids).catch(() => {});
  };

  return (
    <OtherPluginsContext.Provider value={{ others, newOnes, dismissNew }}>{children}</OtherPluginsContext.Provider>
  );
};
