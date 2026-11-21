"use strict";

const $ = id => document.getElementById(id);
const patients = [
  {id:"P001",name:"Demo Patient A",age:24,seed:101},
  {id:"P002",name:"Demo Patient B",age:36,seed:202},
  {id:"P003",name:"Demo Patient C",age:51,seed:303}
];

let selected=patients[0];
let readings=[];
let appointments=[];

function randomGenerator(seed){
  let state=seed>>>0;
  return ()=>{
    state=(1664525*state+1013904223)>>>0;
    return state/4294967296;
  };
}

function generateReadings(seed,count=24,profile="baseline"){
  const random=randomGenerator(seed);
  const result=[];
  const activity=profile==="activity"?14:0;
  const variation=profile==="variation"?2:1;
  for(let i=0;i<count;i++){
    result.push({
      step:i+1,
      heartRate:Math.round(72+activity+Math.sin(i/3)*5*variation+(random()-.5)*8),
      temperature:+(36.5+Math.sin(i/6)*.12+(random()-.5)*.18).toFixed(2),
      spo2:Math.max(95,Math.min(100,Math.round(98+(random()-.5)*3))),
      gsr:Math.round(740+Math.sin(i/4)*35*variation+(random()-.5)*45)
    });
  }
  return result;
}

function readLocal(key,fallback){
  try{
    const value=localStorage.getItem("neuropulse-"+key);
    return value?JSON.parse(value):fallback;
  }catch{return fallback;}
}

function writeLocal(key,value){
  try{
    localStorage.setItem("neuropulse-"+key,JSON.stringify(value));
    return true;
  }catch{return false;}
}

