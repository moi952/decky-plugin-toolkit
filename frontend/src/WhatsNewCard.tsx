import React, { useState } from "react";
import { Focusable } from "@decky/ui";
import { ActionButton } from "@moi952/decky-ui-kit";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiGift, FiCoffee } from "react-icons/fi";

export interface WhatsNewVersionEntry {
  key: string;
  title: string;
  items: string[];
}

interface WhatsNewCardProps {
  // The consumer's own changelog entries, newest first — this is the one
  // genuinely per-plugin piece (each plugin writes its own changelog), so
  // it's a required prop rather than something this package looks up from
  // i18n itself. A small per-consumer helper reading its own "whats_new"
  // i18n namespace (newest-first, "vX_Y_Z" keys) builds this list — see
  // this package's README for that ~15-line helper.
  versions: WhatsNewVersionEntry[];
  initialVersionKey?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  onFeatureRequest?: () => void;
  featureRequestLabel?: React.ReactNode;
}

// Shared prev/next-paging changelog card. Uses the "whats_new" i18n
// namespace only for its own fixed strings (older/newer/support_note) —
// see this package's translations.ts for the resource bundle to merge
// into the consumer's own i18n.init().
export const WhatsNewCard: React.FC<WhatsNewCardProps> = ({
  versions,
  initialVersionKey,
  dismissLabel,
  onDismiss,
  onFeatureRequest,
  featureRequestLabel,
}) => {
  const { t } = useTranslation("whats_new");
  const [index, setIndex] = useState(() => {
    const i = initialVersionKey ? versions.findIndex((v) => v.key === initialVersionKey) : 0;
    return i >= 0 ? i : 0;
  });

  if (versions.length === 0) return null;

  const { title, items } = versions[index];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "16px 14px 14px",
        borderRadius: 8,
        background: "#1a2a1a",
        border: "1px solid #4caf50",
      }}
    >
      <FiGift style={{ fontSize: 30, color: "#4caf50", marginBottom: 8 }} />
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <ul
        style={{
          textAlign: "left",
          fontSize: 11,
          opacity: 0.85,
          margin: "0 0 14px",
          paddingLeft: 18,
          lineHeight: 1.5,
        }}
      >
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {item}
          </li>
        ))}
      </ul>

      {versions.length > 1 && (
        <Focusable
          style={{
            display: "flex",
            width: "100%",
            gap: 8,
            marginBottom: dismissLabel && onDismiss ? 10 : 0,
          }}
          flow-children="horizontal"
        >
          <div style={{ flex: 1 }}>
            <ActionButton
              width="100%"
              disabled={index === versions.length - 1}
              onClick={() => setIndex((i) => Math.min(i + 1, versions.length - 1))}
            >
              <FiChevronLeft size={12} style={{ marginRight: 4 }} />
              {t("older")}
            </ActionButton>
          </div>
          <div style={{ flex: 1 }}>
            <ActionButton width="100%" disabled={index === 0} onClick={() => setIndex((i) => Math.max(i - 1, 0))}>
              {t("newer")}
              <FiChevronRight size={12} style={{ marginLeft: 4 }} />
            </ActionButton>
          </div>
        </Focusable>
      )}

      {onFeatureRequest && (
        <div style={{ width: "100%", marginBottom: dismissLabel && onDismiss ? 10 : 0 }}>
          <ActionButton onClick={onFeatureRequest} width="100%">
            <FiExternalLink size={12} style={{ marginRight: 6 }} />
            {featureRequestLabel}
          </ActionButton>
        </div>
      )}

      {dismissLabel && onDismiss && (
        <ActionButton onClick={onDismiss} width="100%">
          {dismissLabel}
        </ActionButton>
      )}

      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
        <FiCoffee size={11} style={{ flexShrink: 0 }} />
        {t("support_note")}
      </div>
    </div>
  );
};
