# Hackathon Submission Package
## Sensor ML Benchmark & Anomaly Analyzer (ISO/SIL-2 Workbench)

Welcome to the official submission package for the **Yuva Yodha Energy Tech Hackathon 2026**.

---

### 📁 Package Directory Contents

```
submission/
├── predictions.csv                 # Mandated Deliverable #1: All 260 test predictions with uncertainty
├── summary_deliverables.json       # Mandated Deliverable #2-7: Official structured challenge JSON
├── standalone_workbench.html       # 100% Self-contained offline interactive workbench (Double-click to run!)
├── METHODOLOGY_STATEMENT.md        # Technical methodology, 100-word statement, math formulation & ML arena
├── EXECUTIVE_PRESENTATION_DOSSIER.md # Executive brief, model graphs, Top 3 root-cause analyses
└── VERIFICATION_AUDIT_REPORT.md    # Static typecheck, production build, API audit & zero-error proof
```

---

### 🚀 Quick Start for Judges & Evaluators

#### 1. Zero-Setup Offline Visual Review (Recommended)
Double-click [`standalone_workbench.html`](file:///c:/Users/prajw/OneDrive/Desktop/power%20hackathon/submission/standalone_workbench.html) in your file explorer.
- Runs offline in Chrome, Edge, Safari, Brave, or Firefox with **zero installation or server commands**.
- Explore all 6 interactive tabs: Executive Dashboard, CRT Oscilloscope, 360° Radar Scanner, ML Benchmark Studio, Top 3 Diagnostician, and 3D Digital Twin.

#### 2. Verify Data Deliverables
- **Predictions CSV**: Open [`predictions.csv`](file:///c:/Users/prajw/OneDrive/Desktop/power%20hackathon/submission/predictions.csv) in Excel or Python. Verified at exactly 260 rows with calculated reference parameters, uncertainty bounds, and attention scores.
- **Deliverables JSON**: Open [`summary_deliverables.json`](file:///c:/Users/prajw/OneDrive/Desktop/power%20hackathon/submission/summary_deliverables.json). Verified with all 7 mandated challenge deliverables.

#### 3. Run Full Full-Stack System (Optional)
If you wish to test the live Node.js Express REST API and Vite React frontend:
```bash
# In the repository root
npm install
npm start
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/health`
- API Key: `smb_live_sk_9f8a3b2c1d4e5f6a7b8c9d0e`

---

### 🏆 Mandated Deliverables Quick Reference

1. **Number of records analysed**: **260 records** (Test partition; plus 904 training cycles ingested)
2. **Abnormal / invalid records identified**: **5 records** (1.9% fault rate: `TST-0077`, `TST-0042`, `TST-0195`, `TST-0112`, `TST-0219`)
3. **Minimum predicted Reference Parameter**: **202.244 units** (`TST-0195`, Bayesian bound $\pm 28.97\sigma$)
4. **Maximum predicted Reference Parameter**: **692.787 units** (`TST-0248`, High Speed 3,600 RPM regime)
5. **Average predicted Reference Parameter**: **359.718 units** ($\sigma = \pm 84.3$ units)
6. **Three Test IDs requiring highest attention**:
   1. `TST-0077` (Attention Score: 80.73) - Negative Measured Output ($-12.4\text{ kW}$) / Transducer Inversion
   2. `TST-0042` (Attention Score: 76.67) - Extreme Piezoelectric Acoustic Spike ($998.42\text{ mm/s}$) / EMI Transient
   3. `TST-0195` (Attention Score: 67.40) - Stuck Zero Optical Coupler Readout ($S_4 = 0.00$) / Mechanical Shear Pin Break
7. **Team's Methodological Approach**:
   *"Our team conducted automated data profiling, robust regime-stratified imputation, and multi-stage anomaly detection. We separated genuine operating shifts from sensor spikes, stuck outputs, and thermal exceedances. Verified clean records trained five candidate regressors with 5-fold cross-validation. Stacking ensemble and Extra Trees achieved dominant predictive accuracy. Test predictions were generated with tree-variance uncertainty bounds and transparent multidimensional attention scoring."*
