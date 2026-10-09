import { site } from '../config/site.js';
import { CONTACT } from '../config/contact.js';
export function appointmentPayload(values){return Object.fromEntries(Object.entries(values).map(([key,value])=>[key,typeof value==='string'?value.trim():value]));}
export function appointmentMailto(values){
  const data=appointmentPayload(values);
  const body=`Dental appointment request\n\nName: ${data.fullName}\nPhone: ${site.countryCode} ${data.phone}\nEmail: ${data.email||'Not provided'}\nTreatment: ${data.service}\nPreferred date: ${data.appointmentDate}\nPreferred time: ${data.timeSlot}\nMessage: ${data.message||'—'}\n\nConsent to contact: Yes\nAppointment subject to clinic confirmation.`;
  return `${site.emailHref}?subject=${encodeURIComponent('Dental appointment request — '+site.name)}&body=${encodeURIComponent(body)}`;
}
export async function submitAppointment(values,endpoint=site.formEndpoint){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),CONTACT.requestTimeout);
  try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...appointmentPayload(values),_subject:'Dental appointment request'}),signal:controller.signal});if(!response.ok)throw new Error('Please try again, or contact us directly.');}
  finally{clearTimeout(timeout);}
}
