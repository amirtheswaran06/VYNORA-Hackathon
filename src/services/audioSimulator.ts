// Audio synthesizer for DTMF keypad tones, SOS sirens, truck horns, and Text-to-Speech IVR simulator

const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playDTMFTone(key: string, durationMs: number = 220): void {
  try {
    const freqs = DTMF_FREQS[key] || [440, 440];
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.value = freqs[0];
    osc2.frequency.value = freqs[1];

    osc1.type = 'sine';
    osc2.type = 'sine';

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + durationMs / 1000);
    osc2.stop(now + durationMs / 1000);
  } catch (e) {
    console.warn('Audio tone play error:', e);
  }
}

export function playSOSSiren(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // Frequency modulation for police/ambulance siren effect
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(950, now + 0.3);
    osc.frequency.linearRampToValueAtTime(600, now + 0.6);
    osc.frequency.linearRampToValueAtTime(950, now + 0.9);
    osc.frequency.linearRampToValueAtTime(600, now + 1.2);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 1.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.3);
  } catch (e) {
    console.warn('SOS Siren error:', e);
  }
}

export function playTruckHorn(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sawtooth';

    // Indian dual-tone commercial air horn (approx 310Hz + 370Hz)
    osc1.frequency.setValueAtTime(310, now);
    osc2.frequency.setValueAtTime(370, now);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.warn('Truck horn error:', e);
  }
}

export function playBeepNotification(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn('Beep error:', e);
  }
}

export function speakIVRText(text: string, lang: 'en' | 'ta' | 'hi' = 'en'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    playDTMFTone('1', 300);
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (lang === 'ta') {
      const taVoice = voices.find(v => v.lang.startsWith('ta') || v.lang.includes('IN'));
      if (taVoice) utterance.voice = taVoice;
      utterance.lang = 'ta-IN';
    } else if (lang === 'hi') {
      const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('IN'));
      if (hiVoice) utterance.voice = hiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const inVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('IN'));
      if (inVoice) utterance.voice = inVoice;
      utterance.lang = 'en-IN';
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
