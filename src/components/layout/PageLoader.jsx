import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../context/Experience';
const LOADER={deadline:3000,wipe:.7};
export function PageLoader(){
  const {ready,finish}=useExperience(),[progress,setProgress]=useState(20),reduced=useReducedMotion();
  useEffect(()=>{
    let cancelled=false,sceneReady=false,fontsReady=false;
    const heroHost=document.querySelector('#hero-3d');
    const needsHero=(!location.hash||location.hash==='#home')&&heroHost?.getBoundingClientRect().top<window.innerHeight;
    const complete=()=>{if(!cancelled&&fontsReady&&(!needsHero||sceneReady)){setProgress(100);finish();}};
    const scene=()=>{sceneReady=true;complete();};
    const assets=event=>{if(!cancelled)setProgress(current=>Math.max(current,Math.min(95,75+event.detail*.2)));};
    window.addEventListener('clinical-scene-ready',scene);window.addEventListener('clinical-assets-progress',assets);
    Promise.all([document.fonts?.ready||Promise.resolve(),Promise.resolve()]).then(()=>{if(cancelled)return;fontsReady=true;setProgress(current=>Math.max(current,75));const hero=document.querySelector('[data-scene-state="ready"], [data-scene-state="fallback"]');sceneReady=!!hero;complete();});
    // Text remains usable if WebGL initialization is slow or unavailable.
    const deadline=setTimeout(()=>{if(!cancelled){setProgress(100);finish();}},LOADER.deadline);
    return()=>{cancelled=true;clearTimeout(deadline);window.removeEventListener('clinical-scene-ready',scene);window.removeEventListener('clinical-assets-progress',assets);};
  },[]);
  return <AnimatePresence>{!ready&&<motion.div key="loader" role="status" aria-label="Preparing your experience" initial={{y:0}} exit={{y:reduced?0:'-100%',opacity:reduced?0:1}} transition={{duration:reduced?0:LOADER.wipe,ease:[.22,1,.36,1]}} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
    <div aria-hidden="true" className="loader-ring mb-10 h-16 w-16 rounded-full"/><div role="progressbar" aria-label="Page preparation" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="h-1 w-40 overflow-hidden rounded-full bg-brand-50"><motion.div className="h-full bg-gradient-aqua" animate={{width:`${progress}%`}} transition={{duration:reduced?0:.25}}/></div><p className="mt-4 font-heading text-xs font-semibold tabular-nums text-brand-600">{Math.round(progress)}%</p><span className="sr-only">Preparing your experience</span>
  </motion.div>}</AnimatePresence>;
}
