import React from 'react';
import { ThemeMode } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';
import { 
  Zap, 
  Activity, 
  Sliders, 
  FileCheck2, 
  Download, 
  Radio, 
  Cpu, 
  ShieldCheck,
  Network,
  Sparkles,
  Wrench,
  Volume2,
  VolumeX
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenWhatIf: () => void;
  onOpenDossier: () => void;
  onOpenExport: () => void;
  onOpenAiCopilot: () => void;
  onOpenAudioSynth?: () => void;
  isAudioPlaying?: boolean;
  anomaliesCount: number;
  apiOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentTheme,
  onThemeChange,
  onOpenWhatIf,
  onOpenDossier,
  onOpenExport,
  onOpenAiCopilot,
  onOpenAudioSynth,
  isAudioPlaying = false,
  anomaliesCount,
  apiOnline,
}) => {
  const navTabs = [
    { id: 'executive', label: 'Executive Dashboard', icon: Activity },
    { id: 'oscilloscope', label: 'CRT Oscilloscope', icon: Radio },
    { id: 'radar', label: '360° Radar Scanner', icon: Zap },
    { id: 'correlation', label: 'Correlation Heatmap', icon: Network },
    { id: 'explainability', label: 'SHAP Studio (XAI)', icon: Sparkles },
    { id: 'maintenance', label: 'Predictive RUL', icon: Wrench },
    { id: 'models', label: 'ML Benchmark Studio', icon: Cpu },
    { id: 'diagnostics', label: 'Top 3 Diagnostician', icon: ShieldCheck, badge: anomaliesCount > 0 ? anomaliesCount : null },
    { id: 'digital-twin', label: '3D Digital Twin', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white font-mono uppercase">
                  Sensor ML Benchmark
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  ISO/SIL-2 READY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Multi-Sensor Anomaly Audit & 3D Digital Twin Engine
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live API & Telemetry Beacon */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{apiOnline ? 'API: SQLITE WAL (260 RECS)' : 'API: CLIENT FALLBACK'}</span>
            </div>

            {/* Audio Sonification Quick Trigger */}
            {onOpenAudioSynth && (
              <button
                id="btn-audio-synth"
                onClick={onOpenAudioSynth}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all shadow-sm ${
                  isAudioPlaying
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Acoustic Sonification Synthesizer (Listen to Machine Harmonics)"
              >
                {isAudioPlaying ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">Sonifier</span>
              </button>
            )}

            {/* AI Diagnostician Copilot Trigger */}
            <button
              id="btn-ai-copilot"
              onClick={onOpenAiCopilot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all shadow-sm group"
              title="Open AI Telemetry Diagnostician & SIL-2 Copilot"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* What-If Simulator Trigger */}
            <button
              id="btn-what-if"
              onClick={onOpenWhatIf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-medium transition-all shadow-sm"
              title="Open Real-Time What-If Scenario Simulator"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">What-If</span>
            </button>

            {/* Compliance Dossier Trigger */}
            <button
              id="btn-audit-dossier"
              onClick={onOpenDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-medium transition-all shadow-sm"
              title="View & Print ISO/SIL-2 Compliance Audit Dossier"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit Dossier</span>
            </button>

            {/* Export Center Trigger */}
            <button
              id="btn-export-center"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm"
              title="Export Benchmark Predictions & Deliverables JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Theme Selector */}
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/40">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                id={`tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
