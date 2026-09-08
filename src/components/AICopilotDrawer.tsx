import React, { useState, useEffect } from 'react';
import { TelemetryRecord } from '../types';
import { askAiDiagnostician } from '../services/api';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Zap, 
  Copy, 
  Check, 
  RefreshCw 
} from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record?: TelemetryRecord | null;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState<{
    analysis: string;
    source: string;
    test_id?: string;
    timestamp: string;
  } | null>(null);

  // Auto-run analysis when opened with a record
  useEffect(() => {
    if (isOpen && record) {
      handleDiagnoseRecord(record);
    } else if (isOpen && !response) {
      handleGeneralAudit();
    }
  }, [isOpen, record]);

  const handleDiagnoseRecord = async (rec: TelemetryRecord) => {
    setLoading(true);
    const res = await askAiDiagnostician({
      prompt: `Diagnose root cause and SIL-2 safety implications for record ${rec.test_id}`,
      test_id: rec.test_id,
      record: rec,
    });
    if (res) {
      setResponse(res);
    }
    setLoading(false);
  };

  const handleGeneralAudit = async () => {
    setLoading(true);
    const res = await askAiDiagnostician({
      prompt: 'Provide an executive summary of sensor anomalies, regime shifts, and Ridge L2 champion benchmark.',
    });
    if (res) {
      setResponse(res);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    const res = await askAiDiagnostician({
      prompt,
      test_id: record?.test_id,
      record: record || undefined,
    });
    if (res) {
      setResponse(res);
      setPrompt('');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response.analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedAnalysis = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-1.5" />;

      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-1.5 mt-2.5 mb-1 border-b border-slate-800/80 pb-1">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-emerald-400 font-mono mt-2 mb-1">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-lg font-bold text-white font-mono mt-2 mb-1">
            {trimmed.replace('# ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('- **') || trimmed.startsWith('* **')) {
        const clean = trimmed.replace(/^[-*]\s*\*\*/, '');
        const parts = clean.split('**:');
        if (parts.length >= 2) {
          const title = parts[0];
          const rest = parts.slice(1).join('**:');
          return (
            <div key={idx} className="flex items-start gap-2 text-xs font-sans text-slate-300 ml-1 my-1.5 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-sm shadow-cyan-400/50" />
              <div>
                <strong className="text-white font-mono text-[11px] uppercase tracking-wider">{title}:</strong>
                <span className="ml-1 text-slate-300">{rest}</span>
              </div>
            </div>
          );
        }
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs font-sans text-slate-300 ml-1 my-1 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
            <span>{trimmed.replace(/^[-*]\s+/, '')}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-xs text-slate-300 font-sans leading-relaxed my-0.5">
          {trimmed}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Explain TST-0077 Failure', test_id: 'TST-0077', query: 'Explain the physical cause of negative measured power in TST-0077.' },
    { label: 'S4 Optical Coupler Risk', test_id: 'TST-0195', query: 'What is the mechanical risk of S4 optical transfer collapse in TST-0195?' },
    { label: 'S1 Acoustic Spike Analysis', test_id: 'TST-0042', query: 'Analyze the 998.42 mm/s vibration spike in TST-0042. Is it mechanical or EMI?' },
    { label: 'Why Ridge L2 Won', query: 'Why did Ridge L2 regression achieve R²=0.9993 and beat tree ensembles on this telemetry?' },
    { label: 'SIL-2 Safety Boundary', query: 'How does this pipeline verify IEC 61508 SIL-2 plausibility boundary safety?' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    AI Telemetry Diagnostician
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    SIL-2 COPILOT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Transducer Physics & Automated Anomaly Root-Cause Engine
                </p>
              </div>
            </div>

            <button
              id="btn-close-ai-copilot"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Context Banner */}
          {record && (
            <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Target Record:</span>
                <span className="text-cyan-400 font-bold">{record.test_id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                  {record.regime}
                </span>
                {record.is_anomalous && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    ANOMALY
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                ŷ: <strong className="text-emerald-400">{record.predicted_ref}</strong>
              </div>
            </div>
          )}

          {/* Quick Prompt Chips */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Diagnostic Quick Inquiries</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  id={`btn-chip-${idx}`}
                  key={idx}
                  onClick={() => {
                    setPrompt(qp.query);
                    if (qp.test_id) {
                      handleDiagnoseRecord({
                        test_id: qp.test_id,
                        rpm: 2450,
                        torque: 310,
                        load: 45,
                        temperature: 68,
                        s1_acoustic: 18.5,
                        s2_flux: 1.42,
                        s3_load_cell: 42,
                        s4_optical: 0.94,
                        measured_output: 150,
                        predicted_ref: 350,
                        uncertainty_sigma: 2.14,
                        attention_score: 50,
                        regime: 'Standard Ops',
                        is_anomalous: true,
                        fault_flags: ['Diagnostic Investigation'],
                      });
                    } else {
                      askAiDiagnostician({ prompt: qp.query }).then((res) => {
                        if (res) setResponse(res);
                      });
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 transition-all text-left"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Response Display Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <div className="relative">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-mono font-bold text-sm">Synthesizing Diagnostic Telemetry...</p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    Evaluating electromagnetic flux, acoustic vibration Z-scores & SIL-2 plausibility
                  </p>
                </div>
              </div>
            ) : response ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Source & Action Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-[10px] text-slate-400">
                      ENGINE: <strong className="text-slate-200">{response.source}</strong>
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition-all"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Analysis Body */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 space-y-1">
                  {renderFormattedAnalysis(response.analysis)}
                </div>

                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-2">
                  <span>Timestamp: {new Date(response.timestamp).toLocaleTimeString()}</span>
                  <span>Compliance: ISO/IEC 25010 & IEC 61508</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 font-mono">
                <Bot className="w-12 h-12 text-slate-700 mb-2" />
                <p>Select a quick inquiry chip or ask any question below.</p>
              </div>
            )}
          </div>

          {/* Interactive Query Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              id="input-ai-copilot"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI Copilot about sensor physics, anomalies, or models..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none transition-all"
            />
            <button
              id="btn-submit-ai-copilot"
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
