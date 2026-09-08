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
  VolumeX,
  Layers,
  ChevronRight,
  Sparkle
} from 'lucide-react';

interface SidebarProps {
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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
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
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navTabs = [
    { id: 'executive', label: 'Executive Dashboard', icon: Activity, category: 'Analytics' },
    { id: 'oscilloscope', label: 'CRT Oscilloscope', icon: Radio, category: 'Telemetry' },
    { id: 'radar', label: '360° Radar Scanner', icon: Zap, category: 'Telemetry' },
    { id: 'correlation', label: 'Correlation Heatmap', icon: Network, category: 'Analytics' },
    { id: 'explainability', label: 'SHAP Studio (XAI)', icon: Sparkles, category: 'Intelligence' },
    { id: 'maintenance', label: 'Predictive RUL', icon: Wrench, category: 'Intelligence' },
    { id: 'models', label: 'ML Benchmark Studio', icon: Cpu, category: 'Intelligence' },
    { id: 'diagnostics', label: 'Top 3 Diagnostician', icon: ShieldCheck, badge: anomaliesCount > 0 ? `${anomaliesCount}` : null, category: 'Diagnostics' },
    { id: 'digital-twin', label: '3D Digital Twin', icon: Layers, category: 'Simulation' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpenMobile ? 'translate-x-0 shadow-2xl shadow-cyan-500/10' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* 1. Header Branding Area */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
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
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black tracking-tight text-white font-mono uppercase">
                  PowerMext AI
                </h1>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  ISO/SIL-2 READY
                </span>
                <span className="text-[9px] font-mono text-slate-400">BENCHMARK</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Live Telemetry Status Pill */}
        <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800/60 flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-semibold">{apiOnline ? 'SQLITE WAL (260)' : 'OFFLINE CLIENT'}</span>
          </div>
          <span className="text-slate-500 text-[10px]">SIL-2 PASS</span>
        </div>

        {/* 3. Navigation Links (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Analytics & Simulation Modules
          </div>

          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                id={`sidebar-tab-${tab.id}`}
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-cyan-200 border-l-4 border-cyan-400 font-bold shadow-lg shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{tab.label}</span>
                </div>

                {tab.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                    {tab.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                ) : null}
              </button>
            );
          })}

          {/* Tools & Utilities Section */}
          <div className="pt-5 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Audit & Diagnostic Tools
          </div>

          <div className="space-y-1">
            {/* AI Copilot */}
            <button
              onClick={() => {
                onOpenAiCopilot();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:rotate-12 transition-transform">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="font-bold">AI Copilot</span>
              </div>
              <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400/30 font-semibold">
                ASSIST
              </span>
            </button>

            {/* Audio Sonifier */}
            {onOpenAudioSynth && (
              <button
                onClick={() => {
                  onOpenAudioSynth();
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  isAudioPlaying
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${isAudioPlaying ? 'bg-emerald-500/30 text-emerald-400' : 'bg-slate-900 text-slate-400'}`}>
                    {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <span>Audio Sonifier</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isAudioPlaying ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isAudioPlaying ? 'ACTIVE' : 'OFF'}
                </span>
              </button>
            )}

            {/* What-If Simulator */}
            <button
              onClick={() => {
                onOpenWhatIf();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-all"
            >
              <div className="p-1.5 rounded-lg bg-slate-900 text-slate-400">
                <Sliders className="w-4 h-4" />
              </div>
              <span>What-If Simulator</span>
            </button>

            {/* Audit Dossier */}
            <button
              onClick={() => {
                onOpenDossier();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-all"
            >
              <div className="p-1.5 rounded-lg bg-slate-900 text-slate-400">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span>Audit Dossier</span>
            </button>

            {/* Export Center */}
            <button
              onClick={() => {
                onOpenExport();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-all"
            >
              <div className="p-1.5 rounded-lg bg-slate-900 text-slate-400">
                <Download className="w-4 h-4 text-cyan-400" />
              </div>
              <span>Export Center</span>
            </button>
          </div>
        </div>

        {/* 4. Footer & Theme Controls */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">UI Palette</span>
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
          </div>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>TEAM DATAFORGE</span>
            <span className="text-emerald-400 font-bold">IEC 61508 SIL-2</span>
          </div>
        </div>
      </aside>
    </>
  );
};
