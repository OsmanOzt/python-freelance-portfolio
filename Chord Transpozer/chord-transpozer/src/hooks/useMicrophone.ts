'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useAudioStore, PermissionStatus } from '@/store/useAudioStore';
import { detectPitch } from '@/lib/audio/pitch-detector';
import { frequencyToNote } from '@/lib/music-theory/note-converter';
import { PitchBuffer } from '@/lib/audio/pitch-buffer';

export function useMicrophone(): {
  startListening: () => Promise<void>;
  stopListening: () => void;
  isListening: boolean;
  permissionStatus: PermissionStatus;
  errorMessage: string | null;
} {
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const pitchBufferRef = useRef<PitchBuffer>(new PitchBuffer(15, 3));

  const {
    isListening,
    permissionStatus,
    errorMessage,
    setFrequency,
    setNote,
    setStableNote,
    setClarity,
    setListening,
    setPermissionStatus,
    setError,
    reset
  } = useAudioStore();

  const stopListening = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    pitchBufferRef.current.clear();
    setListening(false);
    reset();
  }, [setListening, reset]);

  const startListening = useCallback(async () => {
    // Check for secure context required by AudioWorklet and getUserMedia
    if (window.location.hostname !== 'localhost' && window.location.protocol !== 'https:') {
      setError('Secure context required (HTTPS or localhost).');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionStatus('error');
      setError('Microphone API not supported in this browser.');
      return;
    }

    try {
      setPermissionStatus('requesting');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setPermissionStatus('granted');
      
      // Initialize AudioContext on user interaction
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      // Load AudioWorklet module
      try {
        await audioCtx.audioWorklet.addModule('/worklets/audio-processor.js');
      } catch (err) {
        console.warn('AudioWorklet module failed to load:', err);
        setError('AudioWorklet not found. Ensure /worklets/audio-processor.js exists.');
        setPermissionStatus('error');
        stopListening();
        return;
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioCtx, 'audio-processor');
      workletNodeRef.current = workletNode;

      workletNode.port.onmessage = (event) => {
        const buffer: Float32Array = event.data;
        if (!buffer || buffer.length === 0) return;

        const sampleRate = audioCtx.sampleRate;
        // Detect pitch using Pitchy
        const pitchResult = detectPitch(buffer, sampleRate, 0.75);
        
        if (pitchResult && pitchResult.frequency > 0 && pitchResult.clarity >= 0.75) {
          const noteInfo = frequencyToNote(pitchResult.frequency);
          setFrequency(pitchResult.frequency);
          setClarity(pitchResult.clarity);
          setNote(noteInfo.note, noteInfo.midi, noteInfo.centsOff);

          // Push into PitchBuffer for jitter-free stabilization
          pitchBufferRef.current.push(noteInfo.note, pitchResult.frequency, pitchResult.clarity);
        } else {
          setFrequency(null);
          setClarity(0);
          setNote(null, null, 0);

          // Push silence sample into buffer
          pitchBufferRef.current.push(null, null, 0);
        }

        // Update stable note in store
        const stableResult = pitchBufferRef.current.getStablePitchResult();
        setStableNote(stableResult.note);
      };

      source.connect(workletNode);
      // Connect through a silent gain node to prevent audio feedback
      const silentGain = audioCtx.createGain();
      silentGain.gain.value = 0;
      workletNode.connect(silentGain);
      silentGain.connect(audioCtx.destination); 
      
      setListening(true);
      setError(null);
      
    } catch (err: unknown) {
      setPermissionStatus('denied');
      const message = err instanceof Error ? err.message : 'Microphone access denied.';
      setError(message);
      setListening(false);
    }
  }, [setPermissionStatus, setError, setListening, setFrequency, setNote, setStableNote, setClarity, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    startListening,
    stopListening,
    isListening,
    permissionStatus,
    errorMessage
  };
}
