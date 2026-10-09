import {test} from 'node:test';
import assert from 'node:assert/strict';
import {appointmentPayload,appointmentMailto,submitAppointment} from '../src/utils/appointment.js';
import {appointmentRules} from '../src/config/contact.js';
const values={fullName:' Demo Patient ',phone:'9876543210',email:'demo@example.com',service:'General Dentistry',appointmentDate:'2026-10-20',timeSlot:'Morning',message:'A visit & a question\nThank you!',consent:true,website:''};
test('mailto draft preserves entered information with URL-safe encoding',()=>{
  const url=new URL(appointmentMailto(values));assert.equal(url.pathname,'divineronny20@gmail.com');assert.match(url.searchParams.get('body'),/Message: A visit & a question\nThank you!/);assert.match(url.searchParams.get('body'),/Phone: \+91 9876543210/);assert.equal(appointmentPayload(values).fullName,'Demo Patient');assert.equal(appointmentPayload(values).consent,true);
});
test('appointment dates reject past or invalid dates and accept future dates',()=>{
  assert.equal(appointmentRules.appointmentDate.validate('2000-01-01'),'Please choose today or a future date.');
  assert.equal(appointmentRules.appointmentDate.validate('invalid'),'Please choose today or a future date.');
  assert.equal(appointmentRules.appointmentDate.validate('2099-01-01'),true);
});
test('configured endpoint receives JSON and failed responses reject',async()=>{
  const original=globalThis.fetch;let captured;
  try{
    globalThis.fetch=async (url,options)=>{captured={url,options};return{ok:true};};
    await submitAppointment(values,'https://example.com/appointment');assert.equal(captured.options.method,'POST');assert.equal(captured.options.headers.Accept,'application/json');assert.equal(JSON.parse(captured.options.body).phone,values.phone);assert.ok(captured.options.signal instanceof AbortSignal);
    globalThis.fetch=async()=>({ok:false});await assert.rejects(()=>submitAppointment(values,'https://example.com/appointment'));
  }finally{globalThis.fetch=original;}
});
