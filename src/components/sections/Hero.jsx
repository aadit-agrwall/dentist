import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useExperience } from '../../context/Experience';
import { useSceneVisibility } from '../../hooks/useSceneVisibility';
import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { ArrowUpRight, Phone, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Reveal } from '../ui';
import { SceneFallback } from '../three/SceneFallback';
import { site } from '../../config/site';
const HeroScene=lazy(()=>import('../three/HeroScene'));
const SHOWCASE_STATS=[['Family','All ages welcome'],['Personal','Individual care'],['Clear','Care explained']];
export function Hero(){
  const reduced=useReducedMotion(),{ready}=useExperience(),sceneHost=useRef(null),near=useSceneVisibility(sceneHost),[visited,setVisited]=useState(false);
  useEffect(()=>{if(near)setVisited(true);},[near]);
  return <section id="home" className="reference-hero relative isolate overflow-hidden pb-20 pt-36 lg:pb-24 lg:pt-40">
    <div className="page-container grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-16">
      <Reveal><p className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-brand-700"><span className="h-2 w-2 rounded-full bg-brand-600"/>A warm welcome to Pearl Dental · Demo</p>
        <motion.h1 aria-label="Healthy smiles. Thoughtful care. For every age." initial="hidden" animate={ready?'visible':'hidden'} variants={{hidden:{},visible:{transition:{staggerChildren:reduced?0:.12}}}} className="font-heading text-[clamp(3rem,5.8vw,5.5rem)] font-extrabold leading-[.98] tracking-[-.06em] text-forest">{['Healthy smiles.','Thoughtful care.','For every age.'].map((line,index)=><span key={line} aria-hidden="true" className="block overflow-hidden pb-2"><motion.span className={`block ${index===2?'text-brand-600':''}`} variants={{hidden:{y:reduced?0:'110%'},visible:{y:0,transition:{duration:reduced?0:.8,ease:[.22,1,.36,1]}}}}>{line}</motion.span></span>)}</motion.h1>
        <p className="mt-7 max-w-lg text-lg leading-[1.7] text-ink/70">From your first check-up to a conversation about your smile, we make room for your questions. Discover dental care that starts with you.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button href="#contact">Request an appointment</Button><Button href={site.phoneHref} variant="outline" icon={Phone}>Call the clinic</Button></div>
        <div className="mt-8 flex items-center gap-3"><div className="flex -space-x-2" aria-hidden="true">{['AM','PN','MS'].map(name=><span key={name} className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-snow bg-brand-100 text-[10px] font-bold text-brand-700">{name}</span>)}</div><div><div className="text-[10px] font-bold uppercase tracking-wider text-brand-700">A patient-first approach</div><p className="mt-1 text-[11px] text-ink">A friendly place for your family’s smiles.</p></div></div>
        <p className="mt-4 text-[9px] text-ink/60">Clinic presentation demo · Profile and reviews are placeholders.</p>
      </Reveal>
      <Reveal delay={.15}><div className="hero-showcase rounded-[30px] bg-forest p-5 text-white shadow-[0_25px_70px_-20px_rgba(23,63,43,.25)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold">Your smile. Our shared focus.</p><p className="mt-1 text-[10px] text-white/65">Thoughtful care, one visit at a time</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-2 text-[9px] font-extrabold text-forest"><ShieldCheck size={12}/>PATIENT FIRST</span></div>
        <div ref={sceneHost} id="hero-3d" aria-label="Interactive procedural tooth experience" className="hero-stage relative mt-5 min-h-[380px] overflow-hidden rounded-[22px] bg-[#DCE6D2] sm:min-h-[420px]"><Suspense fallback={<SceneFallback loading/>}>{visited?<HeroScene/>:<SceneFallback/>}</Suspense></div>
        <div className="mt-4 grid grid-cols-3 gap-2">{SHOWCASE_STATS.map(([value,label])=><div key={label} className="rounded-[13px] bg-white/[.08] px-3 py-4"><p className="font-heading text-lg font-extrabold text-white sm:text-xl">{value}</p><p className="mt-1 text-[9px] leading-4 text-white/70">{label}</p></div>)}</div>
        <div className="mt-4 flex items-center justify-between text-[9px] text-white/65"><span>Family dental care · Demo</span><a href="#services" className="inline-flex items-center gap-1 rounded px-1 py-1 text-lime transition-opacity hover:opacity-70">Explore our treatments<ArrowUpRight size={12}/></a></div>
      </div></Reveal>
    </div>
  </section>;
}
