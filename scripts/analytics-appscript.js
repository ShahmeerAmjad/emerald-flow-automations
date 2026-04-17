/**
 * Google Apps Script — Analytics Backend for sassolutions.ai
 *
 * Deploy:
 *   1. Create a Google Sheet called "Site Analytics"
 *   2. Go to Extensions → Apps Script
 *   3. Paste this entire file into Code.gs
 *   4. Deploy → Manage deployments → Edit → New version → Deploy
 *   5. URL stays the same
 *
 * Sheets created/managed automatically:
 *   - Page Views: raw pageview events (auto-migrates headers for old data)
 *   - Engagement: page exit events (duration, scroll depth)
 *   - Scroll: scroll milestone events (25/50/75/100%)
 *   - Cache: 5-min aggregation cache for fast doGet responses
 */

/* ═══════════════════════════════════════════
   doPost — Receives events from the tracker
   ═══════════════════════════════════════════ */

function doPost(e) {
  var rawBody = "";
  var parsed = null;
  try {
    rawBody = (e && e.postData && e.postData.contents) || "";
    parsed = JSON.parse(rawBody);
    var eventType = parsed.eventType || "pageview"; // backward compat

    if (eventType === "pageview") {
      writePageView(parsed);
    } else if (eventType === "engagement") {
      writeEngagement(parsed);
    } else if (eventType === "scroll") {
      writeScroll(parsed);
    } else if (eventType === "lead") {
      writeLead(parsed);
      logLeadAttempt(rawBody, parsed, "ok", "");
    }

    // Invalidate cache on new data
    clearCache();

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    var msg = (err && err.message) || String(err);
    // ALWAYS capture the raw body so we can reconstruct lost leads forensically.
    try { logLeadAttempt(rawBody, parsed, "error", msg); } catch (_) {}
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: msg }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ═══ SHEET HELPERS ═══ */

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  } else if (headers) {
    // Auto-migrate: add any missing headers to existing sheet
    var existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var missing = [];
    for (var i = 0; i < headers.length; i++) {
      if (existingHeaders.indexOf(headers[i]) === -1) {
        missing.push(headers[i]);
      }
    }
    if (missing.length > 0) {
      var startCol = sheet.getLastColumn() + 1;
      for (var j = 0; j < missing.length; j++) {
        sheet.getRange(1, startCol + j).setValue(missing[j]);
      }
    }
  }
  return sheet;
}

function writePageView(data) {
  var sheet = getOrCreateSheet("PageViews", [
    "Timestamp", "Path", "Referrer", "ScreenWidth", "IP",
    "City", "Country", "Region", "Browser", "OS",
    "SessionID", "VisitorID", "PageIndex", "EntryPage"
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.path || "",
    data.referrer || "(direct)",
    data.screenWidth || 0,
    data.ip || "Unknown",
    data.city || "Unknown",
    data.country || "Unknown",
    data.region || "Unknown",
    data.browser || "Other",
    data.os || "Other",
    data.sessionId || "",
    data.visitorId || "",
    data.pageIndex || 1,
    data.entryPage || data.path || ""
  ]);
}

function writeEngagement(data) {
  var sheet = getOrCreateSheet("Engagement", [
    "Timestamp", "Path", "Duration", "MaxScrollDepth",
    "SessionID", "VisitorID"
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.path || "",
    data.duration || 0,
    data.maxScrollDepth || 0,
    data.sessionId || "",
    data.visitorId || ""
  ]);
}

function writeScroll(data) {
  var sheet = getOrCreateSheet("Scroll", [
    "Timestamp", "Path", "Depth", "SessionID", "VisitorID"
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.path || "",
    data.depth || 0,
    data.sessionId || "",
    data.visitorId || ""
  ]);
}

function writeLead(data) {
  var sheet = getOrCreateSheet("Interested Leads", [
    "Timestamp", "FullName", "Email", "WhatsApp", "Goal", "CurrentRole", "AIExperience", "WhyJoin"
  ]);
  // Write by header name — robust to the live sheet having extra columns or a
  // different order than the canonical schema above (preserves existing rows).
  appendRowByHeaders(sheet, {
    "Timestamp": data.timestamp || new Date().toISOString(),
    "FullName": data.fullName || "",
    "Email": data.email || "",
    "WhatsApp": data.whatsapp || "",
    "Goal": data.goal || "",
    "CurrentRole": data.currentRole || "",
    "AIExperience": data.aiExperience || "",
    "WhyJoin": data.whyJoin || ""
  });
}

