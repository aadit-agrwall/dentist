import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
const STORAGE_KEY='dental-motion-preference';
const Experience=createContext({ready:true,finish:()=>{},reducedMotion:false,motionMode:'system',setMotionMode:()=>{}});
export function ExperienceProvider({children}){
  const [ready,setReady]=useState(false),systemReduced=useReducedMotion();
  const [motionMode,setMotionMode]=useState(()=>{try{const stored=localStorage.getItem(STORAGE_KEY);return ['full','reduced'].includes(stored)?stored:'system';}catch{return 'system';}});
  const reducedMotion=motionMode==='system'?!!systemReduced:motionMode==='reduced';
  const finish=useCallback(()=>setReady(true),[]);
  useEffect(()=>{
    document.documentElement.dataset.motion=reducedMotion?'reduced':'full';
    try{if(motionMode==='system')localStorage.removeItem(STORAGE_KEY);else localStorage.setItem(STORAGE_KEY,motionMode);}catch{/* Storage is optional in private browsing. */}
    return()=>{delete document.documentElement.dataset.motion;};
  },[motionMode,reducedMotion]);
  const value=useMemo(()=>({ready,finish,reducedMotion,motionMode,setMotionMode}),[ready,finish,reducedMotion,motionMode]);
  return <Experience.Provider value={value}>{children}</Experience.Provider>;
}
export const useExperience=()=>useContext(Experience);
