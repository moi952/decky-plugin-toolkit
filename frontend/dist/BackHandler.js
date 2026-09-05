import { jsx as _jsx } from "react/jsx-runtime";
import { Focusable } from "@decky/ui";
// Wraps a view so the physical B button (Focusable's onCancelButton) also
// triggers onBack, not just an on-screen back button.
export const BackHandler = ({ onBack, children }) => (_jsx(Focusable, { onCancelButton: onBack, children: children }));
