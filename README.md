# NeuroPulse

### Intelligent Physiological Monitoring and Telemedicine

A responsive, browser-based biomedical engineering demonstration integrating simulated physiological signals, patient monitoring, clinician review, and telemedicine workflows.

**[Live Website](https://sejuti-dhali.github.io/NeuroPulse/)** | **[Source Code](https://github.com/Sejuti-Dhali/NeuroPulse)**

## Project Background

NeuroPulse is a newly developed demonstration informed by the original group presentation, **MindMonitor: A Web-Based Telemedicine Platform for Mental Health Monitoring**.

The original project concept described Arduino-based physiological sensing and web interfaces for patient and doctor monitoring.

This repository provides a reconstructed software demonstration, not the original group's complete application source code.

## Features

- Responsive web interface with six navigation sections
- Patient dashboard with physiological measurements
- Heart-rate and temperature trend charts
- Doctor dashboard with fictional patient profiles
- Browser-local demonstration notes
- Self-reported well-being check-ins
- Synthetic signal generation
- CSV data export
- Demonstration appointment scheduling
- Proposed sensor architecture documentation

## Sensor Configuration

| Component | Proposed role |
|---|---|
| Arduino UNO | Sensor acquisition |
| LM35 | Temperature sensing |
| MAX30102 | Optical pulse and oxygen sensing |
| Pulse sensor | Pulse signal acquisition |
| GSR sensor | Skin conductance response |
| ESP8266 | Proposed wireless communication |

The hardware components are documented as a proposed architecture. This version does not acquire physical sensor readings.

## Software Architecture

```text
Synthetic Physiological Signals
              |
              v
JavaScript Data Generation
              |
              v
Patient Dashboard / Doctor Dashboard
              |
              v
Charts, Check-ins, Notes, Appointments
              |
              v
Browser-Local Demonstration Storage
```

## Repository Structure

```text
NeuroPulse/
├── index.html
├── style.css
├── app.js
├── README.md
├── data/
│   ├── synthetic_readings.csv
│   └── README.md
├── docs/
│   ├── architecture.md
│   └── provenance.md
├── hardware/
│   └── README.md
└── tests/
    └── smoke.js
```

## Run Locally

Clone the repository:

```bash
git clone https://github.com/Sejuti-Dhali/NeuroPulse.git
cd NeuroPulse
```

Start a local server:

```bash
python -m http.server 8000
```

Open http://localhost:8000/

Alternatively, open `index.html` directly.

## Run Tests

Node.js is required:

```bash
node --check app.js
node tests/smoke.js
```

## Deployment

The static application can be deployed through GitHub Pages:

- Settings > Pages
- Source: Deploy from a branch
- Branch: main
- Folder: /(root)

Website: https://sejuti-dhali.github.io/NeuroPulse/

## Dataset Provenance

`data/synthetic_readings.csv` contains 120 mathematically generated observations.

All patient profiles and readings are fictional. They are not experimental recordings, real patient measurements, or clinically validated outcomes.

## Limitations

- No physical sensor acquisition
- No production backend or secure authentication
- No real patient database
- No real appointment booking
- No clinically validated mental-health AI
- No medical-device validation

**This project is for education, research presentation, and software demonstration only. It must not be used for diagnosis, treatment, or medical decisions.**

## Attribution

Original group project: *MindMonitor: A Web-Based Telemedicine Platform for Mental Health Monitoring*.

NeuroPulse is a newly developed demonstration informed by that concept. Original group contributions and subsequent implementation should be distinguished.
