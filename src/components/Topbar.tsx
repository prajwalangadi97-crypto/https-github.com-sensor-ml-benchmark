import React from 'react';
import { Menu, Cpu, Sliders, Download, Activity, Zap, Radio, Network, Sparkles, Wrench, ShieldCheck, Layers, FileCheck2 } from 'lucide-react';

interface TopbarProps {
  activeTab: string;
  onOpenMobileMenu: () => void;
  onOpenAiCopilot: () => void;
  onOpenWhatIf: () => void;
  onOpenDossier: () => void;
  onOpenExport: () => void;
}

const tabMeta: Record<string, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
  executive: { title: 'Executive Summary & Quality Dashboard', subtitle: 'Automated 260-record dataset profiling, anomaly metrics & regime segmentation', icon: Activity },
  oscilloscope: { title: 'Multi-Channel CRT Oscilloscope', subtitle: '60 FPS real-time P31 phosphor persistence with S1 vibration vs S4 optical wave stream', icon: Radio },
  radar: { title: '360° Polar Sonar Anomaly Radar', subtitle: 'Conical sonar sweep tracking multivariate anomaly distance & target blips', icon: Zap },
  correlation: { title: 'Multi-Sensor Correlation Heatmap', subtitle: '8×8 Pearson cross-covariance matrix with cohort-stratified kinematic decoupling', icon: Network },
  explainability: { title: 'Model Explainability & SHAP Studio', subtitle: 'TreeSHAP global importance weights and local additive waterfall attribution decomposition', icon: Sparkles },
  maintenance: { title: 'Predictive Maintenance & RUL Estimator', subtitle: 'Weibull degradation hazard modeling, machine health scoring & ISO triage ladder', icon: Wrench },
  models: { title: 'Automated ML Benchmark Studio', subtitle: '5-Fold cross-validation regression leaderboard across 6 algorithmic families', icon: Cpu },
  diagnostics: { title: 'Top 3 Critical Attention Diagnostician', subtitle: 'Detailed root-cause physical transducer diagnostic dossiers for the 5 isolated anomalies', icon: ShieldCheck },
  'digital-twin': { title: 'Interactive 3D Spatial Digital Twin Rig', subtitle: 'Synchronous 3D driveshaft rotation, electromagnetic stator glow & flux dynamics', icon: Layers },
};

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenAiCopilot,
  onOpenWhatIf,
  onOpenDossier,
  onOpenExport,
}) => {
  const current = tabMeta[activeTab] || tabMeta.executive;
  const Icon = current.icon;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Active Module Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 lg:hidden"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-cyan-400 shadow-inner">
            <Icon className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider hidden sm:inline">
                PowerMext AI /
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white font-mono tracking-tight">
                {current.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden md:block max-w-xl truncate">
              {current.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAiCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 hover:from-cyan-500/25 hover:to-indigo-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all shadow-sm group"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        <button
          onClick={onOpenWhatIf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-all"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">What-If</span>
        </button>

        <button
          onClick={onOpenDossier}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all"
        >
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Audit Dossier</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-all"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
};
