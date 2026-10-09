import { useEffect } from 'react';
import { useSiteMotion as useReducedMotion } from './useSiteMotion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from '../config/motion';
gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: MOTION.lenisDuration, smoothWheel: true, anchors: true });
    const tick = (seconds) => lenis.raf(seconds * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    ScrollTrigger.refresh();
    return () => { gsap.ticker.remove(tick); lenis.off('scroll', ScrollTrigger.update); lenis.destroy(); };
  }, [reduced]);
}
