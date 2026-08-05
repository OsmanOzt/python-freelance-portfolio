import { Note, Interval, Chord } from 'tonal';

/**
 * Normalizes a note or chord into a pure pitch class (e.g. 'A4' -> 'A', 'Em' -> 'E', 'C#/G' -> 'C#')
 */
export function getPitchClass(noteOrChord: string): string {
  if (!noteOrChord) return '';
  // Remove slash chord bass note if present
  const main = noteOrChord.split('/')[0].trim();
  // Extract root note (A-G with optional # or b)
  const match = main.match(/^([A-G][#b]?)/i);
  if (match) {
    const pc = Note.pitchClass(match[1]);
    return pc || match[1].toUpperCase();
  }
  const pc = Note.pitchClass(main);
  return pc || main;
}

/**
 * Calculates the shortest semitone distance (-6 to +6) between two keys/notes.
 * E.g., 'C' to 'G' -> +7 or -5 (returns 7 or -5 depending on direction, normalized for minimal transposition).
 *
 * @param fromKey - The original song key (e.g. 'C')
 * @param toKey - The detected user key (e.g. 'G' or 'A4')
 * @returns number of semitones (-11 to +11)
 */
export function calculateSemitoneDistance(fromKey: string, toKey: string): number {
  const fromPc = getPitchClass(fromKey);
  const toPc = getPitchClass(toKey);

  if (!fromPc || !toPc) return 0;

  // Use Tonal's Interval.distance
  const intervalName = Interval.distance(fromPc, toPc);
  const semitones = Interval.semitones(intervalName);

  if (semitones === undefined || semitones === null) {
    return 0;
  }

  // Normalize semitones to range -6 to +5 for minimal key shift
  let normalized = semitones % 12;
  if (normalized > 6) normalized -= 12;
  if (normalized <= -6) normalized += 12;

  return normalized;
}

/**
 * Transposes a single note name by a number of semitones.
 * E.g. transposeNote('C', 2) -> 'D'
 */
export function transposeNote(noteName: string, semitones: number): string {
  if (!noteName || semitones === 0) return noteName;

  const interval = Interval.fromSemitones(semitones);
  const transposed = Note.transpose(noteName, interval);

  // Simplify enharmonics if needed (e.g., E# -> F, B# -> C, Cbb -> Bb)
  return Note.simplify(transposed) || transposed;
}

/**
 * Transposes a chord symbol (including slash chords like C/G, Am7/F#).
 * 
 * @param chordSymbol - E.g. 'Am7', 'C/G', 'F#m7b5', 'Dsus4'
 * @param semitones - Number of semitones to transpose
 * @returns Transposed chord symbol
 */
export function transposeChord(chordSymbol: string, semitones: number): string {
  if (!chordSymbol || semitones === 0) return chordSymbol;

  // Handle slash chords like C/G or Am7/F#
  if (chordSymbol.includes('/')) {
    const parts = chordSymbol.split('/');
    const mainChord = transposeChord(parts[0], semitones);
    const bassNote = transposeNote(parts[1], semitones);
    return `${mainChord}/${bassNote}`;
  }

  // Parse chord using Tonal Chord
  const parsed = Chord.get(chordSymbol);
  if (!parsed || parsed.empty) {
    // Fallback: regex match root note at start
    const match = chordSymbol.match(/^([A-G][#b]?)(.*)$/);
    if (match) {
      const root = match[1];
      const quality = match[2];
      const transposedRoot = transposeNote(root, semitones);
      return `${transposedRoot}${quality}`;
    }
    return chordSymbol;
  }

  // Transpose the root note
  const transposedRoot = transposeNote(parsed.tonic || '', semitones);
  
  // Reconstruct chord: transposed root + chord type/quality
  // Tonal chord types use aliases like 'm7', 'maj7', 'dim', 'aug'
  const quality = chordSymbol.substring((parsed.tonic || '').length);
  return `${transposedRoot}${quality}`;
}

/**
 * Transposes a full text containing bracketed chords (e.g. "[C]Merhaba [G]dünya").
 * Chords enclosed in square brackets `[Chord]` will be transposed.
 * 
 * @param text - Text with bracketed chords
 * @param semitones - Number of semitones to shift
 */
export function transposeChordSheet(text: string, semitones: number): string {
  if (!text || semitones === 0) return text;

  // Regex matches chords inside square brackets: [C], [Am7], [F#/G#]
  return text.replace(/\[([A-G][#b]?[^\]]*)\]/g, (match, chord) => {
    const transposed = transposeChord(chord.trim(), semitones);
    return `[${transposed}]`;
  });
}
