// src/components/ramadan/JuzDigest.tsx
import { JuzDigest as JuzDigestType } from "@/types/ramadan";

interface Props {
  digest: JuzDigestType;
}

export function JuzDigest({ digest }: Props) {
  return (
    <article className="max-w-2xl mx-auto px-4 py-8 space-y-8 text-gray-100">
      {/* Header */}
      <header className="text-center space-y-2">
        <p className="text-3xl">🌙</p>
        <h1 className="text-2xl font-bold text-amber-400">
          Ramadan Qur'an Challenge — Day {digest.dayNumber} / 30
        </h1>
        <p className="text-lg text-amber-200/80">📖 Juz {digest.juzNumber} Overview</p>
        <p className="text-sm text-gray-400">{digest.surahsCovered}</p>
      </header>

      {/* Juz Summary */}
      <Section emoji="📝" title="Juz Summary">
        <p className="leading-relaxed">{digest.juzSummary}</p>
      </Section>

      {/* Surah Breakdowns */}
      <Section emoji="📖" title="Surah-by-Surah Breakdown">
        {digest.surahBreakdowns.map((surah, i) => (
          <div key={i} className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-bold text-amber-300 text-lg">
              {surah.name} — {surah.englishMeaning} (Surah {surah.surahNumber}, Verses {surah.verseRange})
            </h3>
            {surah.continuesInNextJuz && (
              <p className="text-xs text-amber-200/60 italic mt-1">
                ↪ Continues in the next Juz
              </p>
            )}
            {surah.continuesFromPreviousJuz && (
              <p className="text-xs text-amber-200/60 italic mt-1">
                ↩ Continued from previous Juz
              </p>
            )}
            <div className="mt-3 space-y-2 text-sm">
              <p><span className="text-amber-200 font-medium">Name meaning:</span> {surah.meaningOfName}</p>
              <p><span className="text-amber-200 font-medium">Context:</span> {surah.revelationContext}</p>
              <p><span className="text-amber-200 font-medium">Core theme:</span> {surah.coreTheme}</p>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm list-disc list-inside marker:text-amber-400/60">
              {surah.keyTeachings.map((t, j) => (
                <li key={j}>{t}</li>
              ))}
            </ul>
            {/* Standout Ayah */}
            <div className="mt-4 p-3 rounded bg-amber-900/20 border border-amber-700/30">
              <p className="text-right text-lg font-arabic leading-loose" dir="rtl">
                {surah.standoutAyah.arabic}
              </p>
              <p className="mt-2 text-sm italic text-amber-100/80">
                "{surah.standoutAyah.translation}"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                — {surah.standoutAyah.translationSource} ({surah.standoutAyah.verseNumber})
              </p>
              <p className="text-sm mt-2 text-amber-200/70">{surah.standoutAyah.reflection}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Connecting the Dots */}
      <Section emoji="🔗" title="Connecting the Dots">
        <p className="leading-relaxed">{digest.connectingTheDots}</p>
      </Section>

      {/* Core Themes */}
      <Section emoji="🎯" title="Core Themes">
        {digest.coreThemes.map((theme, i) => (
          <div key={i} className="mb-4">
            <h4 className="font-semibold text-amber-300">{theme.name}</h4>
            <p className="text-sm mt-1">{theme.explanation}</p>
            <p className="text-sm mt-1 text-amber-200/70">{theme.dailyRelevance}</p>
          </div>
        ))}
      </Section>

      {/* Key Ayat */}
      <Section emoji="✨" title="Key Ayat Collection">
        {digest.keyAyat.map((ayah, i) => (
          <div key={i} className="mb-4 p-3 rounded bg-white/5">
            <p className="text-right text-lg font-arabic leading-loose" dir="rtl">
              {ayah.arabic}
            </p>
            <p className="mt-2 text-sm italic text-amber-100/80">"{ayah.translation}"</p>
            <p className="text-xs text-gray-400 mt-1">— {ayah.translationSource} • {ayah.reference}</p>
            <p className="text-sm mt-2">{ayah.significance}</p>
            <p className="text-xs text-amber-300/70 mt-1">💭 {ayah.reflectionPrompt}</p>
          </div>
        ))}
      </Section>

      {/* Hadith */}
      <Section emoji="📚" title="Hadith of the Day">
        {digest.hadithOfTheDay.unableToVerify ? (
          <p className="italic text-gray-400">
            A relevant verified hadith could not be confirmed for this section.
          </p>
        ) : (
          <>
            <blockquote className="border-l-2 border-amber-500/50 pl-4 italic">
              "{digest.hadithOfTheDay.text}"
            </blockquote>
            <p className="text-xs text-gray-400 mt-2">— {digest.hadithOfTheDay.source}</p>
            <p className="text-sm mt-2 text-amber-200/70">{digest.hadithOfTheDay.reflection}</p>
          </>
        )}
      </Section>

      {/* Daily Practice */}
      <Section emoji="🤲" title="Daily Practice">
        <p className="leading-relaxed">{digest.dailyPractice}</p>
      </Section>

      {/* Discussion Questions */}
      <Section emoji="💬" title="Community Discussion">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-amber-300 font-medium uppercase tracking-wide">Reflection</p>
            <p className="text-sm mt-1">{digest.discussionQuestions.reflectionQuestion}</p>
          </div>
          <div>
            <p className="text-xs text-amber-300 font-medium uppercase tracking-wide">Application</p>
            <p className="text-sm mt-1">{digest.discussionQuestions.applicationQuestion}</p>
          </div>
        </div>
      </Section>

      {/* Habit Check-in */}
      <Section emoji="🕌" title="Ramadan Habit Check-In">
        <p className="leading-relaxed">{digest.habitCheckIn}</p>
      </Section>

      {/* Closing */}
      <footer className="text-center space-y-2 pt-4 border-t border-white/10">
        <p className="text-amber-200/80">{digest.closingMessage}</p>
        {digest.closingDua && (
          <p className="text-sm italic text-amber-300/60">{digest.closingDua}</p>
        )}
      </footer>
    </article>
  );
}

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-amber-400 mb-3">
        {emoji} {title}
      </h2>
      <div className="text-gray-200 text-[15px]">{children}</div>
    </section>
  );
}
