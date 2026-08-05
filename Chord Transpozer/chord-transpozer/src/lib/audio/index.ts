/**
 * Audio processing layer — framework-independent utilities
 * for pitch detection and audio analysis.
 */
export { detectPitch } from './pitch-detector';
export type { PitchResult } from './pitch-detector';
export { PitchBuffer } from './pitch-buffer';
export type { StablePitchResult, Sample } from './pitch-buffer';
