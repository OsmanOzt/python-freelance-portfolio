'use client';

import React, { useState, useMemo } from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import {
  calculateSemitoneDistance,
  transposeChord,
  getPitchClass,
} from '@/lib/music-theory/transpose-engine';

const SAMPLE_SONGS = [
  {
    id: 'akdeniz',
    title: 'Akdeniz Akşamları',
    key: 'Am',
    content: `[Am]Akdeniz akşamları bir [G]başka oluyor
[F]Hele bir de yanında [E7]sevdiğin varsa
[Am]Akdeniz akşamları bir [G]başka oluyor
[F]Hele bir de yanında [E7]sevdiğin varsa

[Am]Güneşin batışı [G]başka gülüşü
[F]Rüzgarın esişi [E7]başka öpüşü
[Am]Güneşin batışı [G]başka gülüşü
[F]Rüzgarın esişi [E7]başka öpüşü`,
  },
  {
    id: 'caddelerde',
    title: 'Caddelerde Rüzgar',
    key: 'Dm',
    content: `[Dm]Caddelerde rüzgar [Gm]aklımda şehir
[C7]Gözlerimde gece [F]yağmur diner mi?
[A7]Caddelerde rüzgar [Dm]aklımda şehir
[Bb]Seni düşündüğüm [A7]anlarda yine

[Dm]Rüzgar gibi estin [Gm]geçtin hayatımdan
[C7]Bir tatlı tebessüm [F]kaldı hatıramda
[A7]Unutmak kolay mı [Dm]seni söyle bana?
[Bb]Gözlerimde yaşlar [A7]diner mi yine?`,
  },
  {
    id: 'custom',
    title: 'Özel Şarkı / Kendi Metnin',
    key: 'C',
    content: `[C]Merhaba dünya [G]akor transpoze
[Am]Canlı ses analizi [F]başlıyor şimdi
[C]Söyle şarkını [G]otomatik değişsin
[F]Senin tonuna [G7]uyum sağlasın [C]akorlar`,
  },
];

const COMMON_KEYS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Am', 'Bbm', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'];

interface ParsedChordSegment {
  type: 'chord' | 'text';
  content: string;
}

interface ParsedLine {
  segments: ParsedChordSegment[];
}

