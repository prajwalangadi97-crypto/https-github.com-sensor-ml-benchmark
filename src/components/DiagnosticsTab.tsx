import React, { useState } from 'react';
import { TOP_3_ATTENTION_RECORDS } from '../data/telemetryData';
import { TelemetryRecord } from '../types';
import { ShieldCheck, AlertTriangle, Crosshair, Wrench, ChevronRight, Zap, Sparkles } from 'lucide-react';

interface DiagnosticsTabProps {
  records: TelemetryRecord[];
  onSelectRecord: (record: TelemetryRecord) => void;
  onConsultAi?: (record: TelemetryRecord) => void;
}

export const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({
  records,
  onSelectRecord,
  onConsultAi,
}) => {
  const [selectedRank, setSelectedRank] = useState<number>(1);

  const activeSummary = TOP_3_ATTENTION_RECORDS.find((r) => r.rank === selectedRank) || TOP_3_ATTENTION_RECORDS[0];
  const activeRecord = records.find((r) => r.test_id === activeSummary.test_id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Top 3 Critical Attention Diagnostician & Root-Cause Auditor
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Multidimensional attention scoring: Anomaly Intensity (50%) + Variance Uncertainty (30%) + Flag Severity (20%).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
            3 HIGH-PRIORITY REGIMES ISOLATED
          </span>
        </div>
      </div>

      {/* Top 3 Selection Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TOP_3_ATTENTION_RECORDS.map((item) => {
          const isSelected = item.rank === selectedRank;
          return (
            <div
              key={item.test_id}
              onClick={() => setSelectedRank(item.rank)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-950 border-rose-500/80 shadow-xl shadow-rose-950/40 ring-1 ring-rose-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  RANK #{item.rank} ATTENTION
                </span>
                <span className="text-lg font-bold font-mono text-rose-400">{item.attention_score}</span>
              </div>

              <h3 className="text-base font-bold text-white mt-2 font-mono">{item.test_id}</h3>
              <p className="text-xs text-slate-300 font-sans mt-1 line-clamp-2">{item.primary_defect}</p>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Predicted: <strong className="text-cyan-400">{item.predicted_ref}</strong></span>
                <span>Uncertainty: <strong className="text-amber-400">±{item.uncertainty}σ</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Record Deep Dive Diagnostic Audit Panel */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-400">{activeSummary.test_id}</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                ATTENTION SCORE: {activeSummary.attention_score} / 100.0
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">{activeSummary.primary_defect}</p>
          </div>

          <div className="flex items-center gap-2">
            {activeRecord && onConsultAi && (
              <button
                id="btn-consult-ai-copilot"
                onClick={() => onConsultAi(activeRecord)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all shadow-sm"
                title="Query AI Diagnostician about this failure"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>CONSULT AI COPILOT</span>
              </button>
            )}
            {activeRecord && (
              <button
                id="btn-inspect-vector"
                onClick={() => onSelectRecord(activeRecord)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono font-bold transition-all"
              >
                <span>INSPECT VECTOR</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Measured Output</div>
            <div className="text-lg font-bold text-rose-400 mt-1">{activeSummary.measured_output} kW</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Predicted Ref Parameter</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">{activeSummary.predicted_ref} units</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Bayesian Uncertainty Bound</div>
            <div className="text-lg font-bold text-amber-400 mt-1">±{activeSummary.uncertainty}σ</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Isolation Forest Score</div>
            <div className="text-lg font-bold text-white mt-1">{(activeSummary.attention_score / 100).toFixed(3)}</div>
          </div>
        </div>

        {/* Root Cause & Engineering Action Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Root Cause Analysis */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Root-Cause Failure Audit</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeSummary.root_cause}
            </p>
          </div>

          {/* Corrective Engineering Action */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <Wrench className="w-4 h-4" />
              <span>Recommended Engineering Action</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeSummary.mitigation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
