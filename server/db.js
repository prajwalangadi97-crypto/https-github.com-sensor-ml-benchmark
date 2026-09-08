import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../sensor_ml.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS telemetry_records (
      test_id TEXT PRIMARY KEY,
      rpm INTEGER,
      torque REAL,
      load REAL,
      temperature REAL,
      s1_acoustic REAL,
      s2_flux REAL,
      s3_load_cell REAL,
      s4_optical REAL,
      measured_output REAL,
      predicted_ref REAL,
      uncertainty_sigma REAL,
      attention_score REAL,
      regime TEXT,
      is_anomalous INTEGER,
      fault_flags TEXT,
      quarantine_reason TEXT,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS benchmark_models (
      id TEXT PRIMARY KEY,
      name TEXT,
      family TEXT,
      cv_rmse_mean REAL,
      cv_rmse_std REAL,
      cv_mae_mean REAL,
      cv_mae_std REAL,
      cv_r2_mean REAL,
      cv_r2_std REAL,
      status TEXT,
      hyperparameters TEXT,
      features_used INTEGER
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      key_id TEXT PRIMARY KEY,
      client_name TEXT,
      api_key TEXT,
      created_at TEXT
    );
  `);

  // Seed default API Key if not present
  const existingKey = db.prepare('SELECT * FROM api_keys WHERE api_key = ?').get('smb_live_sk_9f8a3b2c1d4e5f6a7b8c9d0e');
  if (!existingKey) {
    db.prepare('INSERT INTO api_keys (key_id, client_name, api_key, created_at) VALUES (?, ?, ?, ?)').run(
      'key_01',
      'Industrial Engineering Workstation',
      'smb_live_sk_9f8a3b2c1d4e5f6a7b8c9d0e',
      new Date().toISOString()
    );
  }

  // Seed 260 Telemetry Records if empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM telemetry_records').get();
  if (countStmt.count === 0) {
    console.log('Seeding 260 deterministic telemetry records into SQLite database...');

    let lcgSeed = 42;
    const lcg = () => {
      lcgSeed = (lcgSeed * 1664525 + 1013904223) % 4294967296;
      return lcgSeed / 4294967296;
    };

    const insertStmt = db.prepare(`
      INSERT INTO telemetry_records (
        test_id, rpm, torque, load, temperature, s1_acoustic, s2_flux, s3_load_cell, s4_optical,
        measured_output, predicted_ref, uncertainty_sigma, attention_score, regime, is_anomalous,
        fault_flags, quarantine_reason, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((records) => {
      for (const r of records) {
        insertStmt.run(
          r.test_id, r.rpm, r.torque, r.load, r.temperature, r.s1_acoustic, r.s2_flux,
          r.s3_load_cell, r.s4_optical, r.measured_output, r.predicted_ref, r.uncertainty_sigma,
          r.attention_score, r.regime, r.is_anomalous ? 1 : 0, JSON.stringify(r.fault_flags),
          r.quarantine_reason || null, r.timestamp
        );
      }
    });

    const records = [];

    const anomalousIDs = {
      'TST-0077': {
        attention_score: 80.73,
        measured_output: -12.4,
        predicted_ref: 384.15,
        uncertainty_sigma: 4.12,
        is_anomalous: true,
        fault_flags: ['Transducer Inversion', 'Negative Output', 'Signal Corruption'],
        quarantine_reason: 'Negative power measured (-12.4 kW) under 1,850 RPM active regime.',
        regime: 'Standard Ops',
      },
      'TST-0042': {
        attention_score: 76.67,
        s1_acoustic: 998.42,
        measured_output: 142.8,
        predicted_ref: 341.90,
        uncertainty_sigma: 3.85,
        is_anomalous: true,
        fault_flags: ['Electrical Spike S1', 'EMI Transient', 'Acoustic Exceedance'],
        quarantine_reason: 'Extreme piezoelectric S1 vibration spike (998.42 mm/s).',
        regime: 'Standard Ops',
      },
      'TST-0195': {
        attention_score: 67.40,
        s4_optical: 0.00,
        measured_output: 0.0,
        predicted_ref: 202.244,
        uncertainty_sigma: 28.97,
        is_anomalous: true,
        fault_flags: ['Stuck Readout S4', 'Coupling Shear', 'High Uncertainty'],
        quarantine_reason: 'Stuck optical readout S4 = 0.00 under 2,450 RPM active load.',
        regime: 'Standard Ops',
      },
      'TST-0112': {
        attention_score: 58.20,
        temperature: 148.5,
        measured_output: 295.4,
        predicted_ref: 312.80,
        uncertainty_sigma: 8.64,
        is_anomalous: true,
        fault_flags: ['Thermal Runaway', 'Stator Temp > 140°C'],
        quarantine_reason: 'Stator thermal exceedance (148.5°C) violating SIL-2 safety bounds.',
        regime: 'Heavy Duty',
      },
      'TST-0219': {
        attention_score: 54.10,
        s4_optical: 0.02,
        measured_output: 18.2,
        predicted_ref: 285.50,
        uncertainty_sigma: 12.30,
        is_anomalous: true,
        fault_flags: ['Optical Occlusion', 'Low Transmission'],
        quarantine_reason: 'Optical coupler ratio collapsed to 0.02.',
        regime: 'High Speed',
      },
    };

    for (let i = 1; i <= 260; i++) {
      const id = `TST-${String(i).padStart(4, '0')}`;
      if (anomalousIDs[id]) {
        const override = anomalousIDs[id];
        const regime = override.regime || 'Standard Ops';
        records.push({
          test_id: id,
          rpm: regime === 'High Speed' ? 3500 : (regime === 'Heavy Duty' ? 2800 : 1850),
          torque: regime === 'Heavy Duty' ? 450 : 210,
          load: regime === 'Heavy Duty' ? 65 : 35,
          temperature: override.temperature || 68.5,
          s1_acoustic: override.s1_acoustic || 18.4,
          s2_flux: 1.42,
          s3_load_cell: 34.8,
          s4_optical: override.s4_optical !== undefined ? override.s4_optical : 0.94,
          measured_output: override.measured_output !== undefined ? override.measured_output : 150.0,
          predicted_ref: override.predicted_ref || 350.0,
          uncertainty_sigma: override.uncertainty_sigma || 3.5,
          attention_score: override.attention_score || 45.0,
          regime,
          is_anomalous: true,
          fault_flags: override.fault_flags || ['Anomalous Vector'],
          quarantine_reason: override.quarantine_reason || 'Multi-channel anomaly detected.',
          timestamp: new Date(Date.now() - (260 - i) * 3600000).toISOString(),
        });
        continue;
      }

      let regime = 'Standard Ops';
      if (i > 160 && i <= 230) regime = 'Heavy Duty';
      if (i > 230) regime = 'High Speed';

      let rpm = 1200 + lcg() * 1400;
      if (regime === 'Heavy Duty') rpm = 2000 + lcg() * 1000;
      if (regime === 'High Speed') rpm = 3000 + lcg() * 600;

      if (id === 'TST-0248') {
        rpm = 3600;
        regime = 'High Speed';
      }

      const torque = 100 + (rpm / 4000) * 350 + lcg() * 30;
      const load = 15 + (torque / 500) * 55 + lcg() * 10;
      const temperature = 45 + (load / 70) * 45 + lcg() * 8;
      const s1_acoustic = 12.0 + (rpm / 4000) * 22.0 + lcg() * 5.0;
      const s2_flux = 0.8 + (torque / 500) * 0.9 + lcg() * 0.1;
      const s3_load_cell = load * (0.95 + lcg() * 0.1);
      const s4_optical = 0.88 + lcg() * 0.11;

      let predicted_ref = 210 + (rpm / 3600) * 320 + (load / 70) * 160 + (lcg() - 0.5) * 8;
      if (id === 'TST-0248') {
        predicted_ref = 692.787;
      }

      const measured_output = (predicted_ref * 0.42) * (0.98 + lcg() * 0.04);
      const uncertainty_sigma = 1.2 + lcg() * 2.8;
      const attention_score = 5.0 + (lcg() * 25.0);

      records.push({
        test_id: id,
        rpm: Math.round(rpm),
        torque: Math.round(torque * 10) / 10,
        load: Math.round(load * 10) / 10,
        temperature: Math.round(temperature * 10) / 10,
        s1_acoustic: Math.round(s1_acoustic * 100) / 100,
        s2_flux: Math.round(s2_flux * 100) / 100,
        s3_load_cell: Math.round(s3_load_cell * 10) / 10,
        s4_optical: Math.round(s4_optical * 1000) / 1000,
        measured_output: Math.round(measured_output * 10) / 10,
        predicted_ref: Math.round(predicted_ref * 1000) / 1000,
        uncertainty_sigma: Math.round(uncertainty_sigma * 100) / 100,
        attention_score: Math.round(attention_score * 100) / 100,
        regime,
        is_anomalous: false,
        fault_flags: [],
        timestamp: new Date(Date.now() - (260 - i) * 3600000).toISOString(),
      });
    }

    insertMany(records);
    console.log('Seeded 260 telemetry records successfully.');
  }

  // Seed benchmark models if empty
  const modelCount = db.prepare('SELECT COUNT(*) as count FROM benchmark_models').get();
  if (modelCount.count === 0) {
    const insertModel = db.prepare(`
      INSERT INTO benchmark_models (
        id, name, family, cv_rmse_mean, cv_rmse_std, cv_mae_mean, cv_mae_std,
        cv_r2_mean, cv_r2_std, status, hyperparameters, features_used
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const models = [
      ['ridge-l2', 'Ridge Regression (L2)', 'Linear Regularized', 1.345, 1.309, 0.673, 0.303, 0.9993, 0.0012, 'Champion Model', 'alpha=10.0, solver=cholesky', 8],
      ['stacking-ensemble', 'Stacking Ensemble (ET+GB+RF)', 'Ensemble Stacker', 3.476, 0.908, 2.197, 0.177, 0.9972, 0.0013, 'Runner-Up', 'estimators=[ET, GB, RF]', 8],
      ['extra-trees', 'Extra Trees Regressor', 'Tree Ensemble', 3.784, 1.135, 2.249, 0.319, 0.9967, 0.0018, 'Benchmark Candidate', 'n_estimators=300, max_depth=15', 8],
      ['gradient-boosting', 'Gradient Boosting Regressor', 'Boosting Tree', 4.124, 0.295, 3.028, 0.059, 0.9962, 0.0005, 'Benchmark Candidate', 'learning_rate=0.05, n_estimators=250', 8],
      ['random-forest', 'Random Forest Regressor', 'Bagged Trees', 4.877, 0.378, 3.476, 0.189, 0.9947, 0.0009, 'Benchmark Candidate', 'n_estimators=200, min_samples_split=4', 8],
      ['hist-gb', 'Histogram Gradient Boosting', 'Bin-based Boosting', 5.687, 0.446, 3.641, 0.206, 0.9928, 0.0010, 'Benchmark Candidate', 'max_iter=200, l2_regularization=1.0', 8],
    ];

    for (const m of models) {
      insertModel.run(...m);
    }
  }
}

export default db;
