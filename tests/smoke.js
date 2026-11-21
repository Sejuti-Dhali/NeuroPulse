"use strict";
const fs=require("fs");
const assert=require("assert");

const required=[
  "index.html","style.css","app.js","README.md",
  "data/synthetic_readings.csv","data/README.md",
  "docs/architecture.md","docs/provenance.md",
  "hardware/README.md"
];

for(const file of required){
  assert(fs.existsSync(file),"Missing file: "+file);
}

const html=fs.readFileSync("index.html","utf8");
const js=fs.readFileSync("app.js","utf8");

for(const id of [
  "home","patient","doctor","sensors","appointments","research",
  "patientSelect","heartRate","temperature","spo2","gsr",
  "patientDirectory","appointmentForm","sensorChart","exportCsv"
]){
  assert(html.includes('id="'+id+'"'),"Missing element: "+id);
}

assert(js.includes("function generateReadings("));
assert(js.includes("function exportCsv("));
assert(html.includes("RESEARCH DEMO"));

const lines=fs.readFileSync("data/synthetic_readings.csv","utf8").trim().split(/\r?\n/);
assert(lines.length===121,"Expected header plus 120 data rows");

console.log("PASS: Required files");
console.log("PASS: Six application sections");
console.log("PASS: Interactive dashboard elements");
console.log("PASS: Synthetic dataset");
console.log("PASS: Application source structure");