function drawChart(id,values,title){
  const canvas=$(id);
  if(!canvas||!values.length)return;
  const ctx=canvas.getContext("2d");
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#f6faf7";
  ctx.fillRect(0,0,w,h);
  const min=Math.min(...values),max=Math.max(...values);
  const range=Math.max(1,max-min);
  const left=58,right=w-25,top=35,bottom=h-45;
  ctx.strokeStyle="#dbe8df";
  ctx.lineWidth=1;
  for(let i=0;i<5;i++){
    const y=top+(bottom-top)*i/4;
    ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();
  }
  ctx.strokeStyle="#176b54";
  ctx.lineWidth=3;
  ctx.beginPath();
  values.forEach((value,i)=>{
    const x=left+(right-left)*i/Math.max(1,values.length-1);
    const y=bottom-(value-min)/range*(bottom-top);
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.stroke();
  ctx.fillStyle="#60776b";
  ctx.font="15px Arial";
  ctx.fillText(title,left,22);
  ctx.fillText(max.toFixed(1),6,top+5);
  ctx.fillText(min.toFixed(1),6,bottom);
  ctx.fillText("Measurement sequence",left,bottom+30);
}

function updateDashboard(){
  const last=readings.at(-1);
  if(!last)return;
  $("heartRate").textContent=last.heartRate;
  $("temperature").textContent=last.temperature.toFixed(2);
  $("spo2").textContent=last.spo2;
  $("gsr").textContent=last.gsr;
  drawChart("heartChart",readings.map(r=>r.heartRate),"Heart rate (bpm)");
  drawChart("temperatureChart",readings.map(r=>r.temperature),"Temperature (C)");
}

function selectPatient(id){
  selected=patients.find(p=>p.id===id)||patients[0];
  $("patientSelect").value=selected.id;
  readings=generateReadings(selected.seed);
  updateDashboard();
  renderDoctor();
}

function renderDoctor(){
  const directory=$("patientDirectory");
  directory.replaceChildren();
  patients.forEach(patient=>{
    const button=document.createElement("button");
    button.className="person"+(patient.id===selected.id?" active":"");
    button.textContent=patient.name+" | Age "+patient.age;
    button.onclick=()=>selectPatient(patient.id);
    directory.appendChild(button);
  });
  const last=readings.at(-1);
  $("doctorSummary").textContent=
    selected.name+" | Heart rate: "+last.heartRate+
    " bpm | Temperature: "+last.temperature+
    " C | SpO2: "+last.spo2+"% | GSR: "+last.gsr+" raw units.";
  $("doctorNote").value=readLocal("doctor-note-"+selected.id,"");
}

function exportCsv(){
  const columns=["step","heartRate","temperature","spo2","gsr"];
  const rows=[columns.join(",")];
  readings.forEach(row=>rows.push(columns.map(key=>row[key]).join(",")));
  const blob=new Blob([rows.join("\r\n")+"\r\n"],{type:"text/csv"});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=url;
  anchor.download="neuropulse_synthetic_readings.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function renderAppointments(){
  const list=$("appointmentList");
  list.replaceChildren();
  if(!appointments.length){
    list.textContent="No demonstration appointments scheduled.";
    return;
  }
  appointments.forEach(item=>{
    const row=document.createElement("div");
    row.className="appointment";
    row.textContent=item.patient+" | "+item.type+" | "+item.date+" "+item.time;
    list.appendChild(row);
  });
}

function navigate(){
  const pages=["home","patient","doctor","sensors","appointments","research"];
  const hash=location.hash.slice(1);
  const current=pages.includes(hash)?hash:"home";
  document.querySelectorAll(".page").forEach(page=>{
    page.hidden=page.id!==current;
  });
  if(current==="patient")updateDashboard();
  if(current==="doctor")renderDoctor();
  if(current==="sensors"){
    drawChart("sensorChart",readings.map(r=>r.heartRate),"Synthetic heart rate");
  }
}

function initialize(){
  for(const patient of patients){
    for(const id of ["patientSelect","appointmentPatient"]){
      const option=document.createElement("option");
      option.value=patient.id;
      option.textContent=patient.name;
      $(id).appendChild(option);
    }
  }

  $("patientSelect").onchange=event=>selectPatient(event.target.value);

  $("nextReading").onclick=()=>{
    const next=generateReadings(selected.seed+readings.length,1)[0];
    next.step=readings.at(-1).step+1;
    readings.push(next);
    if(readings.length>48)readings.shift();
    updateDashboard();
  };

  $("saveCheckin").onclick=()=>{
    const ok=writeLocal("checkin-"+selected.id,{
      mood:$("mood").value,
      note:$("checkinNote").value
    });
    $("checkinStatus").textContent=ok?"Saved in this browser.":"Browser storage unavailable.";
  };

  $("saveDoctorNote").onclick=()=>{
    const ok=writeLocal("doctor-note-"+selected.id,$("doctorNote").value);
    $("doctorStatus").textContent=ok?"Demonstration note saved.":"Browser storage unavailable.";
  };

  $("generateSignals").onclick=()=>{
    const profile=$("signalProfile").value;
    const seeds={baseline:400,activity:401,variation:402};
    readings=generateReadings(seeds[profile],24,profile);
    drawChart("sensorChart",readings.map(r=>r.heartRate),"Synthetic heart rate");
  };

  $("exportCsv").onclick=exportCsv;

  appointments=readLocal("appointments",[]);
  if(!Array.isArray(appointments))appointments=[];
  renderAppointments();

  $("appointmentForm").onsubmit=event=>{
    event.preventDefault();
    const date=$("appointmentDate").value;
    const time=$("appointmentTime").value;
    if(!date||!time)return;
    appointments.push({
      patient:$("appointmentPatient").selectedOptions[0].textContent,
      type:$("consultationType").value,
      date,time
    });
    const ok=writeLocal("appointments",appointments);
    $("appointmentStatus").textContent=ok?"Appointment saved in this browser.":"Browser storage unavailable.";
    renderAppointments();
  };

  $("clearAppointments").onclick=()=>{
    appointments=[];
    writeLocal("appointments",appointments);
    renderAppointments();
  };

  selectPatient(patients[0].id);
  window.addEventListener("hashchange",navigate);
  navigate();
}

document.addEventListener("DOMContentLoaded",initialize);
