// src/pages/RamadanChallenge.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { JuzDigest as JuzDigestType } from "@/types/ramadan";

// Dynamically import all juz JSON files
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

// Ramadan 2026 starts approximately Feb 18, 2026
const RAMADAN_START = new Date(2026, 1, 18); // 0-indexed month: 1 = February

function getRamadanDay(): number {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfRamadan = new Date(RAMADAN_START.getFullYear(), RAMADAN_START.getMonth(), RAMADAN_START.getDate());
  const diffMs = startOfToday.getTime() - startOfRamadan.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export default function RamadanChallenge() {
  const currentRamadanDay = useMemo(() => getRamadanDay(), []);

  const isBeforeRamadan = currentRamadanDay < 1;
  const isAfterRamadan = currentRamadanDay > 30;

  function isDayUnlocked(day: number): boolean {
    const hasContent = day in juzData;
    if (!hasContent) return false;
    if (isBeforeRamadan || isAfterRamadan) return true;
    return day <= currentRamadanDay;
  }

  return (
    <div className="ramadan-page">
      {/* Background overlays */}
      <div className="ramadan-bg-overlay" />
      <div className="ramadan-noise" />

      {/* Hero Section */}
      <section className="ramadan-hero">
        <div className="ramadan-hero-ornament" />
        <div className="ramadan-hero-crescent">🌙</div>
        <h1 className="ramadan-hero-title">
          Ramadan Qur'an <em>Challenge</em>
        </h1>
        <p className="ramadan-hero-subtitle">30 Days · 30 Juz · One Ummah</p>
        <p className="ramadan-hero-ayah" dir="rtl">
          شَهْرُ رَمَضَانَ ٱلَّذِىٓ أُنزِلَ فِيهِ ٱلْقُرْءَانُ هُدًى لِّلنَّاسِ
        </p>
        <p className="ramadan-hero-ayah-trans">
          "The month of Ramadan in which the Qur'an was revealed, a guidance for the people." — 2:185
        </p>
        <div className="ramadan-scroll-hint">Scroll</div>
      </section>

      {/* Day Grid */}
      <nav className="ramadan-day-nav" id="day-grid">
        <p className="ramadan-day-nav-title">Choose Your Day</p>
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
          const unlocked = isDayUnlocked(day);
          const isCurrent = day === currentRamadanDay;
          return unlocked ? (
            <Link
              key={day}
              to={`/ramadan-day${day}`}
              className={`ramadan-day-dot${isCurrent ? " current" : ""}`}
              title={`Day ${day}`}
            >
              {day}
            </Link>
          ) : (
            <span
              key={day}
              className="ramadan-day-dot locked"
              title={`Day ${day} — locked`}
            >
              {day}
            </span>
          );
        })}
      </nav>

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

      <style>{ramadanStyles}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   RAMADAN PAGE STYLES
   Scoped with .ramadan- prefix
   ═══════════════════════════════════════ */
const ramadanStyles = `
  :root {
    --rc-bg-deep: #0a0f0d;
    --rc-bg-card: #0f1a15;
    --rc-bg-card-hover: #142420;
    --rc-emerald: #1a7a5a;
    --rc-emerald-light: #22a67a;
    --rc-emerald-glow: #2ce8a0;
    --rc-gold: #c9a84c;
    --rc-gold-light: #e8c968;
    --rc-gold-dim: #8a7235;
    --rc-cream: #f0e8d8;
    --rc-cream-soft: #e0d5c0;
    --rc-text-primary: #eae4d8;
    --rc-text-secondary: #b0a898;
    --rc-text-muted: #7a7268;
    --rc-border: rgba(201, 168, 76, 0.12);
    --rc-border-glow: rgba(201, 168, 76, 0.25);
  }

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

  /* ── HERO ── */
  .ramadan-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 24px;
    position: relative;
    z-index: 1;
  }

  .ramadan-hero-ornament {
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--rc-gold), transparent);
    margin-bottom: 40px;
    animation: rcFadeIn 1.2s ease-out;
  }

  .ramadan-hero-crescent {
    font-size: 56px;
    margin-bottom: 24px;
    animation: rcFloatIn 1s ease-out;
    filter: drop-shadow(0 0 20px rgba(201, 168, 76, 0.3));
  }

  .ramadan-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(2.2rem, 6vw, 3.8rem);
    color: var(--rc-cream);
    letter-spacing: 0.02em;
    line-height: 1.2;
    margin-bottom: 8px;
    animation: rcFadeIn 1s ease-out 0.2s both;
  }

  .ramadan-hero-title em {
    font-style: italic;
    color: var(--rc-gold);
    font-weight: 400;
  }

  .ramadan-hero-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.1rem, 3vw, 1.4rem);
    color: var(--rc-text-secondary);
    font-weight: 300;
    letter-spacing: 0.06em;
    margin-bottom: 32px;
    animation: rcFadeIn 1s ease-out 0.4s both;
  }

  .ramadan-hero-ayah {
    font-family: 'Amiri', serif;
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    color: var(--rc-gold);
    line-height: 1.8;
    margin-bottom: 8px;
    animation: rcFadeIn 1s ease-out 0.6s both;
  }

  .ramadan-hero-ayah-trans {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1rem;
    color: var(--rc-text-muted);
    margin-bottom: 48px;
    animation: rcFadeIn 1s ease-out 0.7s both;
  }

  .ramadan-scroll-hint {
    position: absolute;
    bottom: 32px;
    animation: rcPulse 2s ease-in-out infinite;
    color: var(--rc-text-muted);
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ramadan-scroll-hint::after {
    content: '';
    display: block;
    width: 1px;
    height: 32px;
    background: linear-gradient(to bottom, var(--rc-gold-dim), transparent);
    margin: 8px auto 0;
  }

  /* ── DAY GRID ── */
  .ramadan-day-nav {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    padding: 40px 24px 80px;
    max-width: 520px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .ramadan-day-nav-title {
    width: 100%;
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    color: var(--rc-cream);
    margin-bottom: 16px;
    font-weight: 400;
  }

  .ramadan-day-dot {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--rc-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-family: 'Outfit', sans-serif;
    color: var(--rc-text-secondary);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--rc-bg-card);
  }

  .ramadan-day-dot:hover:not(.locked) {
    border-color: var(--rc-gold);
    color: var(--rc-gold);
    background: var(--rc-bg-card-hover);
    transform: scale(1.1);
  }

  .ramadan-day-dot.current {
    background: var(--rc-gold);
    color: var(--rc-bg-deep);
    border-color: var(--rc-gold);
    font-weight: 600;
    box-shadow: 0 0 16px rgba(201, 168, 76, 0.3);
  }

  .ramadan-day-dot.locked {
    opacity: 0.25;
    cursor: default;
    background: transparent;
  }

  /* ── FOOTER ── */
  .ramadan-footer {
    text-align: center;
    padding: 60px 24px;
    border-top: 1px solid var(--rc-border);
    position: relative;
    z-index: 1;
  }

  .ramadan-footer p {
    font-size: 0.78rem;
    color: var(--rc-text-muted);
    line-height: 1.8;
  }

  .ramadan-footer a {
    color: var(--rc-gold-dim);
    text-decoration: none;
  }

  /* ── ANIMATIONS ── */
  @keyframes rcFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes rcFloatIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes rcPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 480px) {
    .ramadan-container { padding: 0 16px; }
    .ramadan-day-nav { gap: 8px; padding: 32px 16px 60px; }
    .ramadan-day-dot { width: 44px; height: 44px; font-size: 0.82rem; }
  }
`;
