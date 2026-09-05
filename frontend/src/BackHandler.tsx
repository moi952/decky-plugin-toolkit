import React from "react";
import { Focusable } from "@decky/ui";

interface BackHandlerProps {
  onBack?: () => void;
  children: React.ReactNode;
}

// Wraps a view so the physical B button (Focusable's onCancelButton) also
// triggers onBack, not just an on-screen back button.
export const BackHandler: React.FC<BackHandlerProps> = ({ onBack, children }) => (
  <Focusable onCancelButton={onBack}>{children}</Focusable>
);
