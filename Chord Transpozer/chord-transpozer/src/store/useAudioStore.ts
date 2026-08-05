import { create } from 'zustand';

export type PermissionStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

interface AudioState {
  // Raw detection values
  currentFrequency: number | null;
  currentNote: string | null;
  currentMidi: number | null;
  centsOff: number;
  clarity: number;
  
  // Filtered & Stabilized values (Jitter-free)
  stableNote: string | null;

  // Transposition & Key settings
  originalKey: string;
  manualSemitones: number;
  autoTranspose: boolean;

  // Microphone state
  isListening: boolean;
  permissionStatus: PermissionStatus;
  errorMessage: string | null;
  
  // Actions
  setFrequency: (freq: number | null) => void;
  setNote: (note: string | null, midi: number | null, centsOff: number) => void;
  setStableNote: (note: string | null) => void;
  setClarity: (clarity: number) => void;
  setListening: (listening: boolean) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
  setError: (message: string | null) => void;
  setOriginalKey: (key: string) => void;
  setManualSemitones: (semitones: number | ((prev: number) => number)) => void;
  setAutoTranspose: (auto: boolean) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentFrequency: null,
  currentNote: null,
  currentMidi: null,
  centsOff: 0,
  clarity: 0,
  stableNote: null,

  originalKey: 'Am',
  manualSemitones: 0,
  autoTranspose: true,

  isListening: false,
  permissionStatus: 'idle',
  errorMessage: null,

  setFrequency: (freq) => set({ currentFrequency: freq }),
  setNote: (note, midi, centsOff) => set({ currentNote: note, currentMidi: midi, centsOff }),
  setStableNote: (note) => set({ stableNote: note }),
  setClarity: (clarity) => set({ clarity }),
  setListening: (listening) => set({ isListening: listening }),
  setPermissionStatus: (status) => set({ permissionStatus: status }),
  setError: (message) => set({ errorMessage: message }),
  setOriginalKey: (key) => set({ originalKey: key }),
  setManualSemitones: (updater) =>
    set((state) => ({
      manualSemitones: typeof updater === 'function' ? updater(state.manualSemitones) : updater,
    })),
  setAutoTranspose: (auto) => set({ autoTranspose: auto }),

  reset: () => set({
    currentFrequency: null,
    currentNote: null,
    currentMidi: null,
    centsOff: 0,
    clarity: 0,
    stableNote: null,
    isListening: false,
    errorMessage: null,
  }),
}));
