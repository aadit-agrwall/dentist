import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '../../hooks/useFinePointer';
import { MOTION } from '../../config/motion';
export function CustomCursor() {
  const fine = useFinePointer(), reduced = useReducedMotion();
  const [mode,setMode] = useState('default'), [visible,setVisible] = useState(false);
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x,MOTION.spring), sy = useSpring(y,MOTION.spring);
  useEffect(()=>{
    if (!fine || reduced) return;
    const move = (event)=>{
      x.set(event.clientX); y.set(event.clientY); setVisible(true);
      const target = event.target.closest('[data-cursor], a, button');
      setMode(target?.dataset.cursor || (target?.tagName==='BUTTON'?'button':target?'view':'default'));
    };
    const hide = ()=>setVisible(false);
    const sceneMode = (event)=>setMode(event.detail);
    window.addEventListener('clinical-cursor',sceneMode);
    window.addEventListener('pointermove',move,{passive:true});
    document.addEventListener('pointerleave',hide); window.addEventListener('blur',hide);
    return ()=>{window.removeEventListener('clinical-cursor',sceneMode);window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',hide);window.removeEventListener('blur',hide);};
  },[fine,reduced,x,y]);
  if (!fine || reduced) return null;
  // Retain the native pointer for predictable text selection and keyboard accessibility.
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
    <motion.div style={{x,y,opacity:visible?1:0}} className="absolute"><span className="block h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600"/></motion.div>
    <motion.div style={{x:sx,y:sy,opacity:visible?1:0}} className="absolute">
      <motion.span animate={{width:mode==='tooth'?72:mode==='view'?64:mode==='button'?52:32,height:mode==='tooth'?72:mode==='view'?64:mode==='button'?52:32,backgroundColor:mode==='tooth'?'rgba(131,184,157,.1)':mode==='button'?'rgba(131,184,157,.12)':mode==='view'?'rgba(61,122,96,.08)':'rgba(61,122,96,0)',borderColor:mode==='tooth'||mode==='button'?'#83B89D':'#A1BFA9'}} transition={MOTION.spring} className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-semibold text-brand-700">{mode==='tooth'?'Shine':mode==='view'?'View':''}</motion.span>
    </motion.div>
  </div>;
}
