import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useLayoutEffect, useRef, useState } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading, Reveal } from '../ui';
import { PROCESS } from '../../config/content';
import { INTERACTIONS } from '../../config/interactions';
gsap.registerPlugin(ScrollTrigger);
const DRAW={duration:1.8,start:'top 75%',dashLength:1000};
const LINE='M0 15C100 15 100 45 165 45S240 15 330 15S420 45 500 45S580 15 665 15S760 45 835 45S920 15 1000 15';
export function Process(){
  const ref=useRef(null),reduced=useReducedMotion(),[active,setActive]=useState(-1),[hovered,setHovered]=useState(-1),[pinned,setPinned]=useState(false);
  useLayoutEffect(()=>{
    if(reduced){setActive(-1);setPinned(false);return;}
    const context=gsap.context(()=>{
      gsap.fromTo('.process-line',{strokeDashoffset:DRAW.dashLength},{strokeDashoffset:0,duration:DRAW.duration,ease:'expo.out',scrollTrigger:{trigger:ref.current,start:DRAW.start}});
      const media=gsap.matchMedia();
      media.add('(min-width: 1024px) and (min-height: 760px)',()=>{
        setPinned(true);
        const trigger=ScrollTrigger.create({trigger:ref.current.querySelector('.process-story'),start:'top 112px',end:()=>`+=${window.innerHeight*INTERACTIONS.processScrollScreens}`,pin:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>setActive(Math.min(PROCESS.length-1,Math.floor(self.progress*PROCESS.length))),onLeave:()=>setActive(PROCESS.length-1),onLeaveBack:()=>setActive(-1)});
        return()=>{trigger.kill();setPinned(false);setActive(-1);};
      });
      return()=>media.revert();
    },ref);
    return()=>context.revert();
  },[reduced]);
  const lit=hovered>=0?hovered:active;
  return <section id="process" ref={ref} data-process-pinned={pinned} className="section-space scroll-mt-28 border-t border-brand-100/50 bg-pearl/60"><div className="page-container process-story"><SectionHeading align="center" eyebrow="Your visit, explained" title="From your first hello" highlight="to ongoing care." subtitle="A clear, welcoming journey. Ask questions, understand your options, and take the next step with your dental team."/>
    <div className="relative mt-12"><svg viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute left-[12%] top-7 hidden h-16 w-[76%] lg:block"><path d={LINE} fill="none" stroke="#C7DACB" strokeWidth="1.5"/><path className="process-line" pathLength="1000" strokeDasharray="1000" d={LINE} fill="none" stroke="#3D7A60" strokeWidth="2"/>{[0,1,2,3].map(index=><path key={index} d={LINE} pathLength="1000" strokeDasharray="240 1000" strokeDashoffset={-index*250} stroke="#83B89D" strokeWidth="3" fill="none" className={`process-segment ${lit===index?'is-lit':''}`}/>)}</svg>
      <svg viewBox="0 0 10 1000" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute bottom-12 left-[27px] top-10 h-[calc(100%-80px)] w-0.5 lg:hidden"><path className="process-line" d="M5 0V1000" pathLength="1000" strokeDasharray="1000" stroke="#A1BFA9" strokeWidth="10"/>{[0,1,2,3].map(index=><path key={index} d="M5 0V1000" pathLength="1000" strokeDasharray="240 1000" strokeDashoffset={-index*250} stroke="#83B89D" strokeWidth="10" className={`process-segment ${lit===index?'is-lit':''}`}/>)}</svg>
      <Reveal stagger className="grid gap-8 lg:grid-cols-4">{PROCESS.map((step,index)=><Reveal key={step.title}><article onPointerEnter={()=>setHovered(index)} onPointerLeave={()=>setHovered(-1)} data-active-step={active===index} className={`process-card group relative flex gap-6 lg:block lg:text-center ${lit===index?'is-highlighted':''}`}><span className="process-number relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-snow font-heading text-lg font-bold text-brand-600 shadow-glass lg:mx-auto">0{index+1}</span><div className="process-body flex-1 rounded-3xl border border-white/80 bg-white/60 p-6 shadow-glass transition-all duration-500 lg:mt-6 lg:px-5"><p className="mb-3 text-[8px] font-semibold uppercase tracking-[.16em] text-brand-500">{step.note}</p><h3 className="text-xl font-extrabold">{step.title}</h3><p className="mt-4 text-sm leading-7 text-ink/65">{step.text}</p><ArrowUpRight size={16} className="link-icon mt-5 text-brand-300 lg:mx-auto"/></div></article></Reveal>)}</Reveal>
    </div><div className="mt-8 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[.14em] text-ink/40"><span>{pinned?'Scroll to follow the journey':'A considered process, step by step'}</span>{pinned&&<span className="text-brand-600">{Math.max(1,active+1)} / 4</span>}</div>
  </div></section>;
}
