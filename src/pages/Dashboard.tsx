// src/pages/Dashboard.tsx — Analytics Dashboard

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Eye,
  FileText,
  Monitor,
  Smartphone,
  RefreshCw,
  TrendingUp,
  ExternalLink,
  Users,
  MapPin,
  Globe,
  Activity,
  Timer,
  MousePointerClick,
  UserPlus,
  UserCheck,
  ArrowDownRight,
} from "lucide-react";

/* ═══ CONSTANTS ═══ */

// Replace with your deployed Analytics Apps Script URL (handles both doGet and doPost)
const ANALYTICS_API_URL =
  "https://script.google.com/macros/s/AKfycbxggJOURfWUJZlQScsLW_DDs-t6mR_2H3mBJdqvCVPsgHQWF50DwJVG5SN4Y9YhQ3eH-A/exec";

const VERCEL_ANALYTICS_URL = "https://vercel.com/shahmeeramjad/emerald-flow-automations/analytics";
const GA4_DASHBOARD_URL = "https://analytics.google.com/analytics/web/#/p/G-PSXTZRBCQB";

/* ═══ TYPES ═══ */

interface AnalyticsData {
  summary: {
    totalViews: number;
    todayViews: number;
    weekViews: number;
    uniquePaths: number;
    uniqueVisitors: number;
  };
  daily: { date: string; views: number }[];
  pages: { path: string; views: number }[];
  devices: { mobile: number; desktop: number };
  topCities: { city: string; country: string; region: string; views: number }[];
  browsers: { name: string; views: number }[];
  engagement: {
    avgPagesPerSession: number;
    engagementRate: number;
    bounceRate: number;
    avgSessionDuration: number;
    newVisitors: number;
    returningVisitors: number;
  };
  ramadanFunnel: {
    day: number;
    uniqueVisitors: number;
    avgDuration: number;
    avgScrollDepth: number;
    readCompletionRate: number;
  }[];
  contentEngagement: {
    path: string;
    totalViews: number;
    avgDuration: number;
    avgScrollDepth: number;
    readCompletionRate: number;
  }[];
}

const EMPTY_DATA: AnalyticsData = {
  summary: { totalViews: 0, todayViews: 0, weekViews: 0, uniquePaths: 0, uniqueVisitors: 0 },
  daily: [],
  pages: [],
  devices: { mobile: 0, desktop: 0 },
  topCities: [],
  browsers: [],
  engagement: {
    avgPagesPerSession: 0,
    engagementRate: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    newVisitors: 0,
    returningVisitors: 0,
  },
  ramadanFunnel: [],
  contentEngagement: [],
};

