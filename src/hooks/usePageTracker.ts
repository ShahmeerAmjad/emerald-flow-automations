// src/hooks/usePageTracker.ts — Tracks page views to Google Sheets via Apps Script
// Uses image beacon pattern (GET with query params) for maximum reliability
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ANALYTICS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxggJOURfWUJZlQScsLW_DDs-t6mR_2H3mBJdqvCVPsgHQWF50DwJVG5SN4Y9YhQ3eH-A/exec";

const GEO_CACHE_KEY = "visitor_geo";

interface GeoData {
  ip: string;
  city: string;
  country: string;
  region: string;
}

function parseBrowserOS(): { browser: string; os: string } {
  const ua = navigator.userAgent;
  let browser = "Other";
  if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";

  let os = "Other";
  if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";

  return { browser, os };
}

async function getGeoData(): Promise<GeoData> {
  const cached = sessionStorage.getItem(GEO_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached) as GeoData;
  }

  try {
    const res = await fetch("https://ipwho.is/");
    if (!res.ok) throw new Error("Geo lookup failed");
    const json = await res.json();
    if (!json.success) throw new Error("Geo lookup unsuccessful");
    const geo: GeoData = {
      ip: json.ip || "",
      city: json.city || "",
      country: json.country || "",
      region: json.region || "",
    };
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return { ip: "", city: "", country: "", region: "" };
  }
}

/** Send tracking data as GET query params via image beacon — no CORS issues */
function sendBeacon(params: Record<string, string | number>) {
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  const url = `${ANALYTICS_SCRIPT_URL}?action=log&${query}`;
  const img = new Image();
  img.src = url;
}

export function usePageTracker() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    // Avoid duplicate fires for the same path
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    // Don't track the dashboard itself
    if (location.pathname === "/dashboard") return;

    const { browser, os } = parseBrowserOS();

    (async () => {
      const geo = await getGeoData();

      sendBeacon({
        path: location.pathname,
        referrer: document.referrer || "(direct)",
        screenWidth: window.innerWidth,
        timestamp: new Date().toISOString(),
        ip: geo.ip,
        city: geo.city,
        country: geo.country,
        region: geo.region,
        browser,
        os,
      });
    })();
  }, [location.pathname]);
}
