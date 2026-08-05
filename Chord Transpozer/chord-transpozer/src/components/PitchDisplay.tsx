'use client';

import React from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { useMicrophone } from '@/hooks/useMicrophone';

export default function PitchDisplay() {
  const { currentFrequency, currentNote, stableNote, centsOff, clarity, isListening, permissionStatus, errorMessage } = useAudioStore();
  const { startListening, stopListening } = useMicrophone();

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Determine cents indicator color
  let centsColor = 'bg-[var(--success)]';
  if (Math.abs(centsOff) > 10) centsColor = 'bg-[var(--warning)]';
  if (Math.abs(centsOff) > 30) centsColor = 'bg-[var(--danger)]';

  const centsPercent = (centsOff + 50) + '%';
  const clarityStroke = Math.max(0, Math.min(100, clarity * 100));

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto">
      <div className="glass rounded-3xl p-6 w-full flex flex-col items-center gap-5 relative overflow-hidden transition-all duration-300 border border-white/10" suppressHydrationWarning>
        
        {/* Error message */}
        {errorMessage && (
          <div className="w-full bg-[var(--danger)]/20 border border-[var(--danger)] text-white p-3 rounded-xl text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* Display Area */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Clarity Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" suppressHydrationWarning>
            <circle
              cx="112"
              cy="112"
              r="104"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
              suppressHydrationWarning
            />
            <circle
              cx="112"
              cy="112"
              r="104"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="653.45"
              strokeDashoffset={653.45 - (653.45 * clarityStroke) / 100}
              className="transition-all duration-300 ease-out"
              suppressHydrationWarning
            />
          </svg>

          {/* Central Note Display */}
          <div className="text-center z-10 flex flex-col items-center justify-center">
            {isListening ? (
              currentNote ? (
                <>
                  <div className="text-6xl font-bold text-white transition-all duration-200">
                    {currentNote}
                  </div>
                  <div className="text-sm text-gray-400 mt-1 font-mono">
                    {currentFrequency?.toFixed(1)} Hz
                  </div>
                  {stableNote && (
                    <div className="mt-2 text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Kararlı: {stableNote}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xl text-gray-400 animate-pulse">Dinleniyor...</div>
              )
            ) : (
              <div className="text-xl text-gray-400">Başlamak için dokunun</div>
            )}
          </div>
        </div>

        {/* Cents Indicator */}
        {isListening && (
          <div className="w-full flex flex-col items-center gap-1.5">
            <div className="w-full h-3 bg-gray-900 rounded-full relative overflow-hidden border border-white/5">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 -translate-x-1/2 z-10"></div>
              <div 
                className={`absolute top-0 bottom-0 w-2 rounded-full -translate-x-1/2 transition-all duration-100 ${centsColor}`}
                style={{ left: centsPercent }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-[10px] text-gray-400 font-mono">
              <span>-50¢</span>
              <span>{Math.round(centsOff)} ¢</span>
              <span>+50¢</span>
            </div>
          </div>
        )}

        {/* Start/Stop Button */}
        <button
          onClick={handleToggle}
          className={`px-7 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2
            ${isListening 
              ? 'bg-[var(--danger)]/20 text-[var(--danger)] border border-[var(--danger)]/50 hover:bg-[var(--danger)]/30' 
              : 'bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] text-white hover:opacity-90 shadow-lg shadow-indigo-500/20'
            }`}
        >
          {isListening && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--danger)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--danger)]"></span>
            </span>
          )}
          {isListening ? 'Analizi Durdur' : (permissionStatus === 'requesting' ? 'İzin İsteniyor...' : 'Mikrofonu Başlat')}
        </button>

      </div>
    </div>
  );
}