/**
 * Every lead attempt (success or failure) is appended here.
 * On error, `parsed` may be null; RawBody preserves the exact payload the
 * browser sent so we can reconstruct lost leads or diagnose parse failures.
 */
function logLeadAttempt(rawBody, parsed, status, errorMessage) {
  var sheet = getOrCreateSheet("LeadsLog", [
    "Timestamp", "EventType", "Status", "Error", "FullName", "WhatsApp", "Email", "Goal", "RawBody"
  ]);
  appendRowByHeaders(sheet, {
    "Timestamp": new Date().toISOString(),
    "EventType": (parsed && parsed.eventType) || "",
    "Status": status,
    "Error": errorMessage || "",
    "FullName": (parsed && parsed.fullName) || "",
    "WhatsApp": (parsed && parsed.whatsapp) || "",
    "Email": (parsed && parsed.email) || "",
    "Goal": (parsed && parsed.goal) || "",
    "RawBody": (rawBody || "").substring(0, 5000)
  });
}

function appendRowByHeaders(sheet, dataMap) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return;
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = new Array(lastCol);
  for (var i = 0; i < headers.length; i++) {
    var v = dataMap[headers[i]];
    row[i] = (v === undefined || v === null) ? "" : v;
  }
  sheet.appendRow(row);
}

/* ═══════════════════════════════════════════
   doGet — Returns aggregated analytics data
   ═══════════════════════════════════════════ */

