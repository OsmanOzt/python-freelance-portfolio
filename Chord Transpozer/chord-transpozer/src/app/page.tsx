'use client';

import PitchDisplay from "@/components/PitchDisplay";
import ChordSheetTransposer from "@/components/ChordSheetTransposer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-12 bg-[var(--background)]">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-between font-sans">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-start)] via-indigo-400 to-[var(--accent)]">
            Chord Transpozer
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto">
            Canlı Ses Analizi & Otomatik Akor Transpoze Sistemi
          </p>
        </div>

        {/* Live Pitch Display */}
        <PitchDisplay />

        {/* Live Chord Sheet Transposer */}
        <ChordSheetTransposer />

        {/* Info & Privacy Footer */}
        <div className="mt-12 w-full max-w-xl">
          <div className="glass rounded-2xl p-5 text-sm text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10" suppressHydrationWarning>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-semibold text-white">Tamamen Gizli & Cihaz-İçi</div>
                <div className="text-xs text-gray-400">Ses veriniz sunucuya asla gitmez.</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              Client-Side Web Audio API + Pitchy
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
