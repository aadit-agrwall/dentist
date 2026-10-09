import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { INTERACTIONS } from '../../config/interactions';
export function Parallax({children,className,distance=INTERACTIONS.parallaxDistance}){
  const ref=useRef(null),reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const y=useTransform(scrollYProgress,[0,1],[-distance,distance]);
  return <motion.div ref={ref} className={className} style={{y:reduced?0:y}}>{children}</motion.div>;
}