function doGet(e) {
  // Optional date range params: ?from=YYYY-MM-DD&to=YYYY-MM-DD
  // Both bounds required; otherwise the response covers all-time.
  var dateRe = /^\d{4}-\d{2}-\d{2}$/;
  var from = (e && e.parameter && e.parameter.from) || "";
  var to = (e && e.parameter && e.parameter.to) || "";
  if (!dateRe.test(from)) from = "";
  if (!dateRe.test(to)) to = "";
  if (!from || !to) { from = ""; to = ""; }
  if (from && to && from > to) { var tmp = from; from = to; to = tmp; }

  var cacheKey = from && to ? "range_" + from + "_" + to : "all";
  var cached = getCachedResult(cacheKey);
  if (cached) {
    return ContentService.createTextOutput(cached)
      .setMimeType(ContentService.MimeType.JSON);
  }

  var result = buildAnalyticsResponse(from, to);
  var json = JSON.stringify(result);

  setCachedResult(cacheKey, json);

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/* ═══ CACHE ═══ */

function ensureCacheSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Cache");
  if (!sheet) {
    sheet = ss.insertSheet("Cache");
    sheet.appendRow(["CachedAt", "Key", "Data"]);
    sheet.setFrozenRows(1);
    return sheet;
  }
  // Migrate old 2-column [CachedAt, Data] schema → 3-column [CachedAt, Key, Data]
  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  if (headers[0] !== "CachedAt" || headers[1] !== "Key" || headers[2] !== "Data") {
    sheet.clear();
    sheet.appendRow(["CachedAt", "Key", "Data"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getCachedResult(key) {
  var sheet = ensureCacheSheet();
  if (sheet.getLastRow() < 2) return null;

  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  var now = new Date().getTime();
  var ttl = 5 * 60 * 1000;

  for (var i = 0; i < rows.length; i++) {
    if (rows[i][1] !== key) continue;
    var cachedAt = new Date(rows[i][0]).getTime();
    if (isNaN(cachedAt) || now - cachedAt > ttl) return null;
    return rows[i][2];
  }
  return null;
}

function setCachedResult(key, json) {
  var sheet = ensureCacheSheet();
  // Sweep existing entry for this key + any expired rows
  if (sheet.getLastRow() > 1) {
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    var now = new Date().getTime();
    var ttl = 5 * 60 * 1000;
    for (var i = rows.length - 1; i >= 0; i--) {
      var cachedAt = new Date(rows[i][0]).getTime();
      var expired = isNaN(cachedAt) || now - cachedAt > ttl;
      if (rows[i][1] === key || expired) {
        sheet.deleteRow(i + 2);
      }
    }
  }
  sheet.appendRow([new Date().toISOString(), key, json]);
}

function clearCache() {
  var sheet = ensureCacheSheet();
  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }
}

/* ═══ AGGREGATION ═══ */

function buildAnalyticsResponse(from, to) {
  var rangeApplied = !!(from && to);

  var pageViews = getSheetData("PageViews");
  var engagements = getSheetData("Engagement");

  // Filter out bots, /test paths, blank paths, dashboard
  pageViews = pageViews.filter(function(row) {
    var path = row.Path || "";
    return path && path !== "/dashboard" && path !== "/test" && !path.startsWith("/test");
  });

  engagements = engagements.filter(function(row) {
    var path = row.Path || "";
    return path && path !== "/dashboard" && path !== "/test" && !path.startsWith("/test");
  });

  var now = new Date();
  var todayStr = formatDate(now);
  var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Today / week views always reflect current activity (computed against the FULL
  // unfiltered set so the cards stay useful even when a custom range is active).
  var todayViews = pageViews.filter(function(r) { return toDateStr(r.Timestamp) === todayStr; }).length;
  var weekViews = pageViews.filter(function(r) { return new Date(r.Timestamp) >= weekAgo; }).length;

  // Apply date-range filter to all subsequent aggregations (inclusive both ends).
  if (rangeApplied) {
    var fromMs = new Date(from + "T00:00:00").getTime();
    var toMs = new Date(to + "T23:59:59.999").getTime();
    pageViews = pageViews.filter(function(r) {
      var t = new Date(r.Timestamp).getTime();
      return !isNaN(t) && t >= fromMs && t <= toMs;
    });
    engagements = engagements.filter(function(r) {
      var t = new Date(r.Timestamp).getTime();
      return !isNaN(t) && t >= fromMs && t <= toMs;
    });
  }

  // ── Summary ──
  // For unique visitors, use VisitorID if available, else fall back to IP
  var uniqueVisitors = countUniqueWithFallback(pageViews, "VisitorID", "IP");
  var uniquePaths = countUnique(pageViews, "Path");

  // ── Daily views ──
  // Range mode: cover every day in [from, to] (zero-filled). Default: last 30 days.
  var dailyMap = {};
  if (rangeApplied) {
    pageViews.forEach(function(r) {
      var d = toDateStr(r.Timestamp);
      if (d) dailyMap[d] = (dailyMap[d] || 0) + 1;
    });
  } else {
    var thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    pageViews.forEach(function(r) {
      var d = toDateStr(r.Timestamp);
      if (d && new Date(r.Timestamp) >= thirtyAgo) {
        dailyMap[d] = (dailyMap[d] || 0) + 1;
      }
    });
  }
  var daily = Object.keys(dailyMap).sort().map(function(d) {
    return { date: d, views: dailyMap[d] };
  });

  // Zero-fill missing days so the chart is continuous across the selected range
  if (rangeApplied) {
    var filled = [];
    var cursor = new Date(from + "T00:00:00");
    var end = new Date(to + "T00:00:00");
    while (cursor.getTime() <= end.getTime()) {
      var key = formatDate(cursor);
      filled.push({ date: key, views: dailyMap[key] || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    daily = filled;
  }

  // ── Pages ──
  var pageMap = {};
  pageViews.forEach(function(r) {
    var p = r.Path || "";
    if (p) pageMap[p] = (pageMap[p] || 0) + 1;
  });
  var pages = Object.keys(pageMap).map(function(p) {
    return { path: p, views: pageMap[p] };
  }).sort(function(a, b) { return b.views - a.views; });

  // ── Devices ──
  var mobile = 0, desktop = 0;
  pageViews.forEach(function(r) {
    var w = parseInt(r.ScreenWidth) || 0;
    if (w > 0 && w < 768) mobile++;
    else desktop++;
  });

  // ── Top Cities (filter Unknown/blank) ──
  var cityMap = {};
  pageViews.forEach(function(r) {
    var city = r.City || "";
    var country = r.Country || "";
    var region = r.Region || "";
    if (!city || city === "Unknown") return;
    var key = city + "|" + country + "|" + region;
    cityMap[key] = (cityMap[key] || 0) + 1;
  });
  var topCities = Object.keys(cityMap).map(function(k) {
    var parts = k.split("|");
    return { city: parts[0], country: parts[1], region: parts[2] || "", views: cityMap[k] };
  }).sort(function(a, b) { return b.views - a.views; }).slice(0, 15);

  // ── Browsers ──
  var browserMap = {};
  pageViews.forEach(function(r) {
    var b = r.Browser || "Other";
    browserMap[b] = (browserMap[b] || 0) + 1;
  });
  var browsers = Object.keys(browserMap).map(function(b) {
    return { name: b, views: browserMap[b] };
  }).sort(function(a, b) { return b.views - a.views; });

  // ── Session & Engagement metrics ──
  // For old rows without SessionID, synthesize one from IP + date
  var sessionMap = {};
  pageViews.forEach(function(r) {
    var sid = r.SessionID || "";
    if (!sid) {
      // Synthesize session from IP + date for historical data
      var ip = r.IP || "unknown";
      var d = toDateStr(r.Timestamp) || "nodate";
      sid = "legacy_" + ip + "_" + d;
    }
    if (!sessionMap[sid]) {
      sessionMap[sid] = { pages: 0, visitorId: r.VisitorID || r.IP || "unknown" };
    }
    sessionMap[sid].pages++;
  });

  var sessionEngagement = {};
  engagements.forEach(function(r) {
    var sid = r.SessionID || "";
    if (!sid) return;
    if (!sessionEngagement[sid]) {
      sessionEngagement[sid] = { totalDuration: 0, maxScroll: 0 };
    }
    sessionEngagement[sid].totalDuration += (parseInt(r.Duration) || 0);
    var scroll = parseInt(r.MaxScrollDepth) || 0;
    if (scroll > sessionEngagement[sid].maxScroll) {
      sessionEngagement[sid].maxScroll = scroll;
    }
  });

  var sessionIds = Object.keys(sessionMap);
  var totalSessions = sessionIds.length;
  var singlePageSessions = sessionIds.filter(function(sid) { return sessionMap[sid].pages === 1; }).length;
  var bounceRate = totalSessions > 0 ? Math.round((singlePageSessions / totalSessions) * 100) : 0;
  var avgPagesPerSession = totalSessions > 0 ? Math.round((pageViews.length / totalSessions) * 10) / 10 : 0;

  // Engagement rate: >10s + >50% scroll (only for sessions with engagement data)
  var engagedSessions = 0;
  var totalDurationAll = 0;
  var sessionsWithEngagement = 0;
  sessionIds.forEach(function(sid) {
    var eng = sessionEngagement[sid];
    if (eng) {
      sessionsWithEngagement++;
      totalDurationAll += eng.totalDuration;
      if (eng.totalDuration > 10000 && eng.maxScroll > 50) {
        engagedSessions++;
      }
    }
  });
  var engagementRate = sessionsWithEngagement > 0 ? Math.round((engagedSessions / sessionsWithEngagement) * 100) : 0;
  var avgSessionDuration = sessionsWithEngagement > 0 ? Math.round(totalDurationAll / sessionsWithEngagement / 1000) : 0; // seconds

  // New vs returning visitors — use VisitorID, fall back to IP
  var allVisitorIds = {};
  pageViews.forEach(function(r) {
    var vid = r.VisitorID || r.IP || "";
    if (!vid || vid === "Unknown") return;
    if (!allVisitorIds[vid]) {
      allVisitorIds[vid] = { sessions: {} };
    }
    var sid = r.SessionID || "";
    if (!sid) {
      var d = toDateStr(r.Timestamp) || "nodate";
      sid = "legacy_" + (r.IP || "unknown") + "_" + d;
    }
    allVisitorIds[vid].sessions[sid] = true;
  });
  var newVisitors = 0, returningVisitors = 0;
  Object.keys(allVisitorIds).forEach(function(vid) {
    var sessionCount = Object.keys(allVisitorIds[vid].sessions).length;
    if (sessionCount > 1) returningVisitors++;
    else newVisitors++;
  });

  // ── Ramadan Funnel ──
  var ramadanPattern = /^\/ramadan/;
  var dayPattern = /(?:day=|\/)(\d+)/;
  var ramadanViews = pageViews.filter(function(r) {
    return ramadanPattern.test(r.Path || "");
  });

  var dayMap = {};
  ramadanViews.forEach(function(r) {
    var path = r.Path || "";
    var match = path.match(dayPattern);
    var day = match ? parseInt(match[1]) : 1;
    if (!dayMap[day]) {
      dayMap[day] = { visitors: {}, totalDuration: 0, totalScroll: 0, engagementCount: 0, readComplete: 0 };
    }
    var visitorKey = r.VisitorID || r.IP || r.SessionID || "anon";
    dayMap[day].visitors[visitorKey] = true;
  });

  // Enrich funnel with engagement data
  engagements.forEach(function(r) {
    var path = r.Path || "";
    if (!ramadanPattern.test(path)) return;
    var match = path.match(dayPattern);
    var day = match ? parseInt(match[1]) : 1;
    if (!dayMap[day]) return;
    var dur = parseInt(r.Duration) || 0;
    var scroll = parseInt(r.MaxScrollDepth) || 0;
    dayMap[day].totalDuration += dur;
    dayMap[day].totalScroll += scroll;
    dayMap[day].engagementCount++;
    if (scroll >= 75 && dur >= 30000) {
      dayMap[day].readComplete++;
    }
  });

  var ramadanFunnel = Object.keys(dayMap).map(function(d) {
    var entry = dayMap[d];
    var uniqueVis = Object.keys(entry.visitors).length;
    var avgDur = entry.engagementCount > 0 ? Math.round(entry.totalDuration / entry.engagementCount / 1000) : 0;
    var avgScroll = entry.engagementCount > 0 ? Math.round(entry.totalScroll / entry.engagementCount) : 0;
    var readRate = entry.engagementCount > 0 ? Math.round((entry.readComplete / entry.engagementCount) * 100) : 0;
    return {
      day: parseInt(d),
      uniqueVisitors: uniqueVis,
      avgDuration: avgDur,
      avgScrollDepth: avgScroll,
      readCompletionRate: readRate
    };
  }).sort(function(a, b) { return a.day - b.day; });

  // ── Content Engagement Table ──
  var contentMap = {};
  engagements.forEach(function(r) {
    var path = r.Path || "";
    if (!path) return;
    if (!contentMap[path]) {
      contentMap[path] = { totalDuration: 0, totalScroll: 0, count: 0, readComplete: 0 };
    }
    var dur = parseInt(r.Duration) || 0;
    var scroll = parseInt(r.MaxScrollDepth) || 0;
    contentMap[path].totalDuration += dur;
    contentMap[path].totalScroll += scroll;
    contentMap[path].count++;
    if (scroll >= 75 && dur >= 30000) {
      contentMap[path].readComplete++;
    }
  });

  var contentEngagement = Object.keys(contentMap).map(function(path) {
    var c = contentMap[path];
    var totalViews = pageMap[path] || 0;
    return {
      path: path,
      totalViews: totalViews,
      avgDuration: c.count > 0 ? Math.round(c.totalDuration / c.count / 1000) : 0,
      avgScrollDepth: c.count > 0 ? Math.round(c.totalScroll / c.count) : 0,
      readCompletionRate: c.count > 0 ? Math.round((c.readComplete / c.count) * 100) : 0
    };
  }).sort(function(a, b) { return b.totalViews - a.totalViews; });

  return {
    summary: {
      totalViews: pageViews.length,
      todayViews: todayViews,
      weekViews: weekViews,
      uniquePaths: uniquePaths,
      uniqueVisitors: uniqueVisitors
    },
    daily: daily,
    pages: pages,
    devices: { mobile: mobile, desktop: desktop },
    topCities: topCities,
    browsers: browsers,
    engagement: {
      avgPagesPerSession: avgPagesPerSession,
      engagementRate: engagementRate,
      bounceRate: bounceRate,
      avgSessionDuration: avgSessionDuration,
      newVisitors: newVisitors,
      returningVisitors: returningVisitors
    },
    ramadanFunnel: ramadanFunnel,
    contentEngagement: contentEngagement,
    rangeMeta: { from: from || "", to: to || "", applied: rangeApplied }
  };
}

/* ═══════════════════════════════════════════
   auditLeads — run manually from Apps Script editor.
   Output goes to (a) the Executions panel via console.log, and
   (b) a persistent "AuditReport" sheet so the result is always readable.

   Cross-references /offer PageViews, Interested Leads rows, and the
   LeadsLog audit trail from `fromDateStr` forward.
   ═══════════════════════════════════════════ */

function auditLeads() {
  var fromDateStr = "2026-03-30"; // edit as needed
  var fromMs = new Date(fromDateStr + "T00:00:00").getTime();

  function inRange(ts) {
    var t = new Date(ts).getTime();
    return !isNaN(t) && t >= fromMs;
  }

  var offerViews = getSheetData("PageViews").filter(function(r) {
    return inRange(r.Timestamp) && String(r.Path || "").indexOf("/offer") === 0;
  });
  var landingViews = getSheetData("PageViews").filter(function(r) {
    return inRange(r.Timestamp) && String(r.Path || "").indexOf("/landing") === 0;
  });
  var leads = getSheetData("Interested Leads").filter(function(r) { return inRange(r.Timestamp); });
  var leadsLog = getSheetData("LeadsLog").filter(function(r) { return inRange(r.Timestamp); });

  var byDay = {};
  function bucket(d) {
    if (!byDay[d]) byDay[d] = { offerViews: 0, landingViews: 0, leads: 0, logOk: 0, logErr: 0 };
    return byDay[d];
  }
  offerViews.forEach(function(r) { bucket(toDateStr(r.Timestamp)).offerViews++; });
  landingViews.forEach(function(r) { bucket(toDateStr(r.Timestamp)).landingViews++; });
  leads.forEach(function(r) { bucket(toDateStr(r.Timestamp)).leads++; });
  leadsLog.forEach(function(r) {
    var b = bucket(toDateStr(r.Timestamp));
    if (r.Status === "ok") b.logOk++;
    else if (r.Status === "error") b.logErr++;
  });

  var days = Object.keys(byDay).sort();
  var okCount = leadsLog.filter(function(r) { return r.Status === "ok"; }).length;
  var errCount = leadsLog.filter(function(r) { return r.Status === "error"; }).length;

  // Print to execution log (console.log is visible in Executions panel)
  console.log("auditLeads from " + fromDateStr);
  console.log("Day\tOfferViews\tLandingViews\tLeads\tLogOK\tLogErr");
  days.forEach(function(d) {
    var b = byDay[d];
    console.log(d + "\t" + b.offerViews + "\t" + b.landingViews + "\t" + b.leads + "\t" + b.logOk + "\t" + b.logErr);
  });
  console.log("---");
  console.log("Totals: offerViews=" + offerViews.length + " landingViews=" + landingViews.length +
              " leads=" + leads.length + " logOk=" + okCount + " logErr=" + errCount);

  // Persist to sheet so output is always visible (open the "AuditReport" tab).
  var reportSheet = getOrCreateSheet("AuditReport",
    ["Day", "OfferViews", "LandingViews", "Leads", "LogOK", "LogErr"]);
  if (reportSheet.getLastRow() > 1) {
    reportSheet.deleteRows(2, reportSheet.getLastRow() - 1);
  }
  days.forEach(function(d) {
    var b = byDay[d];
    reportSheet.appendRow([d, b.offerViews, b.landingViews, b.leads, b.logOk, b.logErr]);
  });
  reportSheet.appendRow([]);
  reportSheet.appendRow(["TOTAL", offerViews.length, landingViews.length, leads.length, okCount, errCount]);
  reportSheet.appendRow([]);
  reportSheet.appendRow(["Generated", new Date().toISOString(), "from: " + fromDateStr]);
}

/* ═══ UTILITY ═══ */

function getSheetData(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    rows.push(row);
  }
  return rows;
}

function countUnique(rows, key) {
  var seen = {};
  rows.forEach(function(r) {
    var v = r[key] || "";
    if (v) seen[v] = true;
  });
  return Object.keys(seen).length;
}

function countUniqueWithFallback(rows, primaryKey, fallbackKey) {
  var seen = {};
  rows.forEach(function(r) {
    var v = r[primaryKey] || r[fallbackKey] || "";
    if (v && v !== "Unknown") seen[v] = true;
  });
  return Object.keys(seen).length;
}

function toDateStr(ts) {
  if (!ts) return "";
  var s = String(ts);
  // Handle both ISO strings and Date objects from Sheets
  if (s.length >= 10) return s.substring(0, 10);
  try {
    return formatDate(new Date(ts));
  } catch(e) {
    return "";
  }
}

function formatDate(d) {
  var y = d.getFullYear();
  var m = ("0" + (d.getMonth() + 1)).slice(-2);
  var day = ("0" + d.getDate()).slice(-2);
  return y + "-" + m + "-" + day;
}
