import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MOTION } from '../../config/motion';
export function GradientBlobs() {
  const {scrollYProgress} = useScroll();
  const y = useTransform(scrollYProgress,[0,1],[0,-MOTION.blobTravel]);
  const reverseY = useTransform(scrollYProgress,[0,1],[0,MOTION.blobTravel]);
  const reduced = useReducedMotion();
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <motion.div style={{y:reduced?0:y}} className="absolute -right-32 top-16 h-[600px] w-[600px]"><div className="h-full w-full animate-float-slow rounded-full bg-brand-200/25 blur-[100px]"/></motion.div>
    <motion.div style={{y:reduced?0:reverseY}} className="absolute -left-48 top-[600px] h-[500px] w-[500px]"><div className="h-full w-full animate-float rounded-full bg-champagne/20 blur-[100px]"/></motion.div>
  </div>;
}
