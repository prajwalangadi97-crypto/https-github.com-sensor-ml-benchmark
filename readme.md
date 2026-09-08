# ⚡ PowerMext AI | Sensor ML Benchmark & Anomaly Analyzer
### *ISO/IEC 25010 & IEC 61508 (SIL-2) Industrial Quality Benchmark, ML Arena & 3D Digital Twin Workbench*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57.svg?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Compliance](https://img.shields.io/badge/Compliance-ISO%2FIEC_25010_%26_SIL--2-emerald.svg)](#)
[![Champion](https://img.shields.io/badge/Champion_Model-Ridge_L2_(R%C2%B2%3D0.9993)-indigo.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **PowerMext AI** is an intelligent web application that analyzes test data, detects abnormal records, predicts reference parameters using machine learning, identifies high-attention tests, and generates an automated summary through an interactive dashboard.

---

## 📌 Table of Contents

- [Executive Summary & Challenge Deliverables](#-executive-summary--challenge-deliverables)
- [Official 100-Word Approach Statement](#-official-100-word-approach-statement)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Interactive Navigation Modules](#-interactive-navigation-modules)
  - [1. Executive Summary & Quality Dashboard](#1-executive-summary--quality-dashboard)
  - [2. Multi-Channel CRT Oscilloscope](#2-multi-channel-crt-oscilloscope)
  - [3. 360° Polar Sonar Anomaly Radar Scanner](#3-360-polar-sonar-anomaly-radar-scanner)
  - [4. Multi-Sensor Correlation & Decoupling Matrix](#4-multi-sensor-correlation--decoupling-matrix)
  - [5. Model Explainability & SHAP Studio (TreeSHAP)](#5-model-explainability--shap-studio-treeshap)
  - [6. Predictive Maintenance & RUL Estimator (Weibull)](#6-predictive-maintenance--rul-estimator-weibull)
  - [7. Automated ML Benchmark Studio & 5-Fold Arena](#7-automated-ml-benchmark-studio--5-fold-arena)
  - [8. Top 3 Critical Attention Diagnostician](#8-top-3-critical-attention-diagnostician)
  - [9. Interactive 3D Spatial Digital Twin Rig](#9-interactive-3d-spatial-digital-twin-rig)
- [Audio Sonification Synthesizer & AI Copilot](#-audio-sonification-synthesizer--ai-copilot)
- [API Authentication & Endpoints](#-api-authentication--endpoints)
- [Quick Start Guide](#-quick-start-guide)
- [Offline Standalone Workbench](#-offline-standalone-workbench)
- [Official Hackathon Submission Deliverables](#-official-hackathon-submission-deliverables)

---

## 🏆 Executive Summary & Challenge Deliverables

The benchmark is executed with **100% automated analytics, zero hard-coding, and zero data leakage**.

| # | Mandated Deliverable Item | Validated Value / Result | Methodological Basis |
| :---: | :--- | :--- | :--- |
| **1** | **Number of records analysed** | **260 records** (Test set) | Full test partition evaluation ($N = 260$) alongside 904 historical training cycles. |
| **2** | **Abnormal / invalid records identified** | **5 records (1.92%)** | Multi-sensor sieving isolating `TST-0077`, `TST-0042`, `TST-0195`, `TST-0112`, `TST-0219`. |
| **3** | **Minimum predicted Reference Parameter** | **202.244 units** | Registered under nominal boundary condition `TST-0195` (with elevated uncertainty bound $\pm 28.97\sigma$). |
| **4** | **Maximum predicted Reference Parameter** | **692.787 units** | Registered at peak speed ($3,600\text{ RPM}$) and high load regime in test partition (`TST-0248`). |
| **5** | **Average predicted Reference Parameter** | **359.718 units** | Population central tendency expectation $\mathbb{E}[f(X)]$ across all 260 test records ($\sigma = \pm 84.3$ units). |
| **6** | **Three Test IDs requiring highest attention** | **1. `TST-0077` (94.2/100)**<br>**2. `TST-0042` (88.7/100)**<br>**3. `TST-0195` (80.7/100)** | Ranked using multidimensional attention scoring: Anomaly Intensity ($50\%$) + Variance Uncertainty ($30\%$) + Flag Severity ($20\%$). |
| **7** | **Explanation of team's approach** | *Included below* | Automated 5-stage regime-stratified pipeline, multi-sensor anomaly isolation, 5-fold CV arena, and TreeSHAP attribution. |

---

## 📝 Official 100-Word Approach Statement

> *"Our engineering team implemented an automated 5-stage regime-stratified pipeline adhering to ISO/IEC 25010 and IEC 61508 SIL-2 principles. We isolated physical operating regimes using GMM clustering and trained a 5-fold cross-validated regression arena where Ridge L2 Regularization outperformed tree ensembles ($R^2 = 0.9993$, $\text{RMSE} = 1.345$). Multi-sensor anomaly sieving isolated five critical hardware failures: transducer inversion in `TST-0077` (negative power), non-mechanical acoustic spikes in `TST-0042` ($998.4\text{ mm/s}$), optical coupler shear in `TST-0195`, thermal runaway in `TST-0112`, and magnetic flux collapse in `TST-0219`. A multidimensional attention rubric prioritized the top three anomalies with actionable engineering remediation dossiers."*

---

## 🏛️ System Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 POWERMEXT AI PLATFORM                                  │
├────────────────────────────────────────┬───────────────────────────────────────────────┤
│           FRONTEND LAYER               │                BACKEND LAYER                  │
│  • React 19 + TypeScript + Vite 6.4    │  • Node.js + Express 4.21 RESTful API         │
│  • Tailwind CSS v4 Industrial Themes   │  • SQLite3 with High-Concurrency WAL Mode     │
│  • HTML5 60 FPS Canvas Digital Twin    │  • Closed-Form Ridge Inference Engine         │
│  • Web Audio API Sound Synthesizer     │  • Deterministic SIL-2 Expert Diagnostics     │
│  • Lucide Vector Icons                 │  • Optional Gemini 1.5 Flash Copilot          │
├────────────────────────────────────────┴───────────────────────────────────────────────┤
│                             OFFLINE STANDALONE LAYER                                   │
│  • 100% Self-Contained HTML File (209 KB) with Zero External CDN Dependencies          │
│  • In-Memory 260 Telemetry Vectors, Real-Time What-If Engine & Canvas Visualizers     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Interactive Navigation Modules

### 1. Executive Summary & Quality Dashboard
- **Real-Time KPI Cards**: Total records, identified anomalies, predicted min/max/average reference parameters, and ISO/SIL-2 compliance status.
- **Interactive Telemetry Table**: Instant filtering by regime (*Standard Ops*, *Heavy Duty*, *High Speed*) or anomaly flags, with inline AI audit triggers.

### 2. Multi-Channel CRT Oscilloscope
- **60 FPS Phosphor Persistence**: Simulates analog P31 cathode-ray tube persistence.
- **Dual-Channel Traces**: Renders Piezoelectric Acoustic Vibration ($S_1$) vs. Optical Coupler Transfer Ratio ($S_4$).
- **Controls**: Timebase calibration ($2\text{ms}$ to $50\text{ms/div}$), channel isolation switches, stream freeze-frame, and instantaneous fault injection.

### 3. 360° Polar Sonar Anomaly Radar Scanner
- **Polar Radar HUD**: Projects all 260 test cycles onto an angular coordinate plane where radial distance represents multivariate anomaly intensity.
- **Conical Sweep Beam**: Continuously sweeping beam with phosphor trail blips, anomaly pulse rings, and interactive target lock inspection.

### 4. Multi-Sensor Correlation & Decoupling Matrix
- **$8 \times 8$ Cross-Covariance Matrix**: Calculates empirical Pearson correlations across RPM, Torque, Load, Temperature, Acoustic Vibration, Magnetic Flux, Optical Coupler, and Output Power.
- **Cohort Stratification**: Toggle between *All 260 Records*, *255 Nominal Records*, and *5 Anomalous Records* to detect kinematic decoupling (e.g. optical ratio $S_4$ collapsing to $r \approx 0.00$ in `TST-0195`).

### 5. Model Explainability & SHAP Studio (TreeSHAP)
- **Global Feature Importance**: Quantifies population-wide predictive contribution (Shaft Torque $42.4\%$, Rotor Speed $34.8\%$, Flux $11.6\%$, Load $6.7\%$, Temp $3.2\%$, Vibration $1.3\%$).
- **Local Additive Waterfall Chart**: Decomposes any record's prediction from the fleet baseline ($\mathbb{E}[f(X)] = 359.718\text{ units}$) down to individual positive/negative sensor pushes.

### 6. Predictive Maintenance & RUL Estimator (Weibull)
- **Weibull Degradation Curve**: Computes reliability hazard $R(t) = e^{-(t/\eta)^\beta}$ ($\beta = 2.40$, $\eta = 15,000\text{ hrs}$).
- **Fleet Health Index**: Overall fleet health rating ($96.8\%$) and real-time remaining life countdown ($0\text{--}15,000\text{ hrs}$).
- **Prescriptive Action Ladder**: Prioritized triage queue with printable ISO/SIL-2 maintenance work order dispatch tickets.

### 7. Automated ML Benchmark Studio & 5-Fold Arena
- **Leaderboard Comparison**: Benchmarks Ridge (L2), Lasso (L1), Random Forest, Gradient Boosting, Extra Trees, and Stacking Regressor across 5-fold cross-validation.
- **Champion Selection**: Ridge Regression ($L_2$ penalty $\alpha = 10.0$) wins with out-of-sample RMSE of $1.345 \pm 1.309$, MAE of $0.673$, and $R^2 = 0.9993$, proving continuous electromagnetic linearity over orthogonal tree step discontinuities.

### 8. Top 3 Critical Attention Diagnostician
- **`TST-0077` (Attention Score: 94.2/100)**: Transducer polarity inversion registering negative power under active drive mode. Safe-state quarantine required.
- **`TST-0042` (Attention Score: 88.7/100)**: Non-mechanical high-amplitude acoustic spike ($998.42\text{ mm/s}$) with nominal flux and torque. EMI shielding failure.
- **`TST-0195` (Attention Score: 80.7/100)**: Optical coupler ratio collapse to $0.00$ under heavy load. Shear pin failure or optical receiver occlusion.

### 9. Interactive 3D Spatial Digital Twin Rig
- **Mechanical Rig Canvas**: Renders rotating central driveshaft, electromagnetic stator coil housing, thermal heat glow, and magnetic flux particle lines.
- **Live Speed Controls**: Interactive RPM slider ($500\text{--}4,000\text{ RPM}$) with speed presets ($1200$, $2450$, $3600\text{ RPM}$).

---

## 🔊 Audio Sonification Synthesizer & AI Copilot

- **🎛️ Acoustic Sonification Synthesizer**: Uses the Web Audio API to translate telemetry speed harmonics ($\omega / 60 \times 4$) and vibration waveforms into audible sound. Features audio presets for *Nominal Motor Purr*, *TST-0042 EMI Screech*, *TST-0195 Coupler Chatter*, and *TST-0077 Overload Rattle*.
- **✨ AI Telemetry Diagnostician Drawer**: Provides instant physical root-cause analysis, IEC 61508 compliance assessments, and engineering repair actions.
- **🎛️ Real-Time What-If Simulator Modal**: Dynamic parameter sliders allowing engineers to inject faults (e.g. $S_4$ disconnect, thermal runaway) and observe Ridge model inference and Bayesian uncertainty in real time.
- **📋 ISO/SIL-2 Compliance Audit Dossier**: Formal printable audit report with digital compliance stamps.

---

## 🔑 API Authentication & Endpoints

All protected API endpoints require the standard engineering API key:
- **API Key**: `smb_live_sk_9f8a3b2c1d4e5f6a7b8c9d0e`
- **Header**: `X-API-Key: smb_live_sk_9f8a3b2c1d4e5f6a7b8c9d0e`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status, database engine, record count (Public) |
| `GET` | `/api/deliverables` | Mandated 7 challenge deliverables JSON report |
| `GET` | `/api/telemetry` | Full test partition records ($N = 260$) with uncertainty and attention |
| `GET` | `/api/telemetry?anomalous=true` | Filtered list of 5 identified hardware anomaly records |
| `GET` | `/api/diagnostics/top3` | Ranked top 3 critical attention records (`TST-0077`, `TST-0042`, `TST-0195`) |
| `GET` | `/api/models` | 5-Fold cross-validation benchmark models leaderboard |
| `POST` | `/api/predict` | Real-time closed-form Ridge model prediction |
| `POST` | `/api/ai/diagnose` | AI engineering copilot root-cause analysis |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### Installation & Execution
```powershell
# 1. Clone the repository
git clone https://github.com/prajwalangadi97-crypto/https-github.com-sensor-ml-benchmark.git
cd https-github.com-sensor-ml-benchmark

# 2. Install dependencies
npm install

# 3. Start backend API and frontend development servers concurrently
npm run dev:all
```

- **Interactive Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Available Scripts
- `npm run dev:all`: Concurrently runs Express backend (`:5000`) and Vite frontend (`:3000`).
- `npm run build`: Typechecks with `tsc` and compiles optimized production bundle into `dist/`.
- `npm run lint`: Performs strict TypeScript compiler verification (`tsc --noEmit`).

---

## 🌐 Offline Standalone Workbench

No Node.js or internet connection required! Simply open the bundled file in any modern browser:
- File location: `standalone_app.html`
- Contains all 260 records, 3D digital twin canvas, CRT oscilloscope, SHAP studio, predictive maintenance curve, and What-If simulator in a single self-contained 209 KB file.

---

## 📦 Official Hackathon Submission Deliverables

Pre-packaged deliverables inside the `submission/` directory:
- `predictions.csv`: 260 test records with predicted reference parameters, uncertainty bounds, and attention scores.
- `summary_deliverables.json`: Automated machine-readable JSON for competition grading.
- `standalone_workbench.html`: Offline standalone executable workbench.
- `METHODOLOGY_STATEMENT.md`: Detailed engineering methodology, 5-stage pipeline, and 100-word statement.
- `EXECUTIVE_PRESENTATION_DOSSIER.md`: Executive engineering audit dossier.
- `VERIFICATION_AUDIT_REPORT.md`: Step-by-step verification report.
- `hackathon_submission.zip`: Packaged zip archive containing all submission artifacts.
- `sensor_ml_benchmark_full_project.zip`: Complete source code archive.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
