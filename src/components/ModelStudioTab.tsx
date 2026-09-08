import React, { useState, useEffect } from 'react';
import { BENCHMARK_MODELS } from '../data/telemetryData';
import { BenchmarkModel } from '../types';
import { fetchBenchmarkModels } from '../services/api';
import { Cpu, Trophy, CheckCircle2, ArrowRight, Activity, GitBranch, Layers, Play } from 'lucide-react';

export const ModelStudioTab: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [models, setModels] = useState<BenchmarkModel[]>(BENCHMARK_MODELS);

  useEffect(() => {
    fetchBenchmarkModels().then((apiModels) => {
      if (apiModels && apiModels.length > 0) {
        setModels(apiModels);
      }
    });
  }, []);

  // Animated circuit propagation step loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const circuitNodes = [
    {
      step: 0,
      title: 'Data Ingestion Bus',
      desc: '25.6 kS/s synchronous telemetry ingestion of 260 test & 904 training cycles.',
      icon: Activity,
      color: 'border-cyan-500 text-cyan-400',
    },
    {
      step: 1,
      title: 'Regime Stratified Imputation',
      desc: 'K-Means clustering operating regime assignment & median imputation.',
      icon: GitBranch,
      color: 'border-sky-500 text-sky-400',
    },
    {
      step: 2,
      title: 'Multivariate Anomaly Sieve',
      desc: 'Isolation Forest & physical boundary check quarantine 5 corrupt records.',
      icon: Layers,
      color: 'border-rose-500 text-rose-400',
    },
    {
      step: 3,
      title: 'Champion L2 Ridge Regressor',
      desc: 'Closed-form (XᵀX + αI)⁻¹Xᵀy model execution (R² = 99.93%).',
      icon: Trophy,
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      step: 4,
      title: 'Dual-Headed Test Inference',
      desc: 'Generates predicted reference parameter ŷ ± 1.96σ & Attention Score Aᵢ.',
      icon: Cpu,
      color: 'border-amber-500 text-amber-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Automated ML Benchmark Arena & Pipeline Circuit
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            5-Fold Cross-Validation benchmark comparing 6 candidate regression architectures without data leakage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            CHAMPION: RIDGE REGRESSION (L2)
          </span>
        </div>
      </div>

      {/* Champion Model Highlight Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">🏆 Verified Champion Model</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">α = 10.0</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Ridge Regression (L2 Regularization)
            </h3>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Closed-form analytical solution: β = (XᵀX + αI)⁻¹Xᵀy. Outstanding out-of-sample generalization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-center shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Out-of-Sample RMSE</div>
            <div className="text-xl font-bold text-emerald-400">1.345 ± 1.309</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Out-of-Sample MAE</div>
            <div className="text-xl font-bold text-cyan-400">0.673 ± 0.303</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">CV R² Score</div>
            <div className="text-xl font-bold text-white">0.9993</div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">
            5-Fold Cross-Validation Model Leaderboard
          </h3>
          <span className="text-xs font-mono text-slate-400">Deterministic Seed: random_state=42</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4">Family</th>
                <th className="py-3 px-4">CV RMSE (Mean ± Std)</th>
                <th className="py-3 px-4">CV MAE (Mean ± Std)</th>
                <th className="py-3 px-4">CV R² Score</th>
                <th className="py-3 px-4">Hyperparameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {models.map((model) => (
                <tr
                  key={model.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    model.status === 'Champion Model' ? 'bg-emerald-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      model.status === 'Champion Model'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : model.status === 'Runner-Up'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {model.status === 'Champion Model' ? '🏆 Champion' : model.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-bold">{model.name}</td>
                  <td className="py-3 px-4 text-slate-400">{model.family}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    {model.cv_rmse_mean.toFixed(3)} ± {model.cv_rmse_std.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-cyan-400">
                    {model.cv_mae_mean.toFixed(3)} ± {model.cv_mae_std.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-white font-bold">
                    {model.cv_r2_mean.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] font-sans truncate max-w-xs">
                    {model.hyperparameters}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Signal Propagation Circuit Animation */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Interactive Pipeline Signal Propagation Circuit</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Sequential telemetry flow from ingestion bus through regime stratification, anomaly sieve, and inference.
            </p>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700"
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isPlaying ? 'PAUSE ANIMATION' : 'PLAY ANIMATION'}</span>
          </button>
        </div>

        {/* Circuit Nodes Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative py-4">
          {circuitNodes.map((node, index) => {
            const Icon = node.icon;
            const isActive = activeStep === index;
            return (
              <div
                key={node.step}
                onClick={() => setActiveStep(index)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105 z-10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">STAGE 0{index + 1}</span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 animate-bounce' : 'text-slate-500'}`} />
                  </div>
                  <h4 className={`text-xs font-bold font-mono ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {node.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans leading-tight">
                    {node.desc}
                  </p>
                </div>

                {isActive && (
                  <div className="mt-3 text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>PROCESSING...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
