import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { HoverSparkles } from './HoverSparkles';
import { cn } from '../../utils/cn';
import { MOTION } from '../../config/motion';
export function Counter({value=0,prefix='',suffix='',decimals=0,duration=MOTION.counterDuration,className}) {
  const ref = useRef(null), visible = useInView(ref,{once:true});
  const reduced = useReducedMotion();
  const [count,setCount] = useState(0);
  useEffect(()=>{
    if (!visible) return;
    if (reduced) { setCount(value); return; }
    const animation = animate(0,value,{duration,ease:MOTION.ease,onUpdate:setCount});
    return ()=>animation.stop();
  },[visible,reduced,value,duration]);
  const format = (number)=>number.toLocaleString('en-IN',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
  return <span ref={ref} className={cn("reactive-number group/number relative inline-block",className)} aria-label={`${prefix}${format(value)}${suffix}`}><span aria-hidden="true">{prefix}{format(count)}{suffix}</span><HoverSparkles/></span>;
}
