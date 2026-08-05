export interface Sample {
  note: string | null;
  frequency: number | null;
  clarity: number;
  timestamp: number;
}

export interface StablePitchResult {
  note: string | null;
  frequency: number | null;
  confidence: number;
}

/**
 * PitchBuffer filters jitter, noise spikes, and brief pauses.
 * Uses a weighted circular buffer where recent, high-clarity notes carry more weight.
 */
export class PitchBuffer {
  private buffer: Sample[];
  private index: number = 0;
  private size: number;
  private minConsecutiveMatches: number;
  private lastStableNote: string | null = null;
  private lastStableFreq: number | null = null;

  /**
   * @param size - Circular buffer capacity (default 15 samples, approx 0.5-1s of audio frames)
   * @param minConsecutiveMatches - Required consecutive identical note detections before updating stable note
   */
  constructor(size: number = 15, minConsecutiveMatches: number = 3) {
    this.size = size;
    this.minConsecutiveMatches = minConsecutiveMatches;
    this.buffer = new Array(this.size);
  }

  /**
   * Pushes a new note sample into the circular buffer
   */
  push(note: string | null, frequency: number | null = null, clarity: number = 1.0): void {
    this.buffer[this.index] = {
      note,
      frequency,
      clarity,
      timestamp: Date.now(),
    };
    this.index = (this.index + 1) % this.size;
  }

  /**
   * Calculates the current stable note using weighted frequency distribution.
   * Recent samples and higher clarity values weigh more.
   * If user takes a breath (silence), retains the last stable note instead of resetting immediately.
   */
  getStableNote(): string | null {
    const result = this.getStablePitchResult();
    return result.note;
  }

  /**
   * Full stable pitch result including frequency and confidence
   */
  getStablePitchResult(): StablePitchResult {
    const validSamples: { sample: Sample; weight: number }[] = [];

    // Collect defined samples and calculate recency + clarity weights
    for (let i = 0; i < this.size; i++) {
      const sample = this.buffer[i];
      if (sample) {
        // Linear recency weight: newest sample gets highest index distance weight
        const ageIndex = (this.index - 1 - i + this.size) % this.size;
        const recencyWeight = (this.size - ageIndex) / this.size;
        const weight = recencyWeight * (sample.clarity || 0.5);

        validSamples.push({ sample, weight });
      }
    }

    if (validSamples.length === 0) {
      return { note: null, frequency: null, confidence: 0 };
    }

    // Check consecutive match rule at the end of buffer (most recent)
    let consecutiveCount = 0;
    let recentCandidateNote: string | null = null;
    for (let step = 0; step < this.size; step++) {
      const idx = (this.index - 1 - step + this.size) % this.size;
      const s = this.buffer[idx];
      if (!s) break;
      if (s.note === null) continue; // skip silent frames in consecutive check

      if (recentCandidateNote === null) {
        recentCandidateNote = s.note;
        consecutiveCount = 1;
      } else if (s.note === recentCandidateNote) {
        consecutiveCount++;
      } else {
        break; // note changed
      }
    }

    // Weighted tally per pitch note
    const weightsMap = new Map<string, { totalWeight: number; sumFreq: number; count: number }>();
    let totalWeightSum = 0;

    for (const { sample, weight } of validSamples) {
      if (sample.note !== null && sample.frequency !== null) {
        totalWeightSum += weight;
        const existing = weightsMap.get(sample.note) || { totalWeight: 0, sumFreq: 0, count: 0 };
        weightsMap.set(sample.note, {
          totalWeight: existing.totalWeight + weight,
          sumFreq: existing.sumFreq + sample.frequency,
          count: existing.count + 1,
        });
      }
    }

    // If completely silent (all notes null)
    if (weightsMap.size === 0 || totalWeightSum === 0) {
      // Hold last stable note during brief breathing pauses
      return {
        note: this.lastStableNote,
        frequency: this.lastStableFreq,
        confidence: 0,
      };
    }

    // Find note with highest total weight
    let bestNote: string | null = null;
    let maxWeight = 0;
    let bestFreqSum = 0;
    let bestCount = 0;

    for (const [note, data] of weightsMap.entries()) {
      if (data.totalWeight > maxWeight) {
        maxWeight = data.totalWeight;
        bestNote = note;
        bestFreqSum = data.sumFreq;
        bestCount = data.count;
      }
    }

    const confidence = maxWeight / totalWeightSum;

    // Apply debounce / consecutive rule
    if (
      bestNote &&
      (consecutiveCount >= this.minConsecutiveMatches || confidence > 0.55)
    ) {
      this.lastStableNote = bestNote;
      this.lastStableFreq = bestFreqSum / bestCount;
    }

    return {
      note: this.lastStableNote,
      frequency: this.lastStableFreq,
      confidence: Math.round(confidence * 100) / 100,
    };
  }

  /**
   * Resets the buffer and internal state
   */
  clear(): void {
    this.buffer = new Array(this.size);
    this.index = 0;
    this.lastStableNote = null;
    this.lastStableFreq = null;
  }
}
