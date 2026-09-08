// Audio Sonification Synthesizer Service for Machine Telemetry
// Converts rotational speed, harmonic vibration, and transducer anomalies into acoustic soundscapes.

class AudioSonificationService {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private masterGain: GainNode | null = null;
  private oscBase: OscillatorNode | null = null;
  private oscHarmonic: OscillatorNode | null = null;
  private oscSub: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private distortionNode: WaveShaperNode | null = null;
  private analyser: AnalyserNode | null = null;
  private volume: number = 0.35;
  private listeners: Set<() => void> = new Set();

  private currentRpm: number = 1750;
  private currentVibration: number = 1.8;
  private currentProfile: 'nominal' | 'bearing_fault' | 'emi_spike' | 'optical_shear' = 'nominal';

  constructor() {
    // Lazy initialized on first user interaction
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getStatus() {
    return {
      isEnabled: this.isEnabled,
      volume: this.volume,
      currentRpm: this.currentRpm,
      currentVibration: this.currentVibration,
      currentProfile: this.currentProfile,
    };
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public async toggle(): Promise<boolean> {
    if (this.isEnabled) {
      this.stop();
      return false;
    } else {
      return await this.start();
    }
  }

  public async start(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.initGraph();
      this.isEnabled = true;
      this.updateAcoustics();
      this.notify();
      return true;
    } catch (err) {
      console.warn('Web Audio Sonification initiation failed:', err);
      this.isEnabled = false;
      this.notify();
      return false;
    }
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
    setTimeout(() => {
      this.cleanupOscillators();
      this.isEnabled = false;
      this.notify();
    }, 60);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public setTelemetry(rpm: number, s1Acoustic: number, profile?: 'nominal' | 'bearing_fault' | 'emi_spike' | 'optical_shear') {
    this.currentRpm = rpm;
    this.currentVibration = s1Acoustic;
    if (profile) this.currentProfile = profile;
    this.updateAcoustics();
    this.notify();
  }

  public setProfile(profile: 'nominal' | 'bearing_fault' | 'emi_spike' | 'optical_shear') {
    this.currentProfile = profile;
    this.updateAcoustics();
    this.notify();
  }

  private initGraph() {
    if (!this.ctx) return;
    this.cleanupOscillators();

    const now = this.ctx.currentTime;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(this.volume, now + 0.1);

    // Analyser for visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    // Resonant low-pass filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(800, now);
    this.filterNode.Q.setValueAtTime(2.5, now);

    // Base Rotor Fundamental Oscillator (Sine / Triangle)
    this.oscBase = this.ctx.createOscillator();
    this.oscBase.type = 'sawtooth';

    // Rotor Sub-harmonic Oscillator
    this.oscSub = this.ctx.createOscillator();
    this.oscSub.type = 'sine';

    // High Harmonic Vibration Oscillator
    this.oscHarmonic = this.ctx.createOscillator();
    this.oscHarmonic.type = 'triangle';

    // Connect nodes: Oscs -> Filter -> MasterGain -> Analyser -> Destination
    this.oscBase.connect(this.filterNode);
    this.oscSub.connect(this.filterNode);
    this.oscHarmonic.connect(this.filterNode);

    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.oscBase.start();
    this.oscSub.start();
    this.oscHarmonic.start();
  }

  private cleanupOscillators() {
    try {
      this.oscBase?.stop();
      this.oscSub?.stop();
      this.oscHarmonic?.stop();
      this.oscBase?.disconnect();
      this.oscSub?.disconnect();
      this.oscHarmonic?.disconnect();
      this.filterNode?.disconnect();
      this.masterGain?.disconnect();
    } catch {
      // Ignore cleanup error if already disconnected
    }
    this.oscBase = null;
    this.oscSub = null;
    this.oscHarmonic = null;
    this.filterNode = null;
    this.masterGain = null;
  }

  private updateAcoustics() {
    if (!this.ctx || !this.isEnabled || !this.oscBase || !this.filterNode) return;
    const now = this.ctx.currentTime;

    // Base rotational pitch: RPM / 60 = Hz. Pole pitch factor = 4x
    // e.g. 1800 RPM = 30 Hz fundamental -> 120 Hz motor whine
    const fundamental = Math.max(30, Math.min(600, (this.currentRpm / 60) * 4));
    this.oscBase.frequency.setTargetAtTime(fundamental, now, 0.05);

    // Sub-harmonic: 0.5x fundamental (deep structural hum)
    if (this.oscSub) {
      this.oscSub.frequency.setTargetAtTime(fundamental * 0.5, now, 0.05);
    }

    // High harmonic vibration overtone: modulated by S1 acoustic sensor
    // In TST-0042, S1 = 998.42 mm/s -> intense high-frequency piercing tone
    if (this.oscHarmonic) {
      const harmonicFreq = Math.min(4500, fundamental * 3 + Math.min(this.currentVibration, 1000) * 2.8);
      this.oscHarmonic.frequency.setTargetAtTime(harmonicFreq, now, 0.05);
    }

    // Filter cut-off & resonance based on profile and vibration
    if (this.currentProfile === 'emi_spike' || this.currentVibration > 100) {
      // Harsh resonant screech for EMI transient
      this.filterNode.frequency.setTargetAtTime(3200, now, 0.05);
      this.filterNode.Q.setTargetAtTime(8.0, now, 0.05);
    } else if (this.currentProfile === 'optical_shear') {
      // Unstable rattling chatter
      this.filterNode.frequency.setTargetAtTime(650, now, 0.05);
      this.filterNode.Q.setTargetAtTime(4.0, now, 0.05);
    } else if (this.currentProfile === 'bearing_fault') {
      // Grinding texture
      this.filterNode.frequency.setTargetAtTime(1400, now, 0.05);
      this.filterNode.Q.setTargetAtTime(5.5, now, 0.05);
    } else {
      // Smooth nominal electric motor hum
      const nominalCutoff = 450 + (this.currentRpm / 3000) * 400;
      this.filterNode.frequency.setTargetAtTime(nominalCutoff, now, 0.05);
      this.filterNode.Q.setTargetAtTime(1.8, now, 0.05);
    }
  }
}

export const audioSonification = new AudioSonificationService();
