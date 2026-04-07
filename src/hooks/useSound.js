import { useCallback } from 'react';

// Centralised audio context so we don't spam the browser
// It is created lazily on first user interaction because browsers block autoplay
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume context if suspended (common browser policy require gesture)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const useSound = () => {
  // A subtle, premium 'tick' for physical switches and buttons
  const playTick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('AudioContext not supported or blocked', e);
    }
  }, []);

  // A rewarding 'chime' when completing a habit
  const playChime = useCallback(() => {
    try {
      const ctx = getAudioContext();
      
      const playNote = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
      };

      // F major root (F5) and third (A5) for a "success" feeling
      playNote(698.46, 0, 0.4);
      playNote(880.00, 0.05, 0.6);
    } catch (e) {
      console.warn('AudioContext not supported or blocked', e);
    }
  }, []);

  return { playTick, playChime };
};
