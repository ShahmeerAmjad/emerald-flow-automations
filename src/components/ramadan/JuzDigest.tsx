// src/components/ramadan/JuzDigest.tsx
import { useEffect, useRef } from "react";
import type { JuzDigest as JuzDigestType, SurahBreakdown } from "@/types/ramadan";
import { StoryDrawer } from "./StoryDrawer";
import { AyahPlayButton } from "./AyahPlayButton";
import { parseVerseReference } from "@/lib/quran-audio";

interface Props {
  digest: JuzDigestType;
}

export function JuzDigest({ digest }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reveals = container.querySelectorAll(".rc-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("rc-visible");
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 100px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [digest.juzNumber]);

  // Parse surahsCovered into tags
  const surahTags = digest.surahsCovered.split("•").map((s) => s.trim());

  return (
    <div className="rc-digest" ref={containerRef}>
      <div className="rc-container">
        {/* Day Header */}
        <div className="rc-day-header rc-reveal">
          <h1>
            Day <span>{digest.dayNumber}</span> of 30
          </h1>
          <p className="rc-juz-info">Juz {digest.juzNumber}</p>
          <div className="rc-surahs-covered">
            {surahTags.map((tag, i) => (
              <span key={i} className="rc-surah-tag" dangerouslySetInnerHTML={{ __html: formatSurahTag(tag) }} />
            ))}
          </div>
        </div>

        {/* Ramadan Welcome — Day 1 only */}
        {digest.specialMessage && (
          <div className="rc-ramadan-intro rc-reveal">
            <div className="rc-intro-icon">﷽</div>
            {digest.specialMessage.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {digest.specialMessage && <div className="rc-divider" />}

        {/* Juz Summary */}
        <RcSection emoji="📝" label="Juz Summary" id="section-summary">
          <div className="rc-summary-card">{digest.juzSummary}</div>
        </RcSection>

        <div className="rc-divider" />

        {/* Surah-by-Surah Breakdown */}
        <RcSection emoji="📖" label="Surah-by-Surah Breakdown">
          {digest.surahBreakdowns.map((surah, i) => (
            <SurahBlock key={i} surah={surah} index={i} />
          ))}
        </RcSection>

        <div className="rc-divider" />

        {/* Connecting the Dots */}
        <RcSection emoji="🔗" label="Connecting the Dots" id="section-connecting">
          <div className="rc-summary-card">{digest.connectingTheDots}</div>
        </RcSection>

        <div className="rc-divider" />

        {/* Go Deeper — Stories */}
        {digest.stories && digest.stories.length > 0 && (
          <>
            <RcSection emoji="📜" label="Go Deeper" id="section-stories">
              <div className="rc-stories-stack">
                {digest.stories.map((story) => (
                  <StoryDrawer key={story.id} story={story} />
                ))}
              </div>
            </RcSection>
            <div className="rc-divider" />
          </>
        )}

        {/* Core Themes */}
        <RcSection emoji="🎯" label="Core Themes of This Juz" id="section-themes">
          {digest.coreThemes.map((theme, i) => (
            <div key={i} className="rc-theme-card" id={`section-theme-${i}`}>
              <h4>{i + 1}. {theme.name}</h4>
              <p>{theme.explanation}</p>
              <p className="rc-ramadan-tie">{theme.dailyRelevance}</p>
            </div>
          ))}
        </RcSection>

        <div className="rc-divider" />

        {/* Key Ayat Collection */}
        <RcSection emoji="✨" label="Key Ayat Collection" id="section-ayat">
          {digest.keyAyat.map((ayah, i) => {
            const parsed = parseVerseReference(ayah.reference);
            return (
              <div key={i} className="rc-ayah-card" id={`section-ayah-${i}`} style={{ marginBottom: i < digest.keyAyat.length - 1 ? "16px" : 0 }}>
                {parsed && <AyahPlayButton surahNumber={parsed.surah} ayahNumber={parsed.ayah} label={ayah.reference} />}
                <div className="rc-ayah-arabic" dir="rtl">{ayah.arabic}</div>
                {ayah.transliteration && (
                  <div className="rc-ayah-transliteration">{ayah.transliteration}</div>
                )}
                <div className="rc-ayah-translation">"{ayah.translation}"</div>
                <div className="rc-ayah-ref">{ayah.reference}</div>
                <div className="rc-ayah-reflection">{ayah.reflectionPrompt}</div>
              </div>
            );
          })}
        </RcSection>

        <div className="rc-divider" />

        {/* Hadith of the Day */}
        <RcSection emoji="📚" label="Hadith of the Day" id="section-hadith">
          {digest.hadithOfTheDay.unableToVerify ? (
            <div className="rc-summary-card" style={{ fontStyle: "italic", color: "var(--rc-text-muted)" }}>
              A verified hadith could not be confirmed for this section.
            </div>
          ) : (
            <div className="rc-hadith-card">
              <div className="rc-hadith-text">"{digest.hadithOfTheDay.text}"</div>
              <div className="rc-hadith-source">{digest.hadithOfTheDay.source}</div>
              <div className="rc-hadith-reflection">{digest.hadithOfTheDay.reflection}</div>
            </div>
          )}
        </RcSection>

        <div className="rc-divider" />

        {/* Daily Practice */}
        <RcSection emoji="🤲" label="Daily Practice" id="section-practice">
          <div className="rc-practice-card">
            <p>{digest.dailyPractice}</p>
          </div>
        </RcSection>

        <div className="rc-divider" />

        {/* Daily Quranic Duas */}
        {digest.dailyDuas && digest.dailyDuas.length > 0 && (
          <>
            <RcSection emoji="🕌" label="Quranic Duas for Today" id="section-duas">
              {digest.dailyDuas.map((dua, i) => {
                const parsed = parseVerseReference(dua.reference);
                return (
                  <div key={i} className="rc-dua-card" style={{ marginBottom: i < digest.dailyDuas!.length - 1 ? "16px" : 0 }}>
                    {parsed && <AyahPlayButton surahNumber={parsed.surah} ayahNumber={parsed.ayah} label={`${dua.surahName} ${dua.reference}`} />}
                    <div className="rc-dua-purpose">{dua.purpose}</div>
                    <div className="rc-dua-arabic" dir="rtl">{dua.arabic}</div>
                    <div className="rc-dua-transliteration">{dua.transliteration}</div>
                    <div className="rc-dua-translation">"{dua.translation}"</div>
                    <div className="rc-dua-ref">{dua.reference} — {dua.surahName}</div>
                    <div className="rc-dua-context">{dua.context}</div>
                  </div>
                );
              })}
            </RcSection>
            <div className="rc-divider" />
          </>
        )}

        {/* Discussion Questions */}
        <RcSection emoji="💬" label="Community Discussion" id="section-discussion">
          <div className="rc-discussion-card">
            <div className="rc-q-type">Reflection Question</div>
            <p>{digest.discussionQuestions.reflectionQuestion}</p>
          </div>
          <div className="rc-discussion-card">
            <div className="rc-q-type">Application Question</div>
            <p>{digest.discussionQuestions.applicationQuestion}</p>
          </div>
        </RcSection>

        <div className="rc-divider" />

        {/* Habit Check-In */}
        <RcSection emoji="🕌" label="Ramadan Habit Check-In" id="section-habit">
          <div className="rc-habit-section">
            <p>{digest.habitCheckIn}</p>
            {digest.closingDua && (
              <div className="rc-closing-dua" dir="rtl">{digest.closingDua}</div>
            )}
            {digest.closingDuaTransliteration && (
              <div className="rc-closing-dua-transliteration">{digest.closingDuaTransliteration}</div>
            )}
            <div className="rc-closing-message">{digest.closingMessage}</div>
          </div>
        </RcSection>
      </div>

      <style>{digestStyles}</style>
    </div>
  );
}

/* ═══ HELPER COMPONENTS ═══ */

function RcSection({ emoji, label, children, id }: { emoji: string; label: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="rc-section rc-reveal" id={id}>
      <div className="rc-section-label">
        {emoji} {label}
      </div>
      {children}
    </section>
  );
}

function SurahBlock({ surah, index }: { surah: SurahBreakdown; index: number }) {
  const arabicNumerals = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"];

  return (
    <div className="rc-surah-block" id={`section-surah-${index}`}>
      <h3>
        {surah.name}{" "}
        <span className="rc-surah-num">
          Surah {surah.surahNumber}, Verses {surah.verseRange}
        </span>
      </h3>

      <div className="rc-surah-meta">
        <div className="rc-surah-meta-item">
          <strong>Name:</strong> "{surah.englishMeaning}"
        </div>
        <div className="rc-surah-meta-item">
          <strong>Context:</strong> {surah.revelationContext.split(".")[0]}
        </div>
        {surah.continuesInNextJuz && (
          <div className="rc-surah-meta-item">
            <strong>Continues:</strong> Next Juz →
          </div>
        )}
        {surah.continuesFromPreviousJuz && (
          <div className="rc-surah-meta-item">
            <strong>From:</strong> ← Previous Juz
          </div>
        )}
      </div>

      <div className="rc-surah-detail">
        <div className="rc-surah-detail-label">Revelation Context</div>
        <p>{surah.revelationContext}</p>
      </div>

      <div className="rc-surah-detail">
        <div className="rc-surah-detail-label">Core Theme</div>
        <p>{surah.coreTheme}</p>
      </div>

      <div className="rc-surah-detail">
        <div className="rc-surah-detail-label">Key Teachings</div>
      </div>

      {surah.keyTeachings.map((teaching, i) => (
        <div key={i} className="rc-key-teaching">
          <div className="rc-key-teaching-icon">{arabicNumerals[i] || (i + 1)}</div>
          <p>{teaching}</p>
        </div>
      ))}

      {/* Standout Ayah */}
      <div className="rc-ayah-card" style={{ marginTop: "20px" }}>
        {(() => {
          const parsed = parseVerseReference(surah.standoutAyah.verseNumber);
          return parsed ? <AyahPlayButton surahNumber={parsed.surah} ayahNumber={parsed.ayah} label={`${surah.standoutAyah.surahName} ${surah.standoutAyah.verseNumber}`} /> : null;
        })()}
        <div className="rc-surah-detail-label" style={{ textAlign: "center", marginBottom: "12px" }}>
          Standout Ayah
        </div>
        <div className="rc-ayah-arabic" dir="rtl">{surah.standoutAyah.arabic}</div>
        {surah.standoutAyah.transliteration && (
          <div className="rc-ayah-transliteration">{surah.standoutAyah.transliteration}</div>
        )}
        <div className="rc-ayah-translation">"{surah.standoutAyah.translation}"</div>
        <div className="rc-ayah-ref">
          Surah {surah.standoutAyah.surahName} {surah.standoutAyah.verseNumber}
        </div>
        <div className="rc-ayah-reflection">{surah.standoutAyah.reflection}</div>
      </div>
    </div>
  );
}

function formatSurahTag(tag: string): string {
  // Bold the surah name (first part before parenthesis or numbers)
  const match = tag.match(/^([A-Za-z\s-]+)\s*(\(.+\))$/);
  if (match) {
    return `<strong>${match[1].trim()}</strong> · ${match[2]}`;
  }
  return tag;
}

/* ═══════════════════════════════════════
   DIGEST STYLES
   Matching ramadan-challenge.html design
   ═══════════════════════════════════════ */
const digestStyles = `
  .rc-digest {
    position: relative;
    z-index: 1;
  }

  .rc-container {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }

  /* ── Scroll reveal ── */
  .rc-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .rc-reveal.rc-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Ramadan Intro (Day 1) ── */
  .rc-ramadan-intro {
    text-align: center;
    margin-bottom: 48px;
    padding: 48px 32px;
    background: linear-gradient(135deg, rgba(201, 168, 76, 0.06), rgba(26, 122, 90, 0.06));
    border: 1px solid var(--rc-border-glow);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
  }

  .rc-ramadan-intro::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--rc-gold), transparent);
  }

  .rc-intro-icon {
    font-family: 'Amiri', serif;
    font-size: clamp(1.4rem, 4vw, 1.8rem);
    color: var(--rc-gold);
    margin-bottom: 24px;
  }

  .rc-ramadan-intro p {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.1rem, 2.8vw, 1.25rem);
    color: var(--rc-cream-soft);
    line-height: 2;
    margin-bottom: 16px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .rc-ramadan-intro p:last-child {
    margin-bottom: 0;
  }

  /* ── Day Header ── */
  .rc-day-header {
    text-align: center;
    margin-bottom: 56px;
    padding: 48px 0;
    border-bottom: 1px solid var(--rc-border);
  }

  .rc-day-header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    color: var(--rc-cream);
    margin-bottom: 8px;
  }

  .rc-day-header h1 span {
    color: var(--rc-gold);
    font-weight: 500;
  }

  .rc-juz-info {
    font-size: 1rem;
    color: var(--rc-text-secondary);
    margin-bottom: 20px;
  }

  .rc-surahs-covered {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .rc-surah-tag {
    padding: 8px 20px;
    border: 1px solid var(--rc-border);
    border-radius: 40px;
    font-size: 0.9rem;
    color: var(--rc-text-secondary);
    background: var(--rc-bg-card);
  }

  .rc-surah-tag strong {
    color: var(--rc-gold-light);
    font-weight: 500;
  }

  /* ── Sections ── */
  .rc-section {
    margin-bottom: 64px;
  }

  .rc-section-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--rc-gold);
    margin-bottom: 16px;
    font-weight: 600;
  }

  /* ── Summary Card ── */
  .rc-summary-card {
    background: var(--rc-bg-card);
    border: 1px solid var(--rc-border);
    border-radius: 16px;
    padding: 32px;
    font-size: 1.05rem;
    color: var(--rc-text-secondary);
    line-height: 1.85;
  }

  /* ── Surah Block ── */
  .rc-surah-block {
    background: var(--rc-bg-card);
    border: 1px solid var(--rc-border);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
    transition: border-color 0.3s ease;
  }

  .rc-surah-block:hover {
    border-color: var(--rc-border-glow);
  }

  .rc-surah-block h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    color: var(--rc-cream);
    font-weight: 500;
    margin-bottom: 4px;
  }

  .rc-surah-num {
    color: var(--rc-gold);
    font-size: 0.95rem;
    font-family: 'Outfit', sans-serif;
    font-weight: 400;
    vertical-align: middle;
  }

  .rc-surah-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--rc-border);
  }

  .rc-surah-meta-item {
    font-size: 0.88rem;
    color: var(--rc-text-muted);
  }

  .rc-surah-meta-item strong {
    color: var(--rc-text-secondary);
    font-weight: 500;
  }

  .rc-surah-detail {
    margin-bottom: 16px;
  }

  .rc-surah-detail-label {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--rc-gold-dim);
    margin-bottom: 4px;
    font-weight: 600;
  }

  .rc-surah-detail p {
    font-size: 1rem;
    color: var(--rc-text-secondary);
  }

  /* ── Key Teaching ── */
  .rc-key-teaching {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    padding: 12px 16px;
    background: rgba(26, 122, 90, 0.06);
    border-radius: 10px;
    border-left: 2px solid var(--rc-emerald);
  }

  .rc-key-teaching-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    background: var(--rc-emerald);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    color: white;
    margin-top: 2px;
  }

  .rc-key-teaching p {
    font-size: 1rem;
    color: var(--rc-text-secondary);
    line-height: 1.7;
  }

  /* ── Ayah Card ── */
  .rc-ayah-card {
    background: linear-gradient(135deg, rgba(201, 168, 76, 0.06), rgba(26, 122, 90, 0.04));
    border: 1px solid var(--rc-border-glow);
    border-radius: 14px;
    padding: 28px;
    text-align: center;
  }

  .rc-ayah-arabic {
    font-family: 'Amiri', serif;
    font-size: clamp(1.5rem, 4.5vw, 2.1rem);
    color: var(--rc-gold);
    line-height: 2;
    margin-bottom: 12px;
  }

  .rc-ayah-translation {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--rc-cream-soft);
    margin-bottom: 8px;
    line-height: 1.7;
  }

  .rc-ayah-ref {
    font-size: 0.82rem;
    color: var(--rc-text-muted);
    letter-spacing: 0.05em;
  }

  .rc-ayah-reflection {
    font-size: 0.95rem;
    color: var(--rc-text-secondary);
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--rc-border);
    line-height: 1.7;
  }

  /* ── Theme Card ── */
  .rc-theme-card {
    background: var(--rc-bg-card);
    border: 1px solid var(--rc-border);
    border-radius: 14px;
    padding: 28px;
    margin-bottom: 16px;
  }

  .rc-theme-card h4 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    color: var(--rc-gold-light);
    font-weight: 500;
    margin-bottom: 8px;
  }

  .rc-theme-card p {
    font-size: 1rem;
    color: var(--rc-text-secondary);
    line-height: 1.7;
  }

  .rc-ramadan-tie {
    font-size: 0.92rem;
    color: var(--rc-emerald-light);
    margin-top: 10px;
    font-style: italic;
  }

  /* ── Hadith Card ── */
  .rc-hadith-card {
    background: linear-gradient(135deg, var(--rc-bg-card), rgba(26, 122, 90, 0.08));
    border: 1px solid var(--rc-emerald);
    border-radius: 16px;
    padding: 32px;
  }

  .rc-hadith-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    color: var(--rc-cream-soft);
    line-height: 1.8;
    margin-bottom: 16px;
  }

  .rc-hadith-source {
    font-size: 0.88rem;
    color: var(--rc-gold-dim);
    font-weight: 600;
    letter-spacing: 0.05em;
    margin-bottom: 16px;
  }

  .rc-hadith-reflection {
    font-size: 1rem;
    color: var(--rc-text-secondary);
    line-height: 1.7;
    padding-top: 16px;
    border-top: 1px solid rgba(26, 122, 90, 0.2);
  }

  /* ── Practice Card ── */
  .rc-practice-card {
    background: var(--rc-bg-card);
    border: 1px solid var(--rc-gold-dim);
    border-radius: 16px;
    padding: 32px;
    position: relative;
    overflow: hidden;
  }

  .rc-practice-card::before {
    content: '🤲';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 80px;
    opacity: 0.05;
  }

  .rc-practice-card p {
    font-size: 1.02rem;
    color: var(--rc-text-secondary);
    line-height: 1.7;
  }

  /* ── Discussion Card ── */
  .rc-discussion-card {
    background: var(--rc-bg-card);
    border: 1px solid var(--rc-border);
    border-radius: 14px;
    padding: 24px 28px;
    margin-bottom: 12px;
  }

  .rc-q-type {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--rc-emerald-light);
    font-weight: 600;
    margin-bottom: 8px;
  }

  .rc-discussion-card p {
    font-size: 1.02rem;
    color: var(--rc-text-secondary);
    line-height: 1.7;
  }

  /* ── Habit Section ── */
  .rc-habit-section {
    background: linear-gradient(135deg, rgba(201, 168, 76, 0.04), rgba(26, 122, 90, 0.04));
    border: 1px solid var(--rc-border);
    border-radius: 16px;
    padding: 32px;
    text-align: center;
  }

  .rc-habit-section p {
    font-size: 1.02rem;
    color: var(--rc-text-secondary);
    line-height: 1.7;
  }

  .rc-closing-dua {
    font-family: 'Amiri', serif;
    font-size: 1.2rem;
    color: var(--rc-gold);
    margin-top: 20px;
  }

  .rc-closing-message {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--rc-cream-soft);
    margin-top: 8px;
  }

  /* ── Transliteration ── */
  .rc-ayah-transliteration {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.92rem;
    color: var(--rc-text-muted);
    margin-bottom: 8px;
    line-height: 1.6;
  }

  .rc-closing-dua-transliteration {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.95rem;
    color: var(--rc-text-muted);
    margin-top: 8px;
    line-height: 1.6;
  }

  /* ── Stories Stack ── */
  .rc-stories-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ── Dua Card ── */
  .rc-dua-card {
    background: linear-gradient(135deg, rgba(201, 168, 76, 0.06), rgba(26, 122, 90, 0.04));
    border: 1px solid var(--rc-border-glow);
    border-radius: 14px;
    padding: 28px;
    text-align: center;
  }

  .rc-dua-purpose {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--rc-gold);
    font-weight: 700;
    margin-bottom: 16px;
  }

  .rc-dua-arabic {
    font-family: 'Amiri', serif;
    font-size: clamp(1.4rem, 4.5vw, 1.9rem);
    color: var(--rc-gold);
    line-height: 2;
    margin-bottom: 10px;
  }

  .rc-dua-transliteration {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.92rem;
    color: var(--rc-text-muted);
    margin-bottom: 10px;
    line-height: 1.6;
  }

  .rc-dua-translation {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.08rem;
    color: var(--rc-cream-soft);
    margin-bottom: 10px;
    line-height: 1.7;
  }

  .rc-dua-ref {
    font-size: 0.8rem;
    color: var(--rc-text-muted);
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }

  .rc-dua-context {
    font-size: 0.92rem;
    color: var(--rc-text-secondary);
    line-height: 1.7;
    padding-top: 12px;
    border-top: 1px solid var(--rc-border);
  }

  /* ── Divider ── */
  .rc-divider {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--rc-gold-dim), transparent);
    margin: 48px auto;
  }

  /* ── Audio Play Button Positioning ── */
  .rc-ayah-card,
  .rc-dua-card {
    position: relative;
  }

  .rc-audio-active {
    box-shadow: 0 0 0 2px var(--rc-gold-dim), 0 0 20px rgba(201, 168, 76, 0.15);
    transition: box-shadow 0.3s ease;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 480px) {
    .rc-container { padding: 0 16px; }
    .rc-surah-block,
    .rc-summary-card,
    .rc-hadith-card,
    .rc-practice-card,
    .rc-habit-section { padding: 24px; }
    .rc-ayah-card { padding: 20px; }
    .rc-dua-card { padding: 20px; }
    .rc-surah-meta { flex-direction: column; gap: 6px; }
  }
`;
