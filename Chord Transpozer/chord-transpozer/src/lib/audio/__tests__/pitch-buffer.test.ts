import { describe, it, expect, beforeEach } from 'vitest';
import { PitchBuffer } from '../pitch-buffer';

describe('PitchBuffer (Jitter Prevention & Debouncing)', () => {
  let pitchBuffer: PitchBuffer;

  beforeEach(() => {
    pitchBuffer = new PitchBuffer(10, 3);
  });

  it('returns null when buffer is empty', () => {
    const result = pitchBuffer.getStablePitchResult();
    expect(result.note).toBeNull();
  });

  it('correctly identifies a stable note from a noisy sequence', () => {
    // Sequence with majority 'A4' but noisy outliers like 'B4' and silence
    const samples = [
      { note: 'A4', freq: 440, clarity: 0.9 },
      { note: 'B4', freq: 493.88, clarity: 0.3 }, // noise spike
      { note: 'A4', freq: 441, clarity: 0.95 },
      { note: 'A4', freq: 439.5, clarity: 0.92 },
      { note: 'A4', freq: 440.2, clarity: 0.96 },
      { note: 'C5', freq: 523.25, clarity: 0.2 }, // noise spike
      { note: 'A4', freq: 440, clarity: 0.98 },
      { note: 'A4', freq: 440.5, clarity: 0.94 },
    ];

    for (const sample of samples) {
      pitchBuffer.push(sample.note, sample.freq, sample.clarity);
    }

    const stableNote = pitchBuffer.getStableNote();
    expect(stableNote).toBe('A4');
  });

  it('holds last valid key during a brief silence / breathing pause', () => {
    // Establish stable note 'G3'
    pitchBuffer.push('G3', 196.0, 0.95);
    pitchBuffer.push('G3', 196.0, 0.95);
    pitchBuffer.push('G3', 196.0, 0.95);

    expect(pitchBuffer.getStableNote()).toBe('G3');

    // Simulate breathing pause (null samples)
    pitchBuffer.push(null, null, 0);
    pitchBuffer.push(null, null, 0);

    // Should retain 'G3' during the pause
    expect(pitchBuffer.getStableNote()).toBe('G3');
  });

  it('transitions to a new key only when consecutive/weighted majority is reached', () => {
    // Set initial key 'C4'
    pitchBuffer.push('C4', 261.63, 0.9);
    pitchBuffer.push('C4', 261.63, 0.9);
    pitchBuffer.push('C4', 261.63, 0.9);
    expect(pitchBuffer.getStableNote()).toBe('C4');

    // Single outlier 'D4' should not change stable note immediately
    pitchBuffer.push('D4', 293.66, 0.9);
    expect(pitchBuffer.getStableNote()).toBe('C4');

    // 3 consecutive 'D4' notes should update the stable note to 'D4'
    pitchBuffer.push('D4', 293.66, 0.9);
    pitchBuffer.push('D4', 293.66, 0.9);
    expect(pitchBuffer.getStableNote()).toBe('D4');
  });
});
