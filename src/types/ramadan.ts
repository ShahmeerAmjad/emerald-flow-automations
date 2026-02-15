// src/types/ramadan.ts
// This defines the exact shape of each juz-X.json file
// Claude Code will generate content matching this schema

export interface StandoutAyah {
  arabic: string;
  translation: string;
  translationSource: string; // e.g., "Sahih International" or "The Clear Quran"
  surahName: string;
  verseNumber: string; // e.g., "2:255"
  reflection: string;
}

export interface SurahBreakdown {
  name: string; // e.g., "Al-Baqarah"
  englishMeaning: string; // e.g., "The Cow"
  surahNumber: number;
  verseRange: string; // e.g., "142-252" (verses in THIS juz only)
  continuesInNextJuz?: boolean;
  continuesFromPreviousJuz?: boolean;
  meaningOfName: string;
  revelationContext: string;
  coreTheme: string;
  keyTeachings: string[]; // 3-5 bullet points
  standoutAyah: StandoutAyah;
}

export interface CoreTheme {
  name: string; // 2-4 words
  explanation: string;
  dailyRelevance: string; // Why it matters today / during Ramadan
}

export interface KeyAyah {
  arabic: string;
  translation: string;
  translationSource: string;
  reference: string; // e.g., "Surah Al-Baqarah, 2:255"
  significance: string;
  reflectionPrompt: string;
}

export interface HadithOfTheDay {
  text: string;
  source: string; // e.g., "Sahih al-Bukhari #1234"
  reflection: string;
  unableToVerify?: boolean; // If true, show a note instead
}

export interface DiscussionQuestions {
  reflectionQuestion: string;
  applicationQuestion: string;
}

export interface JuzDigest {
  juzNumber: number;
  dayNumber: number;
  dateGenerated: string; // ISO date
  
  // Header
  surahsCovered: string; // Summary line for header
  
  // Sections
  juzSummary: string; // 3-5 sentences
  surahBreakdowns: SurahBreakdown[];
  connectingTheDots: string; // 2-3 sentences
  coreThemes: CoreTheme[]; // 2-3 themes
  keyAyat: KeyAyah[]; // 3-5 verses
  hadithOfTheDay: HadithOfTheDay;
  dailyPractice: string; // Specific, actionable
  discussionQuestions: DiscussionQuestions;
  habitCheckIn: string;
  closingMessage: string;
  closingDua?: string;
}
