// src/hooks/useMetaPixel.ts — Fires Meta Pixel PageView on SPA route changes
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Pages that should fire Meta Pixel PageView events */
const TRACKED_PATHS = new Set(["/", "/landing", "/offer"]);

export function useMetaPixel() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    if (!TRACKED_PATHS.has(location.pathname)) return;
    if (typeof window.fbq !== "function") return;

    // The base snippet already fires the initial PageView,
    // so only fire on subsequent SPA navigations
    window.fbq("track", "PageView");
  }, [location.pathname]);
}
