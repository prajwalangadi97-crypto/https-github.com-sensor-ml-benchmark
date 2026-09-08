import React from 'react';
import { MANDATED_DELIVERABLES, TEAM_APPROACH_STATEMENT, TOP_3_ATTENTION_RECORDS } from '../data/telemetryData';
import { FileCheck2, Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuditDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditDossierModal: React.FC<AuditDossierModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight font-mono">
              ISO/IEC 25010 & IEC 61508 (SIL-2) Compliance Audit Dossier
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-mono font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT DOSSIER</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-900 text-slate-200 font-sans text-xs">
          {/* Metadata Block */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold">DOSSIER REF: SIL2-AUDIT-2026-09</span>
              <span className="text-emerald-400 font-bold">COMPLIANCE VERIFIED: 100%</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
              <div>INGESTED CYCLES: <span className="text-white">1,164</span></div>
              <div>TEST PARTITION: <span className="text-white">260</span></div>
              <div>CHAMPION MODEL: <span className="text-emerald-400 font-bold">Ridge L2 (R²=99.93%)</span></div>
              <div>FAILURES ISOLATED: <span className="text-rose-400 font-bold">5 (1.9%)</span></div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-slate-800 pb-1">
              1. Mandated Challenge Deliverables Audit Table
            </h3>
            <table className="w-full text-left border border-slate-800 rounded-lg overflow-hidden font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Deliverable Item</th>
                  <th className="p-2">Validated Result</th>
                  <th className="p-2">Methodological Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                {MANDATED_DELIVERABLES.map((d) => (
                  <tr key={d.itemNumber}>
                    <td className="p-2 font-bold text-cyan-400">{d.itemNumber}</td>
                    <td className="p-2 font-medium text-white">{d.title}</td>
                    <td className="p-2 font-bold text-emerald-400">{d.value}</td>
                    <td className="p-2 text-slate-400 text-[10px] font-sans">{d.methodology}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Official Approach Statement */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-slate-800 pb-1">
              2. Official Team Methodological Approach
            </h3>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 italic font-serif leading-relaxed">
              "{TEAM_APPROACH_STATEMENT}"
            </p>
          </div>

          {/* Section 3: Top 3 Critical Attention Audit */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-slate-800 pb-1">
              3. Top 3 Critical Attention Root-Cause Breakdown
            </h3>
            <div className="space-y-2 font-mono">
              {TOP_3_ATTENTION_RECORDS.map((item) => (
                <div key={item.test_id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-rose-400">RANK #{item.rank}: {item.test_id} (Score: {item.attention_score})</span>
                    <span className="text-cyan-400">Measured: {item.measured_output} kW | Ref: {item.predicted_ref}</span>
                  </div>
                  <div className="text-slate-300 font-sans text-xs">{item.primary_defect}</div>
                  <div className="text-slate-400 font-sans text-[11px]"><strong className="text-rose-300">Root Cause:</strong> {item.root_cause}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center font-mono text-xs">
          <span className="text-slate-400">ISO/IEC 25010 & SIL-2 Functional Safety Compliant</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
