/**
 * Music theory layer — framework-independent utilities
 * for note conversion and transposition.
 */
export { frequencyToNote, midiToFrequency, A4_FREQUENCY } from './note-converter';
export type { NoteInfo } from './note-converter';

export {
  calculateSemitoneDistance,
  transposeChord,
  transposeChordSheet,
  transposeNote,
  getPitchClass,
} from './transpose-engine';
