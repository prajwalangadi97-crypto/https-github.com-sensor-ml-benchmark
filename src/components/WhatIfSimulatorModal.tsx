import React, { useState } from 'react';
import { Sliders, X, RefreshCw, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Simulator Sliders State
  const [rpm, setRpm] = useState<number>(2450);
  const [torque, setTorque] = useState<number>(310);
  const [load, setLoad] = useState<number>(45);
  const [temp, setTemp] = useState<number>(68);
  const [s1Acoustic, setS1Acoustic] = useState<number>(18.5);
  const [s2Flux, setS2Flux] = useState<number>(1.42);
  const [s4Optical, setS4Optical] = useState<number>(0.94);

  // Dynamic Bayesian Prediction Inference Calculation
  const predictedRef = Math.round((200 + (rpm / 4000) * 350 + (torque / 500) * 180) * 1000) / 1000;
  
  // Compute uncertainty & fault status
  const isS4Fault = s4Optical < 0.1;
  const isS1Fault = s1Acoustic > 200;
  const isTempFault = temp > 130;
  const isFault = isS4Fault || isS1Fault || isTempFault;

  const uncertaintySigma = isS4Fault ? 28.97 : isS1Fault ? 18.5 : isTempFault ? 12.4 : 2.14;
  const attentionScore = isS4Fault ? 80.73 : isS1Fault ? 76.67 : isTempFault ? 65.4 : 12.5;

  // Preset Configurations
  const applyPreset = (preset: 'nominal' | 's4_disconnect' | 'thermal_runaway' | 'electrical_spike') => {
    if (preset === 'nominal') {
      setRpm(1850);
      setTorque(210);
      setLoad(35);
      setTemp(62);
      setS1Acoustic(18.4);
      setS2Flux(1.24);
      setS4Optical(0.95);
    } else if (preset === 's4_disconnect') {
      setRpm(2450);
      setTorque(310);
      setLoad(58.6);
      setTemp(68.5);
      setS1Acoustic(18.4);
      setS2Flux(1.42);
      setS4Optical(0.00); // Disconnect
    } else if (preset === 'thermal_runaway') {
      setRpm(3200);
      setTorque(450);
      setLoad(65);
      setTemp(148.5); // Thermal exceedance
      setS1Acoustic(28.5);
      setS2Flux(1.82);
      setS4Optical(0.88);
    } else if (preset === 'electrical_spike') {
      setRpm(1850);
      setTorque(210);
      setLoad(35);
      setTemp(68);
      setS1Acoustic(998.42); // Spike
      setS2Flux(1.42);
      setS4Optical(0.94);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Real-Time What-If Scenario Simulator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Preset Buttons Bar */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Stress-Test Configuration Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 font-mono text-xs">
              <button
                onClick={() => applyPreset('nominal')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 font-semibold transition-all text-left"
              >
                1. Nominal Operation
              </button>
              <button
                onClick={() => applyPreset('s4_disconnect')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-rose-400 font-semibold transition-all text-left"
              >
                2. S4 Disconnect (TST-0195)
              </button>
              <button
                onClick={() => applyPreset('thermal_runaway')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 font-semibold transition-all text-left"
              >
                3. Thermal Runaway
              </button>
              <button
                onClick={() => applyPreset('electrical_spike')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 text-sky-400 font-semibold transition-all text-left"
              >
                4. S1 Electrical Spike
              </button>
            </div>
          </div>

          {/* Parameter Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            {/* Speed (RPM) */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Rotational Speed (RPM):</span>
                <span className="text-cyan-400 font-bold">{rpm} RPM</span>
              </div>
              <input
                type="range"
                min={500}
                max={4000}
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Torque (Nm) */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Shaft Torque (Nm):</span>
                <span className="text-cyan-400 font-bold">{torque} Nm</span>
              </div>
              <input
                type="range"
                min={50}
                max={600}
                value={torque}
                onChange={(e) => setTorque(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Stator Temp */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Stator Temperature (°C):</span>
                <span className={temp > 130 ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>{temp}°C</span>
              </div>
              <input
                type="range"
                min={20}
                max={160}
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* S1 Acoustic Vibration */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>S1 Acoustic Vibration (mm/s):</span>
                <span className={s1Acoustic > 200 ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>{s1Acoustic} mm/s</span>
              </div>
              <input
                type="range"
                min={5}
                max={1000}
                value={s1Acoustic}
                onChange={(e) => setS1Acoustic(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* S4 Optical Ratio */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>S4 Optical Coupling Ratio:</span>
                <span className={s4Optical < 0.1 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{s4Optical}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={s4Optical}
                onChange={(e) => setS4Optical(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* S2 Flux Density */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>S2 Electromagnetic Flux (mT):</span>
                <span className="text-amber-400 font-bold">{s2Flux} mT</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.05}
                value={s2Flux}
                onChange={(e) => setS2Flux(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Dynamic Inference Output Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase font-bold">Real-Time ML Inference Output</span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                isFault ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isFault ? 'FAULT STATE ISOLATED' : 'NOMINAL PREDICTION'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] text-slate-400">Predicted Reference Parameter (ŷ)</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{predictedRef} units</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Bayesian Uncertainty Bounds</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">± {uncertaintySigma} σ</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Calculated Attention Score</div>
                <div className="text-2xl font-bold text-rose-400 mt-1">{attentionScore} / 100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-mono text-xs font-semibold"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
