// src/hooks/usePageTracker.ts — Tracks page views + engagement to Google Sheets via Apps Script
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ANALYTICS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxggJOURfWUJZlQScsLW_DDs-t6mR_2H3mBJdqvCVPsgHQWF50DwJVG5SN4Y9YhQ3eH-A/exec";

const GEO_CACHE_KEY = "visitor_geo";
const SESSION_ID_KEY = "analytics_session_id";
const VISITOR_ID_KEY = "analytics_visitor_id";
const PAGE_INDEX_KEY = "analytics_page_index";
const ENTRY_PAGE_KEY = "analytics_entry_page";

/* ═══ HELPERS ═══ */

function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = uuid();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function getAndIncrementPageIndex(): number {
  const raw = sessionStorage.getItem(PAGE_INDEX_KEY);
  const idx = raw ? parseInt(raw, 10) + 1 : 1;
  sessionStorage.setItem(PAGE_INDEX_KEY, String(idx));
  return idx;
}

function getEntryPage(currentPath: string): string {
  let entry = sessionStorage.getItem(ENTRY_PAGE_KEY);
  if (!entry) {
    entry = currentPath;
    sessionStorage.setItem(ENTRY_PAGE_KEY, entry);
  }
  return entry;
}

function isBot(): boolean {
  const ua = navigator.userAgent;
  if (!ua) return true;
  return /bot|crawler|spider|crawling|headless|lighthouse|pagespeed|prerender|phantom|puppeteer|selenium/i.test(ua);
}

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
    const res = await fetch("https://ipinfo.io/json");
    if (!res.ok) throw new Error("Geo lookup failed");
    const json = await res.json();
    const geo: GeoData = {
      ip: json.ip || "Unknown",
      city: json.city || "Unknown",
      country: json.country || "Unknown",
      region: json.region || "Unknown",
    };
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return { ip: "Unknown", city: "Unknown", country: "Unknown", region: "Unknown" };
  }
}

function sendEvent(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  // Prefer sendBeacon for reliability on page exit, fall back to fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_SCRIPT_URL, body);
  } else {
    fetch(ANALYTICS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body,
    }).catch(() => {});
  }
}

/* ═══ SCROLL DEPTH TRACKER ═══ */

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

function createScrollTracker(path: string) {
  const firedMilestones = new Set<number>();
  let maxDepth = 0;
  let rafPending = false;

  function getScrollPercent(): number {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 100;
    return Math.min(100, Math.round((window.scrollY / docHeight) * 100));
  }

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const depth = getScrollPercent();
      if (depth > maxDepth) maxDepth = depth;

      for (const milestone of SCROLL_MILESTONES) {
        if (depth >= milestone && !firedMilestones.has(milestone)) {
          firedMilestones.add(milestone);
          sendEvent({
            eventType: "scroll",
            path,
            depth: milestone,
            timestamp: new Date().toISOString(),
            sessionId: getSessionId(),
            visitorId: getVisitorId(),
          });
        }
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  return {
    getMaxDepth: () => maxDepth,
    destroy: () => window.removeEventListener("scroll", onScroll),
  };
}

/* ═══ MAIN HOOK ═══ */

export function usePageTracker() {
  const location = useLocation();
  const lastPath = useRef("");
  const scrollTrackerRef = useRef<ReturnType<typeof createScrollTracker> | null>(null);
  const pageEntryTime = useRef(0);
  const currentPathRef = useRef("");

  useEffect(() => {
    // Avoid duplicate fires for the same path
    if (location.pathname === lastPath.current) return;

    // Don't track the dashboard itself
    if (location.pathname === "/dashboard") return;

    // Bot filtering
    if (isBot()) return;

    // --- Cleanup previous page ---
    if (lastPath.current && lastPath.current !== "/dashboard") {
      const duration = Math.round(performance.now() - pageEntryTime.current);
      const maxScrollDepth = scrollTrackerRef.current?.getMaxDepth() ?? 0;
      sendEvent({
        eventType: "engagement",
        path: lastPath.current,
        duration,
        maxScrollDepth,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        visitorId: getVisitorId(),
      });
      scrollTrackerRef.current?.destroy();
    }

    lastPath.current = location.pathname;
    currentPathRef.current = location.pathname;
    pageEntryTime.current = performance.now();

    // Start scroll tracking for new page
    scrollTrackerRef.current = createScrollTracker(location.pathname);

    // --- Send pageview ---
    const { browser, os } = parseBrowserOS();
    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    const pageIndex = getAndIncrementPageIndex();
    const entryPage = getEntryPage(location.pathname);

    (async () => {
      const geo = await getGeoData();

      sendEvent({
        eventType: "pageview",
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
        sessionId,
        visitorId,
        pageIndex,
        entryPage,
      });
    })();
  }, [location.pathname]);

  // --- beforeunload: send final engagement event ---
  useEffect(() => {
    function onBeforeUnload() {
      if (!currentPathRef.current || currentPathRef.current === "/dashboard") return;
      const duration = Math.round(performance.now() - pageEntryTime.current);
      const maxScrollDepth = scrollTrackerRef.current?.getMaxDepth() ?? 0;
      sendEvent({
        eventType: "engagement",
        path: currentPathRef.current,
        duration,
        maxScrollDepth,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        visitorId: getVisitorId(),
      });
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // Cleanup scroll tracker on unmount
  useEffect(() => {
    return () => {
      scrollTrackerRef.current?.destroy();
    };
  }, []);
}