/* ═══ MAIN COMPONENT ═══ */

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ANALYTICS_API_URL);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const json = await res.json();
      // Backwards-compatible: fill in new fields with defaults if Apps Script hasn't been updated yet
      const normalized: AnalyticsData = {
        summary: {
          totalViews: json.summary?.totalViews ?? 0,
          todayViews: json.summary?.todayViews ?? 0,
          weekViews: json.summary?.weekViews ?? 0,
          uniquePaths: json.summary?.uniquePaths ?? 0,
          uniqueVisitors: json.summary?.uniqueVisitors ?? 0,
        },
        daily: json.daily ?? [],
        pages: (json.pages ?? []).filter((p: { path: string }) =>
          p.path && p.path !== "/test" && !p.path.startsWith("/test")
        ),
        devices: json.devices ?? { mobile: 0, desktop: 0 },
        topCities: (json.topCities ?? []).filter(
          (c: { city: string }) => c.city && c.city !== "Unknown"
        ),
        browsers: json.browsers ?? [],
        engagement: {
          avgPagesPerSession: json.engagement?.avgPagesPerSession ?? 0,
          engagementRate: json.engagement?.engagementRate ?? 0,
          bounceRate: json.engagement?.bounceRate ?? 0,
          avgSessionDuration: json.engagement?.avgSessionDuration ?? 0,
          newVisitors: json.engagement?.newVisitors ?? 0,
          returningVisitors: json.engagement?.returningVisitors ?? 0,
        },
        ramadanFunnel: json.ramadanFunnel ?? [],
        contentEngagement: json.contentEngagement ?? [],
      };
      setData(normalized);
      setLastRefresh(new Date());
    } catch {
      if (ANALYTICS_API_URL.includes("ANALYTICS_SCRIPT_ID")) {
        setError("setup");
      } else {
        setError("fetch");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#050907] text-[#F0EDE6] font-['Sora',sans-serif] antialiased relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(45,184,155,0.1)_0%,transparent_70%)] animate-[orbFloat_22s_ease-in-out_infinite]" />
        <div className="absolute top-[1200px] -right-24 w-[500px] h-[500px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(45,184,155,0.06)_0%,transparent_70%)] animate-[orbFloat_26s_ease-in-out_infinite_-8s]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-8 md:px-12 py-10 sm:py-14 md:py-[60px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_both]">
          <div>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-[rgba(45,184,155,0.12)] bg-[rgba(45,184,155,0.07)] backdrop-blur-sm mb-4 animate-[borderGlow_4s_ease-in-out_infinite]">
              <span className="w-2 h-2 bg-[#47ECCC] rounded-full animate-[livePulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_#2DB89B]" />
              <span className="font-['JetBrains_Mono',monospace] text-[11px] sm:text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium">
                Analytics Dashboard
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-2px] leading-[1.1]">
              Site{" "}
              <span className="bg-gradient-to-br from-[#2DB89B] via-[#47ECCC] to-[#2DB89B] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_6s_linear_infinite]">
                Analytics
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[rgba(45,184,155,0.2)] bg-[rgba(45,184,155,0.07)] text-[#2DB89B] text-sm font-medium hover:bg-[rgba(45,184,155,0.12)] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {lastRefresh && (
          <div className="text-xs text-[rgba(240,237,230,0.28)] font-['JetBrains_Mono',monospace] mb-6 -mt-6">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        )}

        {error === "setup" ? (
          <SetupGuide />
        ) : error === "fetch" ? (
          <div className="p-8 border border-[rgba(240,96,80,0.15)] bg-[rgba(240,96,80,0.04)] text-center">
            <p className="text-[#E8705F] font-semibold mb-2">Failed to load analytics data</p>
            <p className="text-sm text-[rgba(240,237,230,0.4)]">Check your Apps Script URL and try again.</p>
          </div>
        ) : (
          <>
            {/* Row 1: Summary Cards — 5 cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.1s_both]">
              <StatCard
                icon={<Eye className="w-5 h-5" />}
                label="Total Views"
                value={data.summary.totalViews}
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Today"
                value={data.summary.todayViews}
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="This Week"
                value={data.summary.weekViews}
              />
              <StatCard
                icon={<FileText className="w-5 h-5" />}
                label="Unique Pages"
                value={data.summary.uniquePaths}
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Unique Visitors"
                value={data.summary.uniqueVisitors}
              />
            </div>

            {/* Row 2: Engagement Cards — 4 cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]">
              <StatCard
                icon={<Activity className="w-5 h-5" />}
                label="Engagement Rate"
                value={`${data.engagement.engagementRate}%`}
              />
              <StatCard
                icon={<ArrowDownRight className="w-5 h-5" />}
                label="Bounce Rate"
                value={`${data.engagement.bounceRate}%`}
              />
              <StatCard
                icon={<MousePointerClick className="w-5 h-5" />}
                label="Pages / Session"
                value={data.engagement.avgPagesPerSession}
              />
              <StatCard
                icon={<Timer className="w-5 h-5" />}
                label="Avg Duration"
                value={formatDuration(data.engagement.avgSessionDuration)}
              />
            </div>

            {/* Row 3: New / Returning Visitors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.18s_both]">
              <VisitorCard
                icon={<UserPlus className="w-6 h-6" />}
                label="New Visitors"
                count={data.engagement.newVisitors}
                total={data.engagement.newVisitors + data.engagement.returningVisitors}
                color="#47ECCC"
              />
              <VisitorCard
                icon={<UserCheck className="w-6 h-6" />}
                label="Returning Visitors"
                count={data.engagement.returningVisitors}
                total={data.engagement.newVisitors + data.engagement.returningVisitors}
                color="#2DB89B"
              />
            </div>

            {/* Daily Views — Full Width */}
            <div className="p-6 border border-[rgba(45,184,155,0.1)] bg-[#0C1210] mb-8 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.2s_both]">
              <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">
                Daily Views — Last 30 Days
              </div>
              {data.daily.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.daily}>
                    <CartesianGrid stroke="rgba(45,184,155,0.06)" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "rgba(240,237,230,0.3)", fontSize: 11 }}
                      tickFormatter={(v: string) => v.slice(5)}
                      axisLine={{ stroke: "rgba(45,184,155,0.1)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(240,237,230,0.3)", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(45,184,155,0.1)" }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<SimpleTooltip suffix="views" />} />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#47ECCC"
                      strokeWidth={2}
                      dot={{ fill: "#2DB89B", r: 3 }}
                      activeDot={{ fill: "#47ECCC", r: 5, stroke: "#050907", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>

            {/* Ramadan Day Retention Funnel — Full Width */}
            {data.ramadanFunnel.length > 0 && (
              <div className="p-6 border border-[rgba(45,184,155,0.1)] bg-[#0C1210] mb-8 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.25s_both]">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium">
                    Ramadan Day Retention
                  </div>
                  {data.ramadanFunnel.length >= 2 && (
                    <div className="text-xs font-['JetBrains_Mono',monospace] text-[rgba(240,237,230,0.4)]">
                      Day 1 → Day {data.ramadanFunnel[data.ramadanFunnel.length - 1].day} retention:{" "}
                      <span className="text-[#47ECCC] font-bold">
                        {data.ramadanFunnel[0].uniqueVisitors > 0
                          ? Math.round(
                              (data.ramadanFunnel[data.ramadanFunnel.length - 1].uniqueVisitors /
                                data.ramadanFunnel[0].uniqueVisitors) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.ramadanFunnel}>
                    <CartesianGrid stroke="rgba(45,184,155,0.06)" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "rgba(240,237,230,0.3)", fontSize: 11 }}
                      tickFormatter={(v: number) => `Day ${v}`}
                      axisLine={{ stroke: "rgba(45,184,155,0.1)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(240,237,230,0.3)", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(45,184,155,0.1)" }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<FunnelTooltip />} />
                    <Bar dataKey="uniqueVisitors" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {data.ramadanFunnel.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            i === 0
                              ? "#47ECCC"
                              : `rgba(45, 184, 155, ${Math.max(0.2, 1 - i * 0.06)})`
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Content Engagement Table — Full Width */}
            {data.contentEngagement.length > 0 && (
              <div className="p-6 border border-[rgba(45,184,155,0.1)] bg-[#0C1210] mb-8 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.28s_both]">
                <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">
                  Content Engagement
                </div>
                <div className="overflow-x-auto">
                  {/* Table header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2 text-[11px] font-['JetBrains_Mono',monospace] text-[rgba(240,237,230,0.3)] tracking-[2px] uppercase border-b border-[rgba(45,184,155,0.08)] min-w-[600px]">
                    <span>Page</span>
                    <span className="text-right">Views</span>
                    <span className="text-right">Avg Scroll</span>
                    <span className="text-right">Avg Time</span>
                    <span className="text-right">Read Rate</span>
                  </div>
                  {/* Table rows */}
                  {data.contentEngagement.slice(0, 15).map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-[rgba(45,184,155,0.04)] hover:bg-[rgba(45,184,155,0.03)] transition-colors min-w-[600px]"
                    >
                      <span className="text-sm font-medium truncate">{row.path}</span>
                      <span className="text-sm text-right tabular-nums">
                        {row.totalViews.toLocaleString()}
                      </span>
                      <span className="text-sm text-right">
                        <ScrollBar depth={row.avgScrollDepth} />
                      </span>
                      <span className="text-sm text-right tabular-nums text-[rgba(240,237,230,0.5)]">
                        {formatDuration(row.avgDuration)}
                      </span>
                      <span className="text-sm text-right">
                        <ReadRateBadge rate={row.readCompletionRate} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Views by Page | Top Cities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Per-Page Chart */}
              <div className="p-6 border border-[rgba(45,184,155,0.1)] bg-[#0C1210] animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
                <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">
                  Views by Page
                </div>
                {data.pages.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.pages} layout="vertical">
                      <CartesianGrid stroke="rgba(45,184,155,0.06)" strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: "rgba(240,237,230,0.3)", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(45,184,155,0.1)" }}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        dataKey="path"
                        type="category"
                        tick={{ fill: "rgba(240,237,230,0.5)", fontSize: 12 }}
                        axisLine={{ stroke: "rgba(45,184,155,0.1)" }}
                        tickLine={false}
                        width={100}
                      />
                      <Tooltip content={<SimpleTooltip suffix="views" />} />
                      <Bar dataKey="views" radius={[0, 4, 4, 0]} maxBarSize={28}>
                        {data.pages.map((_, i) => (
                          <Cell
                            key={i}
                            fill={i === 0 ? "#47ECCC" : "rgba(45,184,155,0.4)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </div>

              {/* Top Cities Table */}
              <div className="p-6 border border-[rgba(45,184,155,0.1)] bg-[#0C1210] animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
                <div className="flex items-center gap-2 font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">
                  <MapPin className="w-4 h-4" />
                  Top Cities
                </div>
                {data.topCities.length > 0 ? (
                  <div className="space-y-0">
                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-2 text-[11px] font-['JetBrains_Mono',monospace] text-[rgba(240,237,230,0.3)] tracking-[2px] uppercase border-b border-[rgba(45,184,155,0.08)]">
                      <span>City</span>
                      <span>Country</span>
                      <span className="text-right">Views</span>
                    </div>
                    {/* Table rows */}
                    {data.topCities.slice(0, 10).map((row, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-3 border-b border-[rgba(45,184,155,0.04)] hover:bg-[rgba(45,184,155,0.03)] transition-colors"
                      >
                        <span className="text-sm font-medium truncate">
                          {row.city}
                          {row.region ? `, ${row.region}` : ""}
                        </span>
                        <span className="text-sm text-[rgba(240,237,230,0.5)] truncate flex items-center gap-1.5">
                          <Globe className="w-3 h-3 shrink-0 text-[rgba(45,184,155,0.4)]" />
                          {row.country}
                        </span>
                        <span className="text-sm font-bold text-[#47ECCC] text-right tabular-nums">
                          {row.views.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyChart />
                )}
              </div>
            </div>

            {/* Browser Breakdown | Device Breakdown + Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.4s_both]">
              {/* Browser Breakdown */}
              <div className="p-6 border border-[rgba(45,184,155,0.1)] bg-[#0C1210]">
                <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">
                  Browser Breakdown
                </div>
                {data.browsers.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.browsers} layout="vertical">
                      <CartesianGrid stroke="rgba(45,184,155,0.06)" strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: "rgba(240,237,230,0.3)", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(45,184,155,0.1)" }}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: "rgba(240,237,230,0.5)", fontSize: 12 }}
                        axisLine={{ stroke: "rgba(45,184,155,0.1)" }}
                        tickLine={false}
                        width={80}
                      />
                      <Tooltip content={<SimpleTooltip suffix="views" />} />
                      <Bar dataKey="views" radius={[0, 4, 4, 0]} maxBarSize={28}>
                        {data.browsers.map((_, i) => (
                          <Cell
                            key={i}
                            fill={i === 0 ? "#47ECCC" : "rgba(45,184,155,0.4)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </div>

              {/* Device Breakdown + Quick Links */}
              <div className="space-y-6">
                <div className="p-6 border border-[rgba(45,184,155,0.1)] bg-[#0C1210]">
                  <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">
                    Device Breakdown
                  </div>
                  <div className="flex gap-4">
                    <DeviceCard
                      icon={<Smartphone className="w-6 h-6" />}
                      label="Mobile"
                      count={data.devices.mobile}
                      total={data.devices.mobile + data.devices.desktop}
                    />
                    <DeviceCard
                      icon={<Monitor className="w-6 h-6" />}
                      label="Desktop"
                      count={data.devices.desktop}
                      total={data.devices.mobile + data.devices.desktop}
                    />
                  </div>
                </div>

                {/* Quick Links */}
                <div className="p-6 border border-[rgba(45,184,155,0.1)] bg-[#0C1210]">
                  <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">
                    Full Dashboards
                  </div>
                  <div className="space-y-3">
                    <a
                      href={VERCEL_ANALYTICS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-[rgba(45,184,155,0.08)] bg-[rgba(45,184,155,0.03)] hover:border-[rgba(45,184,155,0.2)] hover:bg-[rgba(45,184,155,0.06)] transition-all group"
                    >
                      <div>
                        <div className="text-[15px] font-semibold mb-0.5">Vercel Analytics</div>
                        <div className="text-xs text-[rgba(240,237,230,0.3)]">Real-time visitors, Web Vitals, speed insights</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[rgba(240,237,230,0.2)] group-hover:text-[#47ECCC] transition-colors" />
                    </a>
                    <a
                      href={GA4_DASHBOARD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-[rgba(45,184,155,0.08)] bg-[rgba(45,184,155,0.03)] hover:border-[rgba(45,184,155,0.2)] hover:bg-[rgba(45,184,155,0.06)] transition-all group"
                    >
                      <div>
                        <div className="text-[15px] font-semibold mb-0.5">Google Analytics 4</div>
                        <div className="text-xs text-[rgba(240,237,230,0.3)]">Traffic sources, demographics, ad attribution</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[rgba(240,237,230,0.2)] group-hover:text-[#47ECCC] transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center pt-9 pb-6">
          <div className="text-[26px] font-bold tracking-[-0.5px] mb-2.5">
            <span className="text-[#2DB89B]">Sas</span>
            <span className="text-[#EDE8D0]">Solutions.ai</span>
          </div>
          <div className="font-['JetBrains_Mono',monospace] text-xs text-[rgba(240,237,230,0.28)] tracking-[3px] uppercase">
            The future belongs to{" "}
            <span className="text-[#2DB89B]">those who build</span> — not those who watch
          </div>
        </footer>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(40px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.5); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(45, 184, 155, 0.1); }
          50% { border-color: rgba(45, 184, 155, 0.3); }
        }
      `}</style>
    </div>
  );
}

/* ═══ HELPER FUNCTIONS ═══ */

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

/* ═══ SUBCOMPONENTS ═══ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="p-5 border border-[rgba(45,184,155,0.1)] bg-[#0C1210] hover:border-[rgba(45,184,155,0.2)] transition-all">
      <div className="flex items-center gap-2 text-[#2DB89B] mb-3">{icon}</div>
      <div className="text-2xl sm:text-3xl font-extrabold tracking-[-1px] mb-1">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="font-['JetBrains_Mono',monospace] text-[11px] text-[rgba(240,237,230,0.3)] tracking-[2px] uppercase">
        {label}
      </div>
    </div>
  );
}

function VisitorCard({
  icon,
  label,
  count,
  total,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="p-5 border border-[rgba(45,184,155,0.1)] bg-[#0C1210] hover:border-[rgba(45,184,155,0.2)] transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div style={{ color }}>{icon}</div>
        <div className="font-['JetBrains_Mono',monospace] text-[11px] text-[rgba(240,237,230,0.3)] tracking-[2px] uppercase">
          {label}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-[-1px]">
          {count.toLocaleString()}
        </div>
        <div className="text-sm font-medium mb-0.5" style={{ color }}>
          {pct}%
        </div>
      </div>
      <div className="mt-3 h-1.5 bg-[rgba(45,184,155,0.1)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function DeviceCard({
  icon,
  label,
  count,
  total,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex-1 p-4 border border-[rgba(45,184,155,0.08)] bg-[rgba(45,184,155,0.03)] text-center">
      <div className="flex justify-center text-[#47ECCC] mb-2">{icon}</div>
      <div className="text-xl font-extrabold mb-0.5">{count.toLocaleString()}</div>
      <div className="text-xs text-[rgba(240,237,230,0.3)]">{label}</div>
      <div className="mt-3 h-1.5 bg-[rgba(45,184,155,0.1)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#2DB89B] to-[#47ECCC] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-[#47ECCC] mt-1 font-medium">{pct}%</div>
    </div>
  );
}

function ScrollBar({ depth }: { depth: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[rgba(45,184,155,0.1)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${depth}%`,
            backgroundColor: depth >= 75 ? "#47ECCC" : depth >= 50 ? "#2DB89B" : "rgba(45,184,155,0.4)",
          }}
        />
      </div>
      <span className="tabular-nums text-[rgba(240,237,230,0.5)]">{depth}%</span>
    </div>
  );
}

function ReadRateBadge({ rate }: { rate: number }) {
  let bg: string, text: string;
  if (rate >= 60) {
    bg = "rgba(45, 184, 155, 0.15)";
    text = "#47ECCC";
  } else if (rate >= 30) {
    bg = "rgba(240, 180, 50, 0.15)";
    text = "#F0B432";
  } else {
    bg = "rgba(240, 96, 80, 0.1)";
    text = "#E8705F";
  }
  return (
    <span
      className="inline-flex px-2 py-0.5 text-xs font-bold rounded tabular-nums"
      style={{ backgroundColor: bg, color: text }}
    >
      {rate}%
    </span>
  );
}

function SimpleTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0C1210] border border-[rgba(45,184,155,0.2)] px-3 py-2 shadow-lg">
      <div className="text-xs text-[rgba(240,237,230,0.5)] mb-1">{label}</div>
      <div className="text-sm font-bold text-[#47ECCC]">
        {payload[0].value.toLocaleString()} {suffix}
      </div>
    </div>
  );
}

function FunnelTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: {
      day: number;
      uniqueVisitors: number;
      avgDuration: number;
      avgScrollDepth: number;
      readCompletionRate: number;
    };
  }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0C1210] border border-[rgba(45,184,155,0.2)] px-4 py-3 shadow-lg space-y-1">
      <div className="text-xs font-bold text-[#47ECCC] mb-2">Day {d.day}</div>
      <div className="text-xs text-[rgba(240,237,230,0.5)]">
        Visitors: <span className="text-[#F0EDE6] font-medium">{d.uniqueVisitors}</span>
      </div>
      <div className="text-xs text-[rgba(240,237,230,0.5)]">
        Avg scroll: <span className="text-[#F0EDE6] font-medium">{d.avgScrollDepth}%</span>
      </div>
      <div className="text-xs text-[rgba(240,237,230,0.5)]">
        Avg time: <span className="text-[#F0EDE6] font-medium">{formatDuration(d.avgDuration)}</span>
      </div>
      <div className="text-xs text-[rgba(240,237,230,0.5)]">
        Read rate: <span className="text-[#F0EDE6] font-medium">{d.readCompletionRate}%</span>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[260px] text-[rgba(240,237,230,0.2)]">
      <div className="text-center">
        <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <div className="text-sm">No data yet — views will appear here</div>
      </div>
    </div>
  );
}

function SetupGuide() {
  return (
    <div className="p-8 border border-[rgba(45,184,155,0.15)] bg-[rgba(45,184,155,0.04)] animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.1s_both]">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2DB89B] to-transparent" />
      <h2 className="text-xl font-extrabold mb-4">Setup Required</h2>
      <p className="text-[rgba(240,237,230,0.5)] mb-6 leading-[1.7]">
        Deploy the Analytics Apps Script and paste the URL into{" "}
        <code className="font-['JetBrains_Mono',monospace] text-[#47ECCC] text-sm bg-[rgba(45,184,155,0.1)] px-2 py-0.5">
          Dashboard.tsx
        </code>{" "}
        and{" "}
        <code className="font-['JetBrains_Mono',monospace] text-[#47ECCC] text-sm bg-[rgba(45,184,155,0.1)] px-2 py-0.5">
          usePageTracker.ts
        </code>
        .
      </p>
      <div className="space-y-3 text-sm text-[rgba(240,237,230,0.6)]">
        {[
          "Create a new Google Sheet called \"Site Analytics\"",
          "Go to Extensions → Apps Script",
          "Paste the analytics script from scripts/analytics-appscript.js",
          "Deploy as Web App → Anyone can access",
          "Copy the URL and replace ANALYTICS_SCRIPT_ID in both files",
        ].map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="font-['JetBrains_Mono',monospace] text-[#47ECCC] font-bold shrink-0">
              {i + 1}.
            </span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
