/**
 * Utility to measure end-to-end latency of audio frame processing.
 * Ensures the target of <100ms end-to-end latency is continuously monitored.
 */
export interface LatencyStats {
  lastFrameLatencyMs: number;
  avgLatencyMs: number;
  maxLatencyMs: number;
  frameCount: number;
}

export class PerformanceLogger {
  private frameTimes: number[] = [];
  private maxFrameCount: number;
  private maxLatencyMs: number = 0;

  constructor(maxFrameCount: number = 60) {
    this.maxFrameCount = maxFrameCount;
  }

  /**
   * Measure execution duration of a function
   */
  measure<T>(fn: () => T): { result: T; durationMs: number } {
    const start = performance.now();
    const result = fn();
    const durationMs = performance.now() - start;

    this.record(durationMs);
    return { result, durationMs };
  }

  /**
   * Record frame processing time
   */
  record(durationMs: number): void {
    this.frameTimes.push(durationMs);
    if (this.frameTimes.length > this.maxFrameCount) {
      this.frameTimes.shift();
    }
    if (durationMs > this.maxLatencyMs) {
      this.maxLatencyMs = durationMs;
    }
  }

  /**
   * Get current latency statistics
   */
  getStats(): LatencyStats {
    if (this.frameTimes.length === 0) {
      return { lastFrameLatencyMs: 0, avgLatencyMs: 0, maxLatencyMs: 0, frameCount: 0 };
    }

    const lastFrameLatencyMs = this.frameTimes[this.frameTimes.length - 1];
    const sum = this.frameTimes.reduce((acc, t) => acc + t, 0);
    const avgLatencyMs = sum / this.frameTimes.length;

    return {
      lastFrameLatencyMs: Math.round(lastFrameLatencyMs * 100) / 100,
      avgLatencyMs: Math.round(avgLatencyMs * 100) / 100,
      maxLatencyMs: Math.round(this.maxLatencyMs * 100) / 100,
      frameCount: this.frameTimes.length,
    };
  }

  /**
   * Reset stats
   */
  reset(): void {
    this.frameTimes = [];
    this.maxLatencyMs = 0;
  }
}
