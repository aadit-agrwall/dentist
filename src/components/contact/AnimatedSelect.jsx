import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { MOTION } from '../../config/motion';
/** Select-only combobox: arrow navigation, Home/End, typeahead, Escape and Tab. */
export function AnimatedSelect({name,label,options,field,error,submitted}){
  const [open,setOpen]=useState(false),[active,setActive]=useState(0),root=useRef(null),reduced=useReducedMotion();
  const id=`appointment-${name}`,selected=options.indexOf(field.value);
  useEffect(()=>{if(!open)return;const close=event=>{if(!root.current?.contains(event.target))setOpen(false);};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[open]);
  const choose=index=>{field.onChange(options[index]);field.onBlur();setOpen(false);root.current.querySelector('button').focus();};
  const show=()=>{setActive(Math.max(0,selected));setOpen(true);};
  return <div ref={root} className="relative" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget)){setOpen(false);field.onBlur();}}}>
    <label id={`${id}-label`} className="sr-only">{label}</label>
    <button type="button" ref={field.ref} id={id} role="combobox" aria-required="true" aria-labelledby={`${id}-label`} aria-controls={`${id}-options`} aria-expanded={open} aria-haspopup="listbox" aria-activedescendant={open?`${id}-option-${active}`:undefined} aria-invalid={!!error} aria-describedby={error?`${id}-error`:undefined} onClick={()=>open?setOpen(false):show()} onKeyDown={event=>{
      if(['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(event.key)){event.preventDefault();if(!open){show();return;}if(event.key==='Enter'||event.key===' ')choose(active);else if(event.key==='Home')setActive(0);else if(event.key==='End')setActive(options.length-1);else setActive(current=>(current+(event.key==='ArrowDown'?1:-1)+options.length)%options.length);}
      else if(event.key==='Escape'){event.preventDefault();setOpen(false);}else if(event.key==='Tab')setOpen(false);else if(event.key.length===1){const match=options.findIndex(option=>option.toLowerCase().startsWith(event.key.toLowerCase()));if(match>=0){setActive(match);if(!open)setOpen(true);}}
    }} className={`appointment-field relative flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl px-4 text-left text-base outline-none ${error?'is-invalid':''}`}>
      <span className="min-w-0"><span className={`block text-ink/60 ${field.value?'text-[11px]':''}`}>{label} *</span>{field.value&&<span className="mt-1 block truncate text-sm text-forest">{field.value}</span>}</span><ChevronDown size={17} className={`shrink-0 text-brand-500 transition-transform ${open?'rotate-180':''}`}/>
    </button>
    <AnimatePresence>{open&&<motion.ul id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`} initial={{opacity:0,y:reduced?0:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-6}} transition={{duration:reduced?0:.18,ease:MOTION.ease}} className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-64 overflow-auto rounded-2xl border border-brand-100 bg-white p-2 shadow-glass" data-lenis-prevent>
      {options.map((option,index)=><li key={option} id={`${id}-option-${index}`} role="option" aria-selected={field.value===option} onPointerMove={()=>setActive(index)} onPointerDown={event=>event.preventDefault()} onClick={()=>choose(index)} className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm transition-colors ${active===index?'bg-brand-50 text-brand-700':'text-ink hover:bg-brand-50'}`}>{option}{field.value===option&&<Check size={14}/>}</li>)}
    </motion.ul>}</AnimatePresence>
    {error&&<p id={`${id}-error`} role={submitted?'alert':undefined} className="mt-2 px-1 text-xs leading-5 text-[#B44854]">{error.message}</p>}
  </div>;
}
