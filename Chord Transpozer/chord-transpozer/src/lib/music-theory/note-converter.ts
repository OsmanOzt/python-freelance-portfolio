export interface NoteInfo {
  note: string;       // e.g. 'A4', 'C#3'
  midi: number;       // MIDI note number
  frequency: number;  // exact frequency of this note
  centsOff: number;   // how many cents off from perfect pitch (-50 to +50)
}

// Reference frequency for A4 (default 440Hz)
export const A4_FREQUENCY = 440;

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Get the frequency of a given MIDI note number
 * 
 * @param midi - MIDI note number
 * @param a4Freq - Reference A4 frequency (defaults to 440Hz)
 * @returns The frequency of the note in Hz
 */
export function midiToFrequency(midi: number, a4Freq: number = A4_FREQUENCY): number {
  return a4Freq * Math.pow(2, (midi - 69) / 12);
}

/**
 * Convert a frequency in Hz to the nearest musical note
 * 
 * @param frequency - The frequency to convert in Hz
 * @param a4Freq - Reference A4 frequency (defaults to 440Hz)
 * @returns NoteInfo containing note name, midi, exact freq, and cents off
 */
export function frequencyToNote(frequency: number, a4Freq: number = A4_FREQUENCY): NoteInfo {
  // midi = 69 + 12 * log2(freq / a4)
  const floatMidi = 69 + 12 * Math.log2(frequency / a4Freq);
  const midi = Math.round(floatMidi);
  
  const exactFreq = midiToFrequency(midi, a4Freq);
  
  // Calculate how many cents off the frequency is from the perfect pitch
  const centsOff = Math.round(1200 * Math.log2(frequency / exactFreq));
  
  // NOTE_NAMES array maps exactly to midi % 12 when C0 is midi note 12 (standard MIDI tuning)
  // Midi 0 is C-1
  const noteIndex = (midi % 12 + 12) % 12; // Ensure positive modulo
  const octave = Math.floor(midi / 12) - 1;
  const noteName = `${NOTE_NAMES[noteIndex]}${octave}`;

  return {
    note: noteName,
    midi,
    frequency: exactFreq,
    centsOff
  };
}
