import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Badge, GlassCard, IconBubble, Reveal, SectionHeading, Marquee } from '../ui';
import { SERVICES } from '../../config/content';
import { SceneSlot } from '../three/SceneSlot';
import { ServiceArtwork } from '../ui/ServiceArtwork';
import { MOTION } from '../../config/motion';
export function KeywordMarquee(){return <div className="border-y border-brand-100/60 bg-white/60 py-7"><Marquee label="Explore dental treatments" duration={38} items={['Implants','Invisalign','Root Canal','Teeth Whitening','Braces','Smile Makeover','Pediatric Dentistry']}/></div>;}
function ServiceCard({service,index}) {
  const [open,setOpen]=useState(false), reduced=useReducedMotion();
  return <Reveal className="h-full"><GlassCard tilt className={`service-card service-tone-${index%3} group flex h-full flex-col !p-7 lg:!p-9 ${service.wide?'bg-gradient-to-br from-white/80 to-brand-50/60':''}`}>
    <div className="flex items-start justify-between"><span className="transition-transform duration-500 ease-luxury group-hover:-rotate-3 group-hover:scale-105"><IconBubble icon={service.icon}/></span><span className="font-mono text-[10px] text-brand-300">0{index+1}</span></div>
    <div className="service-illustration relative mt-6 h-[160px] overflow-hidden rounded-2xl lg:h-[180px]"><ServiceArtwork variant={index}/></div><div className="relative mt-6"><p className="mb-2 text-[9px] font-semibold uppercase tracking-[.18em] text-brand-600">{service.kicker}</p><h3 className="text-2xl font-extrabold">{service.title}</h3><p className="mt-4 max-w-lg text-sm leading-7 text-ink/65">{service.description}</p></div>
    <div className="relative mt-auto flex items-center justify-between gap-3 pt-7"><Badge className="!text-[8px]">{service.tag}</Badge><button aria-label={`${open ? "Show less about" : "Learn more about"} ${service.title}`} aria-expanded={open} aria-controls={`service-${service.id}`} onClick={()=>setOpen(!open)} className="group/link inline-flex items-center gap-2 rounded-md py-2 text-[11px] font-semibold text-brand-700 transition-colors hover:text-brand-500 active:text-brand-800">{open?'Show less':'Learn more'}<ArrowUpRight size={15} className={`transition-transform ${open?'rotate-180':'group-hover/link:-translate-y-1 group-hover/link:translate-x-1'}`}/></button></div>
    <div id={`service-${service.id}`}><AnimatePresence initial={false}>{open && <motion.div initial={{height:reduced?'auto':0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:reduced?'auto':0,opacity:0}} transition={{duration:reduced?0:.3,ease:MOTION.ease}} className="overflow-hidden"><p className="mt-4 border-t border-brand-100 pt-4 text-xs leading-6 text-ink/70">{service.detail}</p></motion.div>}</AnimatePresence></div>
  </GlassCard></Reveal>;
}
export function Services(){return <section id="services" className="section-space relative isolate scroll-mt-28"><div id="services-3d" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"><SceneSlot kind="services"/></div><div className="page-container"><div className="mb-14 flex flex-wrap items-end justify-between gap-8"><SectionHeading eyebrow="Care for your smile" title="Every smile deserves" highlight="thoughtful care." subtitle="From everyday check-ups to a personalised treatment discussion, explore options for your smile. Your dentist will explain what is appropriate for you."/><span className="hidden border-l border-brand-100 pl-6 text-xs leading-6 text-ink/50 xl:block">Care for every chapter.<br/>One focus: your smile.</span></div><Reveal stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{SERVICES.map((service,index)=><ServiceCard key={service.id} service={service} index={index}/>)}</Reveal></div></section>;}
