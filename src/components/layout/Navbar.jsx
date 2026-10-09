import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperience } from '../../context/Experience';
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUpRight, Phone, Mail, MessageCircle } from 'lucide-react';
import { MotionToggle } from '../ui/MotionToggle';
import { Brand } from '../ui/Brand';
import { Button } from '../ui';
import { NAV_LINKS } from '../../config/content';
import { site } from '../../config/site';
import { MOTION } from '../../config/motion';
import { cn } from '../../utils/cn';
const NAV = { shadowThreshold:50, directionThreshold:8, hideThreshold:160 };
export function Navbar() {
  const [active,setActive]=useState('home'), [hidden,setHidden]=useState(false), [scrolled,setScrolled]=useState(false), [open,setOpen]=useState(false);
  const {scrollY}=useScroll(), last=useRef(0), menu=useRef(null), toggle=useRef(null);
  const reduced=useReducedMotion(),{ready}=useExperience();
  useMotionValueEvent(scrollY,'change',value=>{
    setScrolled(value>NAV.shadowThreshold);
    if(Math.abs(value-last.current)>NAV.directionThreshold){setHidden(value>last.current && value>NAV.hideThreshold);last.current=value;}

  });
  useEffect(()=>{const triggers=NAV_LINKS.map(([id])=>ScrollTrigger.create({trigger:document.getElementById(id),start:'top 30%',end:'bottom 30%',onEnter:()=>setActive(id),onEnterBack:()=>setActive(id)}));ScrollTrigger.refresh();return()=>triggers.forEach(trigger=>trigger.kill());},[]);
  useEffect(()=>{
    if(!open)return;
    const previous=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    const focusTimer=requestAnimationFrame(()=>menu.current?.querySelector('a')?.focus());
    const keyboard=event=>{
      if(event.key==='Escape'){setOpen(false);return;}
      if(event.key==='Tab'){
        const elements=[...menu.current.querySelectorAll('a, button')];
        const first=elements[0], final=elements[elements.length-1];
        if(event.shiftKey && document.activeElement===first){event.preventDefault();final.focus();}
        else if(!event.shiftKey && document.activeElement===final){event.preventDefault();first.focus();}
      }
    };
    const resize=()=>{if(window.innerWidth>=1024)setOpen(false);};
    document.addEventListener('keydown',keyboard);window.addEventListener('resize',resize);
    return ()=>{cancelAnimationFrame(focusTimer);document.documentElement.style.overflow=previous;document.removeEventListener('keydown',keyboard);window.removeEventListener('resize',resize);toggle.current?.focus({preventScroll:true});};
  },[open]);
  const close=()=>{setOpen(false);setHidden(false);};
  return <>
    <a href="#main" className="fixed left-6 top-6 z-[90] -translate-y-24 rounded-full bg-forest px-6 py-3 text-sm text-white focus:translate-y-0">Skip to content</a>
    <motion.header initial={{y:reduced?0:-120}} animate={{y:(!ready||hidden&&!open)&&!reduced?-120:0}} transition={{duration:reduced?0:.4,ease:MOTION.ease}} className="fixed inset-x-0 top-4 z-40 px-3 sm:px-6">
      <div className={cn('mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-snow/95 px-4 py-3 transition-[background-color,box-shadow,backdrop-filter] duration-500 sm:px-6',scrolled?'bg-white/85 shadow-glass backdrop-blur-2xl':'bg-white/65 shadow-[0_8px_40px_rgba(18,49,38,.04)] backdrop-blur-xl')}>
        <Brand/>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">{NAV_LINKS.map(([id,label])=><a key={id} href={`#${id}`} aria-current={active===id?'location':undefined} className={cn('group relative rounded-full px-3 py-2.5 text-[11px] font-medium transition-colors active:text-brand-800',active===id?'text-brand-700':'text-ink/70 hover:text-brand-600')}>
          {active===id && <motion.span layoutId="active-navigation" transition={reduced?{duration:0}:MOTION.spring} className="absolute inset-0 rounded-full border border-brand-100/60 bg-brand-50"/>}<span className="relative">{label}<span className="absolute -bottom-1 left-1/2 h-px w-full origin-center -translate-x-1/2 scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"/></span>
        </a>)}</nav>
        <MotionToggle/><div className="hidden sm:block"><Button href="#contact" size="sm">Book a Visit</Button></div>
        <button ref={toggle} aria-label="Open navigation menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(true)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full text-forest transition-colors hover:bg-brand-50 active:bg-brand-100 lg:hidden"><span className="h-[1.5px] w-5 bg-current"/><span className="h-[1.5px] w-5 bg-current"/></button>
      </div>
    </motion.header>
    <AnimatePresence>{open && <motion.div ref={menu} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation menu" data-lenis-prevent initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.25}} className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-snow/95 p-6 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-between"><Brand/><button onClick={close} aria-label="Close navigation menu" className="relative h-11 w-11 rounded-full bg-brand-50 transition-colors hover:bg-brand-100 active:bg-brand-200"><motion.span initial={{rotate:0,y:-3}} animate={{rotate:45,y:0}} className="absolute left-3 top-1/2 h-px w-5 bg-forest"/><motion.span initial={{rotate:0,y:3}} animate={{rotate:-45,y:0}} className="absolute left-3 top-1/2 h-px w-5 bg-forest"/></button></div>
      <motion.nav aria-label="Mobile navigation" initial="hidden" animate="visible" variants={{visible:{transition:{staggerChildren:reduced?0:MOTION.stagger}}}} className="my-auto space-y-2 py-8">{NAV_LINKS.map(([id,label],index)=><motion.a key={id} href={`#${id}`} onClick={close} variants={{hidden:{opacity:0,y:reduced?0:20},visible:{opacity:1,y:0,transition:{duration:reduced?0:.3}}}} className="reactive-nav flex items-center justify-between rounded-2xl px-3 py-2 font-heading text-3xl font-bold text-forest transition-colors hover:bg-brand-50 hover:text-brand-600 active:bg-brand-100"><span><span className="mr-5 align-middle font-body text-xs font-normal text-brand-400">0{index+1}</span>{label}</span><ArrowUpRight size={22}/></motion.a>)}</motion.nav>
      <div className="space-y-4 border-t border-brand-100 pt-6"><Button href="#contact" onClick={close}>Request an appointment</Button><a href={site.phoneHref} className="flex items-center gap-3 rounded text-sm hover:text-brand-600 active:text-brand-800"><Phone size={16}/>{site.phone}</a><a href={site.emailHref} className="flex items-center gap-3 break-all rounded text-sm hover:text-brand-600 active:text-brand-800"><Mail size={16}/>{site.email}</a><a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded text-sm hover:text-brand-600 active:text-brand-800"><MessageCircle size={16}/>Chat on WhatsApp</a></div>
    </motion.div>}</AnimatePresence>
  </>;
}
