import { TelemetryRecord, BenchmarkModel } from '../types';

const metaEnv = (import.meta as any).env || {};
const API_BASE_URL = metaEnv.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_KEY = metaEnv.VITE_API_KEY || 'smb_live_sk_9f8a3b2c1d4e5f6a7b8c9d0e';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
});

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, operating in client fallback mode:', err);
    return null;
  }
}

export async function fetchTelemetryRecords(): Promise<TelemetryRecord[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/telemetry`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    return data.records;
  } catch (err) {
    console.warn('Failed to fetch telemetry from API backend:', err);
    return null;
  }
}

export async function fetchBenchmarkModels(): Promise<BenchmarkModel[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/models`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    return data.models;
  } catch (err) {
    console.warn('Failed to fetch benchmark models from API backend:', err);
    return null;
  }
}

export async function fetchTop3Diagnostics(): Promise<TelemetryRecord[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/diagnostics/top3`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    return data.top_3;
  } catch (err) {
    console.warn('Failed to fetch top-3 diagnostics from API backend:', err);
    return null;
  }
}

export async function uploadTelemetryRecords(records: TelemetryRecord[]): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/telemetry/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ records }),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to persist uploaded telemetry records:', err);
    return null;
  }
}

export async function askAiDiagnostician(payload: {
  prompt?: string;
  test_id?: string;
  record?: TelemetryRecord;
}): Promise<{ analysis: string; source: string; test_id?: string; timestamp: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/diagnose`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to contact AI diagnostician endpoint:', err);
    return null;
  }
}

export async function resetDatabase(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to reset database:', err);
    return null;
  }
}

export async function predictWhatIfScenario(vector: {
  rpm: number;
  torque: number;
  load: number;
  temp: number;
  s1_acoustic: number;
  s2_flux: number;
  s4_optical: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vector),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to reach prediction API endpoint:', err);
    return null;
  }
}

