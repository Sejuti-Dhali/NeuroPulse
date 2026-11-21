# Proposed Physiological Sensing Hardware

The original research concept references Arduino UNO, LM35, MAX30102, pulse sensing, GSR sensing, and ESP8266 communication.

## Proposed Responsibilities

| Component | Function |
|---|---|
| Arduino UNO | Data acquisition |
| LM35 | Temperature measurement |
| MAX30102 | Optical pulse and oxygen-related sensing |
| Pulse sensor | Pulse measurement |
| GSR module | Skin conductance sensing |
| ESP8266 | Wireless communication |

## Integration Status

No physical wiring, firmware upload, hardware calibration, or sensor communication is verified in this repository.

Before physical implementation, validate the voltage requirements and logic levels of each specific module. MAX30102 and ESP8266 modules may require 3.3 V operation or appropriate level shifting.

The web interface currently uses synthetic measurements only.
