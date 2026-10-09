import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { MOTION } from '../../config/motion';
const StaggerContext = createContext(false);
export function Reveal({ children, delay=0, stagger=false, className, ...props }) {
  const reduced = useReducedMotion();
  const inherited = useContext(StaggerContext);
  return <StaggerContext.Provider value={stagger || inherited}><motion.div className={className} initial={inherited ? undefined : "hidden"} whileInView={inherited ? undefined : "visible"} viewport={{once:true, amount:0.15}}
    variants={{ hidden:{opacity:reduced?1:0,y:reduced?0:MOTION.revealDistance,scale:reduced?1:.985,filter:reduced?'none':'blur(4px)'}, visible:{opacity:1,y:0,scale:1,filter:'blur(0px)',transition:{duration:reduced?0:MOTION.revealDuration,delay,ease:MOTION.ease,staggerChildren:stagger?MOTION.stagger:0}} }} {...props}>{children}</motion.div></StaggerContext.Provider>;
}
