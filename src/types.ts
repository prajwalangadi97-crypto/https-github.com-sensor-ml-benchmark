export type OperatingRegime = 'Standard Ops' | 'Heavy Duty' | 'High Speed';

export interface TelemetryRecord {
  test_id: string;
  rpm: number;                  // Rotational Speed (RPM)
  torque: number;               // Shaft Torque (Nm)
  load: number;                 // Mechanical Reaction Load (kN)
  temperature: number;          // Stator Thermal Temp (°C)
  s1_acoustic: number;          // Piezoelectric Acoustic Vibration (mm/s)
  s2_flux: number;              // Electromagnetic Flux Density (mT)
  s3_load_cell: number;         // Aux Load Cell (kN)
  s4_optical: number;           // High-speed Optical Transfer Ratio (0.0 - 1.0)
  measured_output: number;      // Transducer Measured Output (kW)
  predicted_ref: number;        // Model Predicted Reference Parameter (units)
  uncertainty_sigma: number;    // Prediction Uncertainty Std Dev (± σ)
  attention_score: number;      // Attention Score (0.0 - 100.0)
  regime: OperatingRegime;
  is_anomalous: boolean;
  fault_flags: string[];
  quarantine_reason?: string;
  timestamp?: string;
}

export interface BenchmarkModel {
  id: string;
  name: string;
  family: string;
  cv_rmse_mean: number;
  cv_rmse_std: number;
  cv_mae_mean: number;
  cv_mae_std: number;
  cv_r2_mean: number;
  cv_r2_std: number;
  status: 'Champion Model' | 'Runner-Up' | 'Benchmark Candidate';
  hyperparameters: string;
  features_used: number;
}

export type ThemeMode = 
  | 'industrial-dark' 
  | 'precision-slate' 
  | 'cybernetic-emerald' 
  | 'clean-light' 
  | 'obsidian-gold' 
  | 'aurora-blue';

export interface MandatedDeliverable {
  itemNumber: number;
  title: string;
  value: string;
  methodology: string;
  highlight?: boolean;
}

export interface AttentionRecordSummary {
  rank: number;
  test_id: string;
  attention_score: number;
  primary_defect: string;
  measured_output: number;
  predicted_ref: number;
  uncertainty: number;
  root_cause: string;
  mitigation: string;
}
