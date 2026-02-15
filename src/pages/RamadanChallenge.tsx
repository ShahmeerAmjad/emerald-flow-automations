// src/pages/RamadanChallenge.tsx
import { useState } from "react";
import { JuzDigest } from "@/components/ramadan/JuzDigest";
import type { JuzDigest as JuzDigestType } from "@/types/ramadan";

// Dynamically import all juz JSON files from the data directory
const juzModules = import.meta.glob<{ default: JuzDigestType }>(
  "../data/ramadan/juz-*.json",
  { eager: true }
);

// Parse them into a map: { 1: JuzDigestType, 2: JuzDigestType, ... }
const juzData: Record<number, JuzDigestType> = {};
for (const [path, mod] of Object.entries(juzModules)) {
  const match = path.match(/juz-(\d+)\.json$/);
  if (match) {
    juzData[parseInt(match[1])] = mod.default;
  }
}

const availableDays = Object.keys(juzData)
  .map(Number)
  .sort((a, b) => a - b);

export default function RamadanChallenge() {
  const [selectedDay, setSelectedDay] = useState<number>(
    availableDays[availableDays.length - 1] || 1
  );

  const digest = juzData[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <a href="/" className="text-amber-400 text-sm hover:underline">
              ← sassolutions.ai
            </a>
            <span className="text-amber-200/60 text-xs">
              🌙 Ramadan Qur'an Challenge
            </span>
          </div>
          {/* Day Selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isAvailable = availableDays.includes(day);
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => isAvailable && setSelectedDay(day)}
                  disabled={!isAvailable}
                  className={`
                    flex-shrink-0 w-9 h-9 rounded-full text-xs font-medium
                    transition-all duration-200
                    ${isSelected
                      ? "bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/30"
                      : isAvailable
                        ? "bg-white/10 text-amber-200 hover:bg-white/20"
                        : "bg-white/5 text-gray-600 cursor-not-allowed"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      {digest ? (
        <JuzDigest digest={digest} />
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
          <p className="text-4xl mb-4">🌙</p>
          <p className="text-lg">Day {selectedDay} content coming soon...</p>
          <p className="text-sm mt-2 text-gray-500">
            Check back when this Juz is released!
          </p>
        </div>
      )}
    </div>
  );
}
