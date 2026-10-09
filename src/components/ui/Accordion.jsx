import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MOTION } from '../../config/motion';
export function Accordion({items,defaultOpen=-1}) {
  const [open,setOpen] = useState(defaultOpen);
  const id = useId();
  const reduced = useReducedMotion();
  return <div className="divide-y divide-brand-100">{items.map((item,index)=><div key={item.id || item.title}>
    <h3><button id={`${id}-trigger-${index}`} aria-expanded={open===index} aria-controls={`${id}-panel-${index}`} onClick={()=>setOpen(open===index?-1:index)} data-cursor="button" className="flex w-full items-center justify-between gap-6 rounded-lg py-6 text-left font-heading text-sm font-bold text-forest transition-colors hover:text-brand-600 active:text-brand-800">
      {item.title}<Plus size={18} className={`shrink-0 transition-transform ${open===index?'rotate-45 text-brand-500':''}`} aria-hidden="true"/></button></h3>
    <div id={`${id}-panel-${index}`} role="region" aria-labelledby={`${id}-trigger-${index}`}>
      <AnimatePresence initial={false}>{open===index && <motion.div key="content" initial={{height:reduced?'auto':0,opacity:reduced?1:0}} animate={{height:'auto',opacity:1}} exit={{height:reduced?'auto':0,opacity:0}} transition={{duration:reduced?0:0.35,ease:MOTION.ease}} className="overflow-hidden"><div className="pb-6 pr-8 text-sm leading-relaxed text-ink/70">{item.content}</div></motion.div>}</AnimatePresence>
    </div>
  </div>)}</div>;
}
