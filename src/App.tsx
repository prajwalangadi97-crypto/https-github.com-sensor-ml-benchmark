import React, { useState, useEffect } from 'react';
import { TelemetryRecord, ThemeMode } from './types';
import { generateTestRecords } from './data/telemetryData';
import { Header } from './components/Header';
import { ExecutiveSummaryTab } from './components/ExecutiveSummaryTab';
import { LiveTelemetryStream } from './components/LiveTelemetryStream';
import { AnomalyRadarScanner } from './components/AnomalyRadarScanner';
import { ModelStudioTab } from './components/ModelStudioTab';
import { DiagnosticsTab } from './components/DiagnosticsTab';
import { DigitalTwinTab } from './components/DigitalTwinTab';
import { SensorCorrelationMatrix } from './components/SensorCorrelationMatrix';
import { ModelExplainabilityTab } from './components/ModelExplainabilityTab';
import { PredictiveMaintenanceTab } from './components/PredictiveMaintenanceTab';
import { AudioSonificationSynthesizer } from './components/AudioSonificationSynthesizer';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { AuditDossierModal } from './components/AuditDossierModal';
import { ExportCenterModal } from './components/ExportCenterModal';
import { RecordInspectorDrawer } from './components/RecordInspectorDrawer';
import { UploadDataModal } from './components/UploadDataModal';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

import { fetchTelemetryRecords, fetchHealthStatus } from './services/api';
import { audioSonification } from './services/audioSonification';

export function App() {
  const [records, setRecords] = useState<TelemetryRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>('executive');
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('industrial-dark');
  const [apiOnline, setApiOnline] = useState<boolean>(false);

  // Modals state
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isAudioSynthOpen, setIsAudioSynthOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Inspector & AI drawer state
  const [selectedRecord, setSelectedRecord] = useState<TelemetryRecord | null>(null);
  const [aiTargetRecord, setAiTargetRecord] = useState<TelemetryRecord | null>(null);

  useEffect(() => {
    // Generate initial fallback data
    const fallbackRecords = generateTestRecords();
    setRecords(fallbackRecords);

    // Fetch live telemetry from Express backend API
    fetchHealthStatus().then((status) => {
      if (status && status.status === 'ONLINE') {
        setApiOnline(true);
        fetchTelemetryRecords().then((apiRecords) => {
          if (apiRecords && apiRecords.length > 0) {
            setRecords(apiRecords);
          }
        });
      }
    });

    // Audio sonification status listener
    const unsubAudio = audioSonification.subscribe(() => {
      setIsAudioPlaying(audioSonification.getStatus().isEnabled);
    });

    return () => unsubAudio();
  }, []);

  const anomaliesCount = records.filter(r => r.is_anomalous).length;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans theme-${currentTheme} selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors`}>
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAiCopilot={() => {
          setAiTargetRecord(null);
          setIsAiCopilotOpen(true);
        }}
        onOpenAudioSynth={() => setIsAudioSynthOpen(true)}
        isAudioPlaying={isAudioPlaying}
        anomaliesCount={anomaliesCount}
        apiOnline={apiOnline}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        {activeTab === 'executive' && (
          <ExecutiveSummaryTab
            records={records}
            onSelectRecord={(r) => setSelectedRecord(r)}
            onGoToDiagnostics={() => setActiveTab('diagnostics')}
          />
        )}

        {activeTab === 'oscilloscope' && <LiveTelemetryStream />}

        {activeTab === 'radar' && (
          <AnomalyRadarScanner
            records={records}
            onSelectRecord={(r) => setSelectedRecord(r)}
          />
        )}

        {activeTab === 'correlation' && (
          <SensorCorrelationMatrix records={records} />
        )}

        {activeTab === 'explainability' && (
          <ModelExplainabilityTab
            records={records}
            onSelectRecord={(r) => setSelectedRecord(r)}
          />
        )}

        {activeTab === 'maintenance' && (
          <PredictiveMaintenanceTab
            records={records}
            onSelectRecord={(r) => setSelectedRecord(r)}
          />
        )}

        {activeTab === 'models' && <ModelStudioTab />}

        {activeTab === 'diagnostics' && (
          <DiagnosticsTab
            records={records}
            onSelectRecord={(r) => setSelectedRecord(r)}
            onConsultAi={(r) => {
              setAiTargetRecord(r);
              setIsAiCopilotOpen(true);
            }}
          />
        )}

        {activeTab === 'digital-twin' && <DigitalTwinTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Sensor ML Quality Benchmark & 3D Digital Twin Workbench</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>ISO/IEC 25010</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">IEC 61508 (SIL-2)</span>
            <span>•</span>
            <span>5-Fold CV AutoML Verified</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />

      <AuditDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      <ExportCenterModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        records={records}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <UploadDataModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataUploaded={(newRecs) => setRecords(newRecs)}
      />

      <RecordInspectorDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      <AICopilotDrawer
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        record={aiTargetRecord}
      />

      {/* Audio Sonification Floating Synthesizer Modal */}
      {isAudioSynthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <AudioSonificationSynthesizer onClose={() => setIsAudioSynthOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
