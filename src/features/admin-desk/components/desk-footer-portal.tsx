"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const DESK_FOOTER_ID = "desk-main-footer";

/** Portal into the main-column footer strip (sibling of the scroller). */
export function DeskFooterPortal({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setEl(document.getElementById(DESK_FOOTER_ID));
  }, []);
  if (!el) return null;
  return createPortal(children, el);
}
