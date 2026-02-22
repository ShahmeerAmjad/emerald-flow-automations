/**
 * Google Apps Script — Analytics Backend for sassolutions.ai
 *
 * Deploy:
 *   1. Create a Google Sheet called "Site Analytics"
 *   2. Go to Extensions → Apps Script
 *   3. Paste this entire file into Code.gs
 *   4. Deploy → New deployment → Web app → Anyone can access
 *   5. Copy the deployment URL into usePageTracker.ts and Dashboard.tsx
 *
 * Sheets created automatically:
 *   - PageViews: raw pageview events
 *   - Engagement: page exit events (duration, scroll depth)
 *   - Scroll: scroll milestone events (25/50/75/100%)
 *   - Cache: 5-min aggregation cache for fast doGet responses
 */

/* ═══════════════════════════════════════════
   doPost — Receives events from the tracker
   ═══════════════════════════════════════════ */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var eventType = data.eventType || "pageview"; // backward compat

    if (eventType === "pageview") {
      writePageView(data);
    } else if (eventType === "engagement") {
      writeEngagement(data);
    } else if (eventType === "scroll") {
      writeScroll(data);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
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

/* ═══════════════════════════════════════════
   doGet — Returns aggregated analytics data
   ═══════════════════════════════════════════ */

function doGet() {
  // Check cache first (5-min TTL)
  var cached = getCachedResult();
  if (cached) {
    return ContentService.createTextOutput(cached)
      .setMimeType(ContentService.MimeType.JSON);
  }

  var result = buildAnalyticsResponse();
  var json = JSON.stringify(result);

  setCachedResult(json);

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/* ═══ CACHE ═══ */

function getCachedResult() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Cache");
  if (!sheet) return null;

  var data = sheet.getRange("A1:B1").getValues();
  if (!data[0][0]) return null;

  var cachedAt = new Date(data[0][0]).getTime();
  var now = new Date().getTime();
  if (now - cachedAt > 5 * 60 * 1000) return null; // expired

  return data[0][1];
}

function setCachedResult(json) {
  var sheet = getOrCreateSheet("Cache", ["CachedAt", "Data"]);
  // Clear and write
  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }
  sheet.appendRow([new Date().toISOString(), json]);
}

/* ═══ AGGREGATION ═══ */

function buildAnalyticsResponse() {
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

  // ── Summary ──
  var uniqueVisitors = countUnique(pageViews, "VisitorID");
  var uniquePaths = countUnique(pageViews, "Path");
  var todayViews = pageViews.filter(function(r) { return (r.Timestamp || "").substring(0, 10) === todayStr; }).length;
  var weekViews = pageViews.filter(function(r) { return new Date(r.Timestamp) >= weekAgo; }).length;

  // ── Daily views (last 30 days) ──
  var dailyMap = {};
  var thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  pageViews.forEach(function(r) {
    var d = (r.Timestamp || "").substring(0, 10);
    if (new Date(r.Timestamp) >= thirtyAgo) {
      dailyMap[d] = (dailyMap[d] || 0) + 1;
    }
  });
  var daily = Object.keys(dailyMap).sort().map(function(d) {
    return { date: d, views: dailyMap[d] };
  });

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
    return { city: parts[0], country: parts[1], region: parts[2], views: cityMap[k] };
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

  // ── Engagement metrics ──
  var sessionMap = {};
  pageViews.forEach(function(r) {
    var sid = r.SessionID || "";
    if (!sid) return;
    if (!sessionMap[sid]) {
      sessionMap[sid] = { pages: 0, visitorId: r.VisitorID || "" };
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

  // Engagement rate: >10s + >50% scroll
  var engagedSessions = 0;
  var totalDurationAll = 0;
  sessionIds.forEach(function(sid) {
    var eng = sessionEngagement[sid];
    if (eng) {
      totalDurationAll += eng.totalDuration;
      if (eng.totalDuration > 10000 && eng.maxScroll > 50) {
        engagedSessions++;
      }
    }
  });
  var engagementRate = totalSessions > 0 ? Math.round((engagedSessions / totalSessions) * 100) : 0;
  var avgSessionDuration = totalSessions > 0 ? Math.round(totalDurationAll / totalSessions / 1000) : 0; // seconds

  // New vs returning visitors
  var allVisitorIds = {};
  var newVisitors = 0, returningVisitors = 0;
  pageViews.forEach(function(r) {
    var vid = r.VisitorID || "";
    if (!vid) return;
    if (!allVisitorIds[vid]) {
      allVisitorIds[vid] = { sessions: {} };
    }
    var sid = r.SessionID || "";
    if (sid) allVisitorIds[vid].sessions[sid] = true;
  });
  Object.keys(allVisitorIds).forEach(function(vid) {
    var sessionCount = Object.keys(allVisitorIds[vid].sessions).length;
    if (sessionCount > 1) returningVisitors++;
    else newVisitors++;
  });

  // ── Ramadan Funnel ──
  var ramadanPattern = /^\/ramadan(?:\?|$)/;
  var dayPattern = /day=(\d+)/;
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
    dayMap[day].visitors[r.VisitorID || r.SessionID || "anon"] = true;
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
    contentEngagement: contentEngagement
  };
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

function formatDate(d) {
  var y = d.getFullYear();
  var m = ("0" + (d.getMonth() + 1)).slice(-2);
  var day = ("0" + d.getDate()).slice(-2);
  return y + "-" + m + "-" + day;
}
