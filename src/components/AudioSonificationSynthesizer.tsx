import React, { useState, useEffect, useRef } from 'react';
import { audioSonification } from '../services/audioSonification';
import { Volume2, VolumeX, Radio, Zap, AlertTriangle, Play, Square, Activity } from 'lucide-react';

interface AudioSonificationSynthesizerProps {
  onClose?: () => void;
  inline?: boolean;
}

export const AudioSonificationSynthesizer: React.FC<AudioSonificationSynthesizerProps> = ({
  onClose,
  inline = false,
}) => {
  const [status, setStatus] = useState(audioSonification.getStatus());
  const [rpm, setRpm] = useState(1750);
  const [vibration, setVibration] = useState(2.4);
  const [selectedPreset, setSelectedPreset] = useState<'nominal' | 'tst0077' | 'tst0042' | 'tst0195' | 'tst0112'>('nominal');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = audioSonification.subscribe(() => {
      setStatus(audioSonification.getStatus());
    });
    return () => unsub();
  }, []);

  // Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const analyser = audioSonification.getAnalyser();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 15) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      if (analyser && status.isEnabled) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // Draw waveform
        ctx.lineWidth = 2;
        ctx.strokeStyle = status.currentProfile === 'emi_spike' 
          ? '#ef4444' 
          : status.currentProfile === 'optical_shear' 
            ? '#f59e0b' 
            : '#06b6d4';

        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Flatline idle wave
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [status.isEnabled, status.currentProfile]);

  const handleToggle = async () => {
    await audioSonification.toggle();
  };

  const handlePresetSelect = (preset: 'nominal' | 'tst0077' | 'tst0042' | 'tst0195' | 'tst0112') => {
    setSelectedPreset(preset);
    let targetRpm = 1750;
    let targetVib = 2.4;
    let profile: 'nominal' | 'bearing_fault' | 'emi_spike' | 'optical_shear' = 'nominal';

    if (preset === 'nominal') {
      targetRpm = 1820;
      targetVib = 1.9;
      profile = 'nominal';
    } else if (preset === 'tst0077') {
      targetRpm = 3140;
      targetVib = 42.5;
      profile = 'bearing_fault';
    } else if (preset === 'tst0042') {
      targetRpm = 1680;
      targetVib = 998.42;
      profile = 'emi_spike';
    } else if (preset === 'tst0195') {
      targetRpm = 1420;
      targetVib = 3.1;
      profile = 'optical_shear';
    } else if (preset === 'tst0112') {
      targetRpm = 2890;
      targetVib = 14.8;
      profile = 'bearing_fault';
    }

    setRpm(targetRpm);
    setVibration(targetVib);
    audioSonification.setTelemetry(targetRpm, targetVib, profile);
  };

  const handleRpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRpm(val);
    audioSonification.setTelemetry(val, vibration);
  };

  const handleVibrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVibration(val);
    audioSonification.setTelemetry(rpm, val);
  };

  const fundamentalPitch = Math.round((rpm / 60) * 4);

  return (
    <div className={`bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl ${inline ? '' : 'max-w-xl w-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-mono uppercase text-white tracking-wide">
                Acoustic Sonification Synthesizer
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                status.isEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {status.isEnabled ? 'ON AIR' : 'MUTED'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Audible machine harmonics synthesized from rotational velocity & piezoelectric vibration
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Visualizer Scope */}
      <div className="mt-4 relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 p-2">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
            {status.isEnabled ? `SYNTHESIS: ${fundamentalPitch} Hz` : 'STANDBY (MUTED)'}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10 text-[10px] font-mono text-slate-500">
          WEB AUDIO API • RES-256
        </div>

        <canvas
          ref={canvasRef}
          width={480}
          height={110}
          className="w-full h-28 rounded-lg block"
        />
      </div>

      {/* Main Controls: Play/Mute & Master Volume */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg ${
            status.isEnabled
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-600/20'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-cyan-600/20'
          }`}
        >
          {status.isEnabled ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span>MUTE AUDIO</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>ENABLE SONIFICATION</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          {status.volume === 0 ? (
            <VolumeX className="w-4 h-4 text-slate-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={status.volume}
            onChange={(e) => audioSonification.setVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono text-slate-300 w-10 text-right">
            {Math.round(status.volume * 100)}%
          </span>
        </div>
      </div>

      {/* Diagnostic Acoustic Presets */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Machine Acoustic Signature Presets:
          </label>
          <span className="text-[10px] font-mono text-cyan-400">Click to Audition</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handlePresetSelect('nominal')}
            className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all ${
              selectedPreset === 'nominal'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Nominal Baseline
            </div>
            <div className="text-[10px] text-slate-500 mt-1">1,820 RPM • 1.9 mm/s</div>
          </button>

          <button
            onClick={() => handlePresetSelect('tst0042')}
            className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all ${
              selectedPreset === 'tst0042'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              TST-0042 (EMI Spike)
            </div>
            <div className="text-[10px] text-slate-500 mt-1">998.4 mm/s • Screech</div>
          </button>

          <button
            onClick={() => handlePresetSelect('tst0195')}
            className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all ${
              selectedPreset === 'tst0195'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              TST-0195 (Optical Shear)
            </div>
            <div className="text-[10px] text-slate-500 mt-1">S4=0.00 • Rattling</div>
          </button>

          <button
            onClick={() => handlePresetSelect('tst0077')}
            className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all ${
              selectedPreset === 'tst0077'
                ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              TST-0077 (Triple Overload)
            </div>
            <div className="text-[10px] text-slate-500 mt-1">3,140 RPM • 42.5 mm/s</div>
          </button>

          <button
            onClick={() => handlePresetSelect('tst0112')}
            className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all ${
              selectedPreset === 'tst0112'
                ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md shadow-orange-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              TST-0112 (Thermal Stress)
            </div>
            <div className="text-[10px] text-slate-500 mt-1">118.4°C • Heavy Hum</div>
          </button>
        </div>
      </div>

      {/* Fine-Tuning Sliders */}
      <div className="mt-4 space-y-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-400">Rotor Speed (RPM):</span>
            <span className="text-cyan-400 font-bold">{rpm} RPM ({fundamentalPitch} Hz)</span>
          </div>
          <input
            type="range"
            min="600"
            max="3500"
            step="10"
            value={rpm}
            onChange={handleRpmChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-400">Vibration S1 (mm/s):</span>
            <span className="text-emerald-400 font-bold">{vibration.toFixed(1)} mm/s</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={vibration}
            onChange={handleVibrationChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>
      </div>

      {/* ISO / Diagnostic Insight */}
      <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-start gap-2.5 text-xs text-slate-300">
        <Zap className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="leading-relaxed text-[11px] font-mono">
          <strong className="text-cyan-300">Condition-Based Monitoring (CBM):</strong> High-frequency harmonic sonification enables field technicians to instantly distinguish between mechanical rotor damage (sub-harmonic rumble) vs. piezoelectric transducer EMI glitches (high-pitch transient FM buzz).
        </p>
      </div>
    </div>
  );
};
