// src/hooks/usePageTracker.ts — Tracks page views to Google Sheets via Apps Script
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ANALYTICS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxggJOURfWUJZlQScsLW_DDs-t6mR_2H3mBJdqvCVPsgHQWF50DwJVG5SN4Y9YhQ3eH-A/exec";

export function usePageTracker() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    // Avoid duplicate fires for the same path
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    // Don't track the dashboard itself
    if (location.pathname === "/dashboard") return;

    const payload = {
      path: location.pathname,
      referrer: document.referrer || "(direct)",
      screenWidth: window.innerWidth,
      timestamp: new Date().toISOString(),
    };

    // Fire-and-forget — don't block rendering
    fetch(ANALYTICS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently fail — analytics should never break the app
    });
  }, [location.pathname]);
}
