import { PitchDetector } from 'pitchy';

export interface PitchResult {
  frequency: number;  // Hz
  clarity: number;    // 0-1 confidence score
}

// Cache detector instances by buffer size to prevent re-allocating memory on every frame
const detectorCache = new Map<number, PitchDetector<Float32Array>>();

function getDetector(bufferLength: number): PitchDetector<Float32Array> {
  let detector = detectorCache.get(bufferLength);
  if (!detector) {
    detector = PitchDetector.forFloat32Array(bufferLength);
    detectorCache.set(bufferLength, detector);
  }
  return detector;
}

/**
 * Detects pitch from a Float32Array audio buffer using Pitchy (McLeod Pitch Method - MPM).
 * Returns null if no clear pitch is detected (below clarity threshold or in silence).
 * 
 * @param buffer - Float32Array containing audio data
 * @param sampleRate - Sample rate (e.g., 44100 or 48000)
 * @param clarityThreshold - Minimum clarity to accept (default 0.8)
 * @returns PitchResult or null
 */
export function detectPitch(
  buffer: Float32Array,
  sampleRate: number,
  clarityThreshold: number = 0.8
): PitchResult | null {
  const SIZE = buffer.length;
  
  if (SIZE === 0) {
    return null;
  }

  // Fast RMS silence / noise filter
  let sumSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    sumSquares += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sumSquares / SIZE);
  
  // Reject quiet background noise / silence (RMS < 0.01)
  if (rms < 0.01) {
    return null;
  }

  const detector = getDetector(SIZE);
  const [frequency, clarity] = detector.findPitch(buffer, sampleRate);

  if (clarity < clarityThreshold) {
    return null;
  }

  // Frequency range sanity check: reject results outside 50Hz-2000Hz (human singing range)
  if (frequency < 50 || frequency > 2000) {
    return null;
  }

  return { frequency, clarity };
}
