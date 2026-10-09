import { Pause, Play } from 'lucide-react';
import { useExperience } from '../../context/Experience';
export function MotionToggle(){
  const {reducedMotion,setMotionMode}=useExperience();
  const Icon=reducedMotion?Play:Pause;
  return <button type="button" onClick={()=>setMotionMode(reducedMotion?'full':'reduced')} aria-label={reducedMotion?'Enable animations':'Pause animations'} aria-pressed={!reducedMotion} title={reducedMotion?'Enable animations':'Pause animations'} className="motion-toggle flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white/60 px-3 text-[10px] font-semibold text-brand-700 transition-colors hover:border-brand-500 hover:bg-lime active:bg-brand-100"><Icon size={14}/><span className="hidden xl:inline">Motion {reducedMotion?'off':'on'}</span></button>;
}
