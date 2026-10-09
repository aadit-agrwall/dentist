import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useLayoutEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { ArrowUpRight, LoaderCircle, Mail, RotateCcw } from 'lucide-react';
import { Button, Badge } from '../ui';
import { FloatingField } from './FloatingField';
import { AnimatedSelect } from './AnimatedSelect';
import { SERVICES } from '../../config/content';
import { CONTACT, appointmentRules } from '../../config/contact';
import { site } from '../../config/site';
import { appointmentMailto, submitAppointment } from '../../utils/appointment';
const INITIAL={fullName:'',phone:'',email:'',service:'',appointmentDate:'',timeSlot:'',message:'',consent:false,website:''};
function Confirmation({phone,draft,mailto,onReset,reduced}){
  const ref=useRef(null);
  return <motion.div ref={ref} tabIndex={-1} role="status" initial={{opacity:0,y:reduced?0:12}} animate={{opacity:1,y:0}} onAnimationComplete={()=>{ref.current?.focus({preventScroll:true});ref.current?.scrollIntoView({block:'center',behavior:'auto'});}} className="relative py-12 text-center outline-none">
    <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-brand-100 bg-gradient-to-br from-brand-50 to-white shadow-soft-glow">
      {!draft&&!reduced&&Array.from({length:CONTACT.confettiCount},(_,index)=><motion.span key={index} aria-hidden="true" className={`absolute h-2 w-1 rounded-full ${index%2?'bg-aqua':'bg-brand-400'}`} initial={{x:0,y:0,opacity:0}} animate={{x:Math.cos(index/CONTACT.confettiCount*Math.PI*2)*110,y:Math.sin(index/CONTACT.confettiCount*Math.PI*2)*110,opacity:[0,1,0],rotate:index*35}} transition={{duration:1.3,delay:.15}}/>)}
      {draft?<Mail size={32} className="text-brand-600"/>:<svg viewBox="0 0 60 60" className="h-14 w-14" aria-hidden="true"><motion.path d="M14 31l11 11L47 19" fill="none" stroke="#286248" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{pathLength:reduced?1:0}} animate={{pathLength:1}} transition={{duration:reduced?0:.7}}/></svg>}
    </div>
    <Badge>{draft?'One last step':'Your next chapter starts here'}</Badge><h3 className="mt-6 text-3xl font-extrabold">{draft?'Your appointment email is ready.':'Your request has been received.'}</h3>
    <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-ink/70">{draft?'Send the email draft to request your visit. Your appointment is not booked until the clinic confirms it.':`The clinic will contact you to confirm availability on ${site.countryCode} ${phone}.`}</p>
    {draft&&<div className="mt-8"><Button href={mailto} icon={Mail}>Open email draft</Button><p className="mt-4 text-xs text-ink/60">Or call <a className="reactive-link text-brand-600" href={site.phoneHref}>{site.phone}</a>.</p></div>}
    <button type="button" onClick={onReset} className="mt-8 inline-flex items-center gap-2 rounded-md p-2 text-xs text-brand-600 transition-colors hover:bg-brand-50 active:bg-brand-100"><RotateCcw size={13}/>{draft?'Edit your details':'Request another visit'}</button>
  </motion.div>;
}
export function AppointmentForm(){
  const {register,control,handleSubmit,watch,reset,formState:{errors,isSubmitting,submitCount}}=useForm({defaultValues:INITIAL,mode:'onChange',reValidateMode:'onChange',shouldFocusError:false});
  const values=watch(),[result,setResult]=useState(null),[failure,setFailure]=useState(''),[sending,setSending]=useState(false),[invalidTarget,setInvalidTarget]=useState(null),reduced=useReducedMotion(),animation=useAnimationControls();
  useLayoutEffect(()=>{
    if(!invalidTarget)return;const first=document.getElementById(`appointment-${invalidTarget.name}`);
    first?.focus({preventScroll:true});first?.scrollIntoView({block:'center',behavior:'auto'});
  },[invalidTarget]);
  const onSubmit=async data=>{
    if(data.website)return; // Bots never trigger a request or mail client.
    setFailure('');
    if(!site.formEndpoint){setResult({draft:true,phone:data.phone,mailto:appointmentMailto(data)});return;}
    setSending(true);
    try{await submitAppointment(data);setResult({draft:false,phone:data.phone});}
    catch(error){setFailure(error.name==='AbortError'?'That took a little too long. Your details are still here — please try again.':'We couldn’t send your request. Your details are still here — please retry or contact us directly.');}
    finally{setSending(false);}
  };
  const invalid=fields=>{setFailure('');setInvalidTarget({name:Object.keys(INITIAL).find(name=>fields[name])});if(!reduced)animation.start({x:[0,-5,5,-3,3,0],transition:{duration:CONTACT.shakeDuration}});};
  const field=(name,label,options={})=><FloatingField key={name} name={name} label={label} register={register} rules={appointmentRules[name]} error={errors[name]} value={values[name]} submitted={submitCount>0} required={!['message','email'].includes(name)} {...options}/>;
  return <motion.div data-invalid-target={invalidTarget?.name} animate={animation} className="glass appointment-panel relative p-6 sm:p-9 lg:p-10">
    <AnimatePresence mode="wait" initial={false}>{result?<Confirmation key="confirmation" {...result} reduced={reduced} onReset={()=>{if(!result.draft)reset(INITIAL);setResult(null);}}/>:<motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.2}}>
      <Badge dot>A friendly first step</Badge><h3 className="mt-6 text-2xl font-extrabold leading-tight sm:text-3xl">Request Your<br className="hidden sm:block"/> Dental Appointment</h3><p className="mb-8 mt-4 text-sm leading-7 text-ink/65">Tell us your preferred treatment, date, and time. The clinic will confirm availability before your visit.</p>
      <form noValidate onSubmit={handleSubmit(onSubmit,invalid)} aria-label="Dental appointment request" aria-busy={isSubmitting}>
        <fieldset disabled={sending} className="m-0 min-w-0 border-0 p-0"><legend className="sr-only">Your appointment details</legend><div className="grid gap-4 sm:grid-cols-2">
          {field('fullName','Full Name',{autoComplete:'name'})}
          {field('phone','Phone',{type:'tel',inputMode:'numeric',autoComplete:'tel-national',prefix:site.countryCode})}
          {field('email','Email (optional)',{type:'email',inputMode:'email',autoComplete:'email'})}
          <Controller name="service" control={control} rules={appointmentRules.service} render={({field})=><AnimatedSelect name="service" label="Treatment / Consultation" options={SERVICES.map(service=>service.title)} field={field} error={errors.service} submitted={submitCount>0}/>}/>
          {field('appointmentDate','Preferred Date',{type:'date',autoComplete:'off'})}
          <Controller name="timeSlot" control={control} rules={appointmentRules.timeSlot} render={({field})=><AnimatedSelect name="timeSlot" label="Preferred Time" options={CONTACT.timeSlots} field={field} error={errors.timeSlot} submitted={submitCount>0}/>}/>
          {field('message','Message (optional)',{multiline:true})}
        </div>
        <div className="appointment-honeypot" aria-hidden="true"><label htmlFor="appointment-website">Leave this field empty</label><input id="appointment-website" {...register('website')} tabIndex={-1} autoComplete="off"/></div>
        <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-6 text-ink/70"><input id="appointment-consent" type="checkbox" {...register('consent',appointmentRules.consent)} aria-invalid={!!errors.consent} aria-describedby={errors.consent?'appointment-consent-error':undefined} className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-brand-200 accent-brand-600"/><span>I agree to be contacted by {site.name} by phone, email, or WhatsApp about my appointment request. *</span></label>
        {errors.consent&&<p id="appointment-consent-error" role="alert" className="mt-2 text-xs text-[#B44854]">{errors.consent.message}</p>}
        {failure&&<div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50/60 p-4 text-xs leading-6 text-[#B44854]">{failure}<a href={site.emailHref} className="ml-1 rounded underline underline-offset-4">Email us</a>.</div>}
        <div className="mt-7"><Button type="submit" disabled={isSubmitting} icon={isSubmitting?LoaderCircle:ArrowUpRight} className={`w-full !text-sm ${isSubmitting?'appointment-submitting':''}`}>{isSubmitting?'Sending your request…':failure?'Try sending again':'Request My Appointment'}</Button></div>
        <p className="mt-4 text-center text-[10px] leading-5 text-ink/50">{site.formEndpoint?'Your appointment is confirmed only after the clinic contacts you.':'Your request will open as an email draft. Send it to complete your request.'}</p>
        </fieldset>
      </form>
    </motion.div>}</AnimatePresence>
  </motion.div>;
}
