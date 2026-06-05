import { useGameStore } from '../store/gameStore';

type SoundName = 'click' | 'confirm' | 'error' | 'catch' | 'death' | 'move' | 'open';

interface AudioContextWindow extends Window {
  webkitAudioContext: typeof AudioContext;
}

function beep(freq: number, duration: number, vol = 0.15) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as AudioContextWindow).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* silencioso si no hay soporte */ }
}

const BEEPS: Record<SoundName, () => void> = {
  click:   () => beep(440, 0.05),
  confirm: () => { beep(523, 0.08); setTimeout(() => beep(659, 0.1), 80); },
  error:   () => { beep(200, 0.15); setTimeout(() => beep(150, 0.2), 100); },
  catch:   () => { beep(523, 0.1); setTimeout(() => beep(659, 0.1), 100); setTimeout(() => beep(784, 0.2), 200); },
  death:   () => { beep(300, 0.2); setTimeout(() => beep(200, 0.3), 150); setTimeout(() => beep(100, 0.4), 300); },
  move:    () => beep(392, 0.06),
  open:    () => { beep(392, 0.08); setTimeout(() => beep(523, 0.12), 80); },
};

export function useSound() {
  const soundEnabled = useGameStore(s => s.settings.soundEnabled);

  const play = (name: SoundName) => {
    if (!soundEnabled) return;
    BEEPS[name]?.();
  };

  return { play };
}