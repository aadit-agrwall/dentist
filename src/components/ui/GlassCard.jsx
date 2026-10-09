import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MOTION } from '../../config/motion';
import { INTERACTIONS } from '../../config/interactions';
import { useFinePointer } from '../../hooks/useFinePointer';
import { cn } from '../../utils/cn';
export function GlassCard({children,className,tilt=false,onPointerMove,onPointerLeave,...props}){
  const bounds=useRef(null);
  const reduced=useReducedMotion(),fine=useFinePointer();
  const rawX=useMotionValue(0),rawY=useMotionValue(0),rotateX=useSpring(rawX,MOTION.spring),rotateY=useSpring(rawY,MOTION.spring);
  const reactive=tilt&&fine&&!reduced;
  return <motion.div data-cursor="view" style={reactive?{rotateX,rotateY,transformPerspective:INTERACTIONS.perspective}:undefined} whileHover={reduced||!fine?undefined:{y:-MOTION.cardLift}} transition={MOTION.spring}
    onPointerEnter={event=>{bounds.current=event.currentTarget.getBoundingClientRect();}}
    onPointerMove={event=>{
      const rect=bounds.current||event.currentTarget.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
      event.currentTarget.style.setProperty('--mx',`${x}px`);event.currentTarget.style.setProperty('--my',`${y}px`);
      event.currentTarget.style.setProperty('--reflection',`${(x/rect.width)*140-20}%`);
      if(reactive){rawX.set(Math.max(-INTERACTIONS.tilt,Math.min(INTERACTIONS.tilt,-(y/rect.height-.5)*INTERACTIONS.tilt*2)));rawY.set(Math.max(-INTERACTIONS.tilt,Math.min(INTERACTIONS.tilt,(x/rect.width-.5)*INTERACTIONS.tilt*2)));}
      onPointerMove?.(event);
    }} onPointerLeave={event=>{bounds.current=null;rawX.set(0);rawY.set(0);onPointerLeave?.(event);}}
    className={cn('glass spotlight relative overflow-hidden p-8 transition-[border-color,box-shadow] duration-300 hover:border-brand-300 hover:shadow-soft-glow',tilt&&'tilt-card',className)} {...props}>{tilt&&<span aria-hidden="true" className="card-reflection"/>}{children}</motion.div>;
}
