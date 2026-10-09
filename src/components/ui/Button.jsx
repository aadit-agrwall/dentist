import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { INTERACTIONS } from '../../config/interactions';
import { MOTION } from '../../config/motion';
import { useFinePointer } from '../../hooks/useFinePointer';
import { cn } from '../../utils/cn';
const variants = {
  primary:'bg-forest text-white shadow-glass hover:bg-brand-700',
  outline:'border border-brand-200 bg-white/40 text-brand-700 hover:border-brand-400 hover:bg-brand-50',
  ghost:'text-brand-700 hover:bg-brand-100/70',
  light:'bg-lime text-forest shadow-glass hover:bg-white',
};
const sizes = { sm:'px-5 py-3 text-xs', md:'px-7 py-4 text-sm', lg:'px-8 py-5 text-base' };
export function Button({ children, variant='primary', size='md', icon=ArrowUpRight, href, disabled=false, className, onClick, ...props }) {
  const ref = useRef(null);
  const [ripples,setRipples]=useState([]);
  const rippleId=useRef(0);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, MOTION.spring), y = useSpring(my, MOTION.spring);
  useEffect(() => {
    if (!finePointer || reduced || disabled) return;
    // Listen beyond the button boundary to attract within the requested 80px radius.
    const move = (event) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(Math.max(Math.abs(dx)-rect.width/2,0), Math.max(Math.abs(dy)-rect.height/2,0));
      // Measure the stationary wrapper: the animated button must not chase its own bounds.
      const attraction = Math.max(0, 1 - distance / MOTION.magneticRadius);
      const clamp = value => Math.max(-MOTION.magneticLimit, Math.min(MOTION.magneticLimit, value));
      const focused = ref.current.contains(document.activeElement);
      mx.set(focused ? 0 : clamp(dx * MOTION.magneticStrength * attraction));
      my.set(focused ? 0 : clamp(dy * MOTION.magneticStrength * attraction));
    };
    const reset = () => { mx.set(0); my.set(0); };
    window.addEventListener('pointermove', move, { passive:true });
    document.addEventListener('pointerleave', reset);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', reset); reset(); };
  }, [finePointer, reduced, disabled, mx, my]);
  const Tag = href && !disabled ? motion.a : motion.button;
  const Icon = icon;
  return <span ref={ref} className="inline-flex" onFocusCapture={()=>{mx.set(0);my.set(0);}}><motion.span className="inline-flex w-full" style={{ x, y }}>
    <Tag href={href && !disabled ? href : undefined} disabled={!href || disabled ? disabled : undefined} type={href ? undefined : 'button'} data-cursor="button" onClick={event=>{
      if(!reduced&&!disabled){const rect=event.currentTarget.getBoundingClientRect(),size=Math.max(rect.width,rect.height)*INTERACTIONS.rippleDiameterFactor,id=++rippleId.current;const keyboard=event.detail===0;setRipples(current=>[...current.slice(-2),{id,size,x:(keyboard?rect.width/2:event.clientX-rect.left)-size/2,y:(keyboard?rect.height/2:event.clientY-rect.top)-size/2}]);}
      onClick?.(event);
    }}
      whileHover={reduced || !finePointer || disabled ? undefined : { y:-MOTION.buttonLift, scale:MOTION.buttonHoverScale }} whileTap={reduced || disabled ? undefined : { scale:0.97 }} transition={MOTION.spring}
      className={cn('reactive-button group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-[14px] font-heading font-bold transition-colors duration-300 ease-luxury disabled:opacity-40', variants[variant], !reduced&&'motion-enabled', `button-${variant}`, sizes[size], className)} {...props}>
      {!reduced&&<span className="button-shine" aria-hidden="true"/>}
      {ripples.map(ripple=><motion.span key={ripple.id} aria-hidden="true" initial={{scale:0,opacity:.35}} animate={{scale:1,opacity:0}} transition={{duration:INTERACTIONS.rippleDuration,ease:'easeOut'}} onAnimationComplete={()=>setRipples(current=>current.filter(item=>item.id!==ripple.id))} className="pointer-events-none absolute rounded-full bg-current" style={{width:ripple.size,height:ripple.size,left:ripple.x,top:ripple.y}}/>)}
      <span className="button-label relative">{children}</span>
      {Icon && <Icon size={18} aria-hidden="true" className="relative shrink-0 transition-transform duration-300 ease-luxury group-hover:translate-x-1 group-hover:-translate-y-0.5 group-active:translate-x-0"/>}
    </Tag>
  </motion.span></span>;
}
