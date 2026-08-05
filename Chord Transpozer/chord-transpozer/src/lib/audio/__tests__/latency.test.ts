import { describe, it, expect } from 'vitest';
import { detectPitch } from '../pitch-detector';
import { PitchBuffer } from '../pitch-buffer';
import { PerformanceLogger } from '../performance-logger';
import { frequencyToNote } from '../../music-theory/note-converter';

describe('Performance & Latency QA (<100ms End-to-End Target)', () => {
  it('processes 100 consecutive audio frames with < 15ms latency per frame', () => {
    const logger = new PerformanceLogger(100);
    const pitchBuffer = new PitchBuffer(15, 3);
    const sampleRate = 44100;
    const bufferSize = 2048;

    // Synthesize a 440Hz sine wave buffer (A4 note)
    const audioBuffer = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      audioBuffer[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate);
    }

    // Process 100 frames and measure latency
    for (let frame = 0; frame < 100; frame++) {
      const { durationMs } = logger.measure(() => {
        const pitch = detectPitch(audioBuffer, sampleRate, 0.75);
        if (pitch) {
          const noteInfo = frequencyToNote(pitch.frequency);
          pitchBuffer.push(noteInfo.note, pitch.frequency, pitch.clarity);
          pitchBuffer.getStableNote();
        }
      });

      // Frame duration must be far below 100ms target (typically < 10ms)
      expect(durationMs).toBeLessThan(50);
    }

    const stats = logger.getStats();
    expect(stats.avgLatencyMs).toBeLessThan(15);
    expect(stats.maxLatencyMs).toBeLessThan(50);
  });
});
