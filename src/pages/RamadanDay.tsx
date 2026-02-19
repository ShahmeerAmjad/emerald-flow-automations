import { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { JuzDigest } from "@/components/ramadan/JuzDigest";
import type { JuzDigest as JuzDigestType } from "@/types/ramadan";

const juzModules = import.meta.glob<{ default: JuzDigestType }>(
  "../data/ramadan/juz-*.json",
  { eager: true }
);

const juzData: Record<number, JuzDigestType> = {};
for (const [path, mod] of Object.entries(juzModules)) {
  const match = path.match(/juz-(\d+)\.json$/);
  if (match) {
    juzData[parseInt(match[1])] = mod.default;
  }
}

const RAMADAN_START = new Date(2026, 1, 18);

function getRamadanDay(): number {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfRamadan = new Date(RAMADAN_START.getFullYear(), RAMADAN_START.getMonth(), RAMADAN_START.getDate());
  const diffMs = startOfToday.getTime() - startOfRamadan.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

function isDayUnlocked(day: number): boolean {
  const hasContent = day in juzData;
  if (!hasContent) return false;
  const currentRamadanDay = getRamadanDay();
  const isBeforeRamadan = currentRamadanDay < 1;
  const isAfterRamadan = currentRamadanDay > 30;
  if (isBeforeRamadan || isAfterRamadan) return true;
  return day <= currentRamadanDay;
}

export default function RamadanDay() {
  const { day } = useParams<{ day: string }>();
  const dayNum = parseInt(day || "1", 10);

  const currentRamadanDay = useMemo(() => getRamadanDay(), []);
  const isBeforeRamadan = currentRamadanDay < 1;

  if (isNaN(dayNum) || dayNum < 1 || dayNum > 30) {
    return <Navigate to="/ramadan" replace />;
  }

  const digest = juzData[dayNum];
  const unlocked = isDayUnlocked(dayNum);

  // Find prev/next unlocked days
  const prevDay = Array.from({ length: dayNum - 1 }, (_, i) => dayNum - 1 - i).find(isDayUnlocked);
  const nextDay = Array.from({ length: 30 - dayNum }, (_, i) => dayNum + 1 + i).find(isDayUnlocked);

  return (
    <div className="ramadan-page">
      <div className="ramadan-bg-overlay" />
      <div className="ramadan-noise" />

      {/* Top nav bar */}
      <nav className="rd-topnav">
        <Link to="/ramadan" className="rd-back-link">
          ← All Days
        </Link>
        <span className="rd-day-label">Day {dayNum} of 30</span>
        <div className="rd-nav-spacer" />
      </nav>

      <main className="ramadan-content" style={{ paddingTop: "24px" }}>
        {digest && unlocked ? (
          <>
            <JuzDigest digest={digest} />

            {/* Prev / Next navigation */}
            <div className="rd-prev-next">
              {prevDay ? (
                <Link to={`/ramadan/${prevDay}`} className="rd-nav-btn">
                  ← Day {prevDay}
                </Link>
              ) : (
                <div />
              )}
              {nextDay ? (
                <Link to={`/ramadan/${nextDay}`} className="rd-nav-btn">
                  Day {nextDay} →
                </Link>
              ) : (
                <div />
              )}
            </div>
          </>
        ) : (
          <div className="ramadan-container" style={{ textAlign: "center", padding: "80px 24px" }}>
            <p style={{ fontSize: "3rem", marginBottom: "16px" }}>🌙</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--rc-cream)" }}>
              Day {dayNum} content coming soon...
            </p>
            <p style={{ fontSize: "1rem", color: "var(--rc-text-muted)", marginTop: "8px" }}>
              {isBeforeRamadan
                ? "Ramadan begins soon — check back then!"
                : `This content will unlock on Day ${dayNum} of Ramadan.`}
            </p>
            <Link to="/ramadan" className="rd-back-btn">
              ← Back to all days
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="ramadan-footer">
        <p>Ramadan Qur'an Challenge · 30 Days · 30 Juz · One Ummah</p>
        <p style={{ marginTop: "4px" }}>
          Built with ❤️ by{" "}
          <a href="https://sassolutions.ai" target="_blank" rel="noopener noreferrer">
            SASsolutions.ai
          </a>
        </p>
      </footer>

      <style>{dayPageStyles}</style>
    </div>
  );
}

const dayPageStyles = `
  .ramadan-page {
    font-family: 'Outfit', sans-serif;
    background: var(--rc-bg-deep);
    color: var(--rc-text-primary);
    line-height: 1.7;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
  }

  .ramadan-bg-overlay {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(26, 122, 90, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(201, 168, 76, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 60% 80%, rgba(26, 122, 90, 0.04) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }

  .ramadan-noise {
    position: fixed;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .ramadan-container {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }

  .ramadan-content {
    padding-bottom: 60px;
    position: relative;
    z-index: 1;
  }

  .ramadan-footer {
    text-align: center;
    padding: 60px 24px;
    border-top: 1px solid var(--rc-border);
    position: relative;
    z-index: 1;
  }

  .ramadan-footer p {
    font-size: 0.85rem;
    color: var(--rc-text-muted);
    line-height: 1.8;
  }

  .ramadan-footer a {
    color: var(--rc-gold-dim);
    text-decoration: none;
  }

  /* ── Top Nav ── */
  .rd-topnav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    position: sticky;
    top: 0;
    background: linear-gradient(to bottom, var(--rc-bg-deep) 70%, transparent);
    z-index: 10;
  }

  .rd-back-link {
    font-size: 0.95rem;
    color: var(--rc-gold);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }

  .rd-back-link:hover {
    opacity: 0.8;
  }

  .rd-day-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    color: var(--rc-cream);
    font-weight: 400;
  }

  .rd-nav-spacer {
    width: 80px;
  }

  /* ── Prev/Next ── */
  .rd-prev-next {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 720px;
    margin: 40px auto 0;
    padding: 0 24px;
  }

  .rd-nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border: 1px solid var(--rc-border-glow);
    border-radius: 60px;
    color: var(--rc-gold);
    text-decoration: none;
    font-size: 0.95rem;
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    transition: all 0.2s ease;
    background: var(--rc-bg-card);
  }

  .rd-nav-btn:hover {
    background: var(--rc-bg-card-hover);
    border-color: var(--rc-gold-dim);
  }

  .rd-back-btn {
    display: inline-block;
    margin-top: 24px;
    padding: 12px 28px;
    border: 1px solid var(--rc-border);
    border-radius: 60px;
    color: var(--rc-gold);
    text-decoration: none;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }

  .rd-back-btn:hover {
    border-color: var(--rc-gold-dim);
  }

  @media (max-width: 480px) {
    .rd-topnav { padding: 12px 16px; }
    .rd-nav-spacer { width: 40px; }
    .rd-prev-next { padding: 0 16px; }
    .rd-nav-btn { padding: 12px 20px; font-size: 0.88rem; }
  }
`;
