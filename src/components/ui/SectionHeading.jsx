import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useLayoutEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from './Badge';
import { INTERACTIONS } from '../../config/interactions';
import { cn } from '../../utils/cn';
gsap.registerPlugin(ScrollTrigger);
export function SectionHeading({eyebrow,title,highlight,subtitle,align='left',as:Tag='h2',className,dark=false}){
  const ref=useRef(null),reduced=useReducedMotion();
  useLayoutEffect(()=>{
    if(reduced)return;
    const context=gsap.context(()=>gsap.fromTo('.title-word',{y:24,opacity:0,filter:'blur(5px)'},{y:0,opacity:1,filter:'blur(0px)',duration:INTERACTIONS.titleDuration,stagger:INTERACTIONS.titleStagger,ease:'expo.out',scrollTrigger:{trigger:ref.current,start:'top 88%',once:true}}),ref);
    return()=>context.revert();
  },[reduced,title,highlight]);
  return <div ref={ref} className={cn('max-w-3xl',align==='center'&&'mx-auto text-center',className)}>
    {eyebrow&&<Badge tone={dark?'light':'blue'} className="mb-5 !border-transparent !bg-transparent !px-0 !font-extrabold">{eyebrow}</Badge>}
    <Tag className={cn('font-heading text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-5xl',dark&&'text-white')} aria-label={[title,highlight].filter(Boolean).join(' ')}>
      {[{text:title,gradient:false},{text:highlight,gradient:true}].filter(part=>part.text).flatMap(part=>part.text.split(' ').map((word,index)=><span aria-hidden="true" key={`${part.gradient}-${index}`} className={cn('title-word mr-[0.25em] inline-block',part.gradient&&(dark?'text-brand-300':'text-gradient'))}>{word}</span>))}
    </Tag>
    {subtitle&&<p className={cn('mt-6 max-w-xl text-base leading-relaxed',dark?'text-white/55':'text-ink/70',align==='center'&&'mx-auto')}>{subtitle}</p>}
  </div>;
}
