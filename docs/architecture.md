# System Architecture

## Proposed Hardware

- Arduino UNO
- LM35 temperature sensor
- MAX30102 pulse/oxygen sensor
- Pulse sensor
- GSR module
- ESP8266 communication module

## Proposed Data Flow

Sensors -> Microcontroller -> Communication -> Processing -> Patient and Doctor Interfaces

## Implemented Web Demonstration

- `index.html`: application structure and navigation
- `style.css`: responsive interface
- `app.js`: synthetic signals, visualization, local notes, and appointments
- `data/synthetic_readings.csv`: reproducible illustrative dataset

The current implementation is static and requires no backend server.

## Deployment

GitHub Pages serves the HTML, CSS, JavaScript, and dataset files. It does not provide real-time sensor acquisition or clinical data infrastructure.
