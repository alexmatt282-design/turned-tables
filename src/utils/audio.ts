// Web Audio API Sound Synthesizer for safe, dependency-free cartoonish sound effects
// and text-to-speech voice controls.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechEnabled: boolean = false;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  toggleSpeech(enabled: boolean) {
    this.speechEnabled = enabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  isSpeechEnabled() {
    return this.speechEnabled;
  }

  // Cute bubble pop sound effect
  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Fast upward sweeping bubble sound
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  // Play a light, wet bubbling sound that sounds like standard cartoon soup
  playBubble() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const count = 3 + Math.floor(Math.random() * 3); // 3 to 5 small bubbles

      for (let i = 0; i < count; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Stagger each bubble slightly
        const startTime = now + i * (0.15 + Math.random() * 0.15);
        const duration = 0.08 + Math.random() * 0.06;

        osc.type = 'sine';
        // Base frequency for delicious thick bubbles
        const startFreq = 200 + Math.random() * 150;
        const endFreq = 400 + Math.random() * 300;

        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.06 + Math.random() * 0.04, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      }
    } catch (e) {
      console.warn('Audio playBubble error:', e);
    }
  }

  // Play a bouncy success sound
  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Synthesize three-note ascending chord (arpeggio)
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.08;
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {
      console.warn('Audio playSuccess error:', e);
    }
  }

  // Play a cute cartoony boing/slide sound for incorrect attempts
  playBoing() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // Vibrating downwards cartoon pitch
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      // Low pass filter to make it sound circular/muffled (boingy!)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio playBoing error:', e);
    }
  }

  // Play a grand cheer noise when a level or letter tracing is fully completed
  playGrandCheer() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const rootFreqs = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5

      rootFreqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        // Warm triangle wave for melody, sine for bass
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        // Add subtle pitch bending for cheerful cartoony feel
        osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.6);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 0.85);
      });
    } catch (e) {
      console.warn('Audio playGrandCheer error:', e);
    }
  }

  // Play a cute slide sound when tracing a section
  playTraceCheck() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(660, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio playTraceCheck error:', e);
    }
  }

  // Web Speech API wrapper to talk to kids - disabled per request
  speak(text: string) {
    // No-op: speech voiceover has been completely disabled.
  }

  playClick() {
    this.playPop();
  }

  playNoUnlock() {
    this.playBoing();
  }

  playPowerUp() {
    this.playGrandCheer();
  }
}

export const audio = new SoundEngine();
export default audio;