export default function ChordSheetTransposer() {
  const {
    stableNote,
    isListening,
    originalKey,
    setOriginalKey,
    manualSemitones,
    setManualSemitones,
    autoTranspose,
    setAutoTranspose,
  } = useAudioStore();

  const [selectedSongId, setSelectedSongId] = useState<string>('akdeniz');
  const [songText, setSongText] = useState<string>(SAMPLE_SONGS[0].content);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Handle song selection
  const handleSongChange = (id: string) => {
    setSelectedSongId(id);
    const song = SAMPLE_SONGS.find((s) => s.id === id);
    if (song) {
      setSongText(song.content);
      setOriginalKey(song.key);
      setManualSemitones(0);
    }
  };

  // Calculate net semitones for transposition
  const computedSemitones = useMemo(() => {
    let autoShift = 0;
    if (autoTranspose && isListening && stableNote) {
      autoShift = calculateSemitoneDistance(originalKey, stableNote);
    }
    return autoShift + manualSemitones;
  }, [autoTranspose, isListening, stableNote, originalKey, manualSemitones]);

  // Transposed key for display
  const currentKey = useMemo(() => {
    const root = getPitchClass(originalKey);
    return transposeChord(root, computedSemitones);
  }, [originalKey, computedSemitones]);

  // Parse lines into chord/text segments
  const parsedLines = useMemo(() => {
    const lines = songText.split('\n');
    return lines.map((line): ParsedLine => {
      const segments: ParsedChordSegment[] = [];
      const regex = /\[([^\]]+)\]/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          segments.push({
            type: 'text',
            content: line.substring(lastIndex, match.index),
          });
        }
        segments.push({
          type: 'chord',
          content: match[1],
        });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        segments.push({
          type: 'text',
          content: line.substring(lastIndex),
        });
      }

      return { segments };
    });
  }, [songText]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 mt-8">
      {/* Control Panel */}
      <div className="glass rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10" suppressHydrationWarning>
        
        {/* Left: Song Select & Key */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Şarkı Seçin</label>
            <select
              value={selectedSongId}
              onChange={(e) => handleSongChange(e.target.value)}
              className="bg-gray-900/80 text-white text-sm px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[var(--accent)]"
            >
              {SAMPLE_SONGS.map((song) => (
                <option key={song.id} value={song.id}>
                  {song.title} ({song.key})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Orijinal Ton</label>
            <select
              value={originalKey}
              onChange={(e) => setOriginalKey(e.target.value)}
              className="bg-gray-900/80 text-white text-sm px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[var(--accent)]"
            >
              {COMMON_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Live Pitch & Transpose Info */}
        <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-2xl border border-white/5">
          <div className="text-center">
            <div className="text-xs text-gray-400">Canlı Ton</div>
            <div className="text-lg font-bold text-[var(--accent)]">
              {isListening ? (stableNote || 'Söyleniyor...') : 'Mikrofon Kapalı'}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Aktif Ton</div>
            <div className="text-lg font-bold text-emerald-400">
              {currentKey} {computedSemitones !== 0 && `(${computedSemitones > 0 ? '+' : ''}${computedSemitones})`}
            </div>
          </div>
        </div>

        {/* Right: Auto Mode & Manual Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {/* Auto Transpose Toggle */}
          <button
            onClick={() => setAutoTranspose(!autoTranspose)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              autoTranspose
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                : 'bg-gray-800 text-gray-400 border border-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoTranspose ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></span>
            Otomatik Transpoze {autoTranspose ? 'AÇIK' : 'KAPALI'}
          </button>

          {/* Manual Buttons */}
          <div className="flex items-center bg-gray-900/80 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setManualSemitones((prev) => prev - 1)}
              className="px-3 py-1 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              title="-1 Yarım Ton"
            >
              -1
            </button>
            <span className="px-2 text-xs font-mono text-gray-400">
              {manualSemitones > 0 ? `+${manualSemitones}` : manualSemitones}
            </span>
            <button
              onClick={() => setManualSemitones((prev) => prev + 1)}
              className="px-3 py-1 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              title="+1 Yarım Ton"
            >
              +1
            </button>
          </div>
        </div>

      </div>

      {/* Editor / Sheet Display Mode */}
      <div className="glass rounded-3xl p-6 relative border border-white/10 shadow-2xl overflow-hidden" suppressHydrationWarning>
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <span>🎵</span> Şarkı Akorları
            {computedSemitones !== 0 && (
              <span className="text-xs bg-[var(--primary-start)]/30 text-[var(--accent)] px-2 py-0.5 rounded-full border border-[var(--accent)]/30">
                {computedSemitones > 0 ? `+${computedSemitones}` : computedSemitones} Semitone Transposed
              </span>
            )}
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition"
          >
            {isEditing ? 'Önizlemeye Dön' : 'Metni Düzenle'}
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={songText}
            onChange={(e) => setSongText(e.target.value)}
            className="w-full h-80 bg-gray-950/80 text-gray-200 font-mono text-sm p-4 rounded-xl border border-white/10 focus:outline-none focus:border-[var(--accent)]"
            placeholder="Akorları köşeli parantez içinde yazın. Örn: [C]Merhaba [G]dünya"
          />
        ) : (
          <div className="space-y-6 font-mono text-sm leading-relaxed overflow-x-auto py-2">
            {parsedLines.map((line, lineIdx) => {
              // Check if line contains any chords
              const hasChords = line.segments.some((s) => s.type === 'chord');

              if (!hasChords) {
                // Plain text line or empty line
                return (
                  <div key={lineIdx} className="min-h-[1.5rem] text-gray-400">
                    {line.segments.map((s) => s.content).join('')}
                  </div>
                );
              }

              return (
                <div key={lineIdx} className="flex flex-wrap items-baseline gap-y-3 gap-x-1 my-3">
                  {line.segments.map((segment, segIdx) => {
                    if (segment.type === 'chord') {
                      const transposed = transposeChord(segment.content, computedSemitones);
                      return (
                        <span key={segIdx} className="inline-flex flex-col items-start mr-1">
                          <span className="text-xs font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-md border border-[var(--accent)]/30 shadow-sm inline-block transition-all duration-300 transform hover:scale-105">
                            {transposed}
                          </span>
                        </span>
                      );
                    }
                    return (
                      <span key={segIdx} className="text-gray-200 font-sans text-base leading-none tracking-wide">
                        {segment.content}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
