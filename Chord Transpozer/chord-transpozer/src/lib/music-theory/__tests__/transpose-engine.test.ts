import { describe, it, expect } from 'vitest';
import {
  calculateSemitoneDistance,
  transposeNote,
  transposeChord,
  transposeChordSheet,
} from '../transpose-engine';

describe('Transpose Engine', () => {
  describe('calculateSemitoneDistance', () => {
    it('calculates distance between C and D as +2 semitones', () => {
      expect(calculateSemitoneDistance('C', 'D')).toBe(2);
    });

    it('calculates distance between C and A3 as -3 semitones (or +9 normalized to -3)', () => {
      const distance = calculateSemitoneDistance('C', 'A');
      expect(distance).toBe(-3);
    });

    it('returns 0 when notes are identical', () => {
      expect(calculateSemitoneDistance('Em', 'E')).toBe(0);
    });
  });

  describe('transposeNote', () => {
    it('transposes C up by 2 semitones to D', () => {
      expect(transposeNote('C', 2)).toBe('D');
    });

    it('transposes A down by 2 semitones to G', () => {
      expect(transposeNote('A', -2)).toBe('G');
    });
  });

  describe('transposeChord', () => {
    it('transposes basic major and minor chords', () => {
      expect(transposeChord('C', 2)).toBe('D');
      expect(transposeChord('Am', 2)).toBe('Bm');
      expect(transposeChord('G7', -2)).toBe('F7');
    });

    it('transposes complex chords (maj7, sus4, dim)', () => {
      expect(transposeChord('Cmaj7', 3)).toBe('Ebmaj7');
      expect(transposeChord('Fsus4', 2)).toBe('Gsus4');
    });

    it('transposes slash chords accurately', () => {
      expect(transposeChord('C/G', 2)).toBe('D/A');
      expect(transposeChord('Am7/F#', 2)).toBe('Bm7/G#');
    });
  });

  describe('transposeChordSheet', () => {
    it('transposes bracketed chords in song lyrics sheet', () => {
      const input = '[C]Merhaba [G]dünya [Am]bu bir [F]test';
      const output = transposeChordSheet(input, 2);
      expect(output).toBe('[D]Merhaba [A]dünya [Bm]bu bir [G]test');
    });

    it('handles negative transposition in sheets', () => {
      const input = '[D]Sen [A]ben [Bm]biz';
      const output = transposeChordSheet(input, -2);
      expect(output).toBe('[C]Sen [G]ben [Am]biz');
    });
  });
});
