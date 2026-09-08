import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../sensor_ml.db');
const db = new Database(dbPath);

const rows = db.prepare('SELECT * FROM telemetry_records ORDER BY test_id ASC').all();

let csv = 'test_id,rpm,torque,load,temperature,s1_acoustic,s2_flux,s3_load_cell,s4_optical,measured_output,predicted_ref,uncertainty_sigma,attention_score,regime,is_anomalous,fault_flags\n';

for (const r of rows) {
  const flags = JSON.parse(r.fault_flags || '[]').join('; ');
  csv += `${r.test_id},${r.rpm},${r.torque},${r.load},${r.temperature},${r.s1_acoustic},${r.s2_flux},${r.s3_load_cell},${r.s4_optical},${r.measured_output},${r.predicted_ref},${r.uncertainty_sigma},${r.attention_score},${r.regime},${r.is_anomalous ? 'TRUE' : 'FALSE'},"${flags}"\n`;
}

const publicPath = path.resolve(__dirname, '../public/predictions.csv');
fs.writeFileSync(publicPath, csv);

const distPath = path.resolve(__dirname, '../dist/predictions.csv');
if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
  fs.writeFileSync(distPath, csv);
}

console.log(`Generated predictions.csv with ${rows.length} test records in public and dist.`);
