import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MOTION } from '../../config/motion';
export function ScrollProgress() {
  const {scrollYProgress} = useScroll();
  const smooth = useSpring(scrollYProgress,MOTION.spring);
  const reduced = useReducedMotion();
  return <motion.div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-aqua" style={{scaleX:reduced?scrollYProgress:smooth}}/>;
}
