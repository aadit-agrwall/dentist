import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import { useSceneVisibility } from '../../hooks/useSceneVisibility';
const SecondaryScene=lazy(()=>import('./SecondaryScene'));
/** Do not even download secondary WebGL code until the scene has entered view. */
export function SceneSlot({kind,className}){
  const ref=useRef(null),visible=useSceneVisibility(ref),[visited,setVisited]=useState(false),reduced=useReducedMotion();
  useEffect(()=>{if(visible)setVisited(true);},[visible]);
  return <div ref={ref} className={`absolute inset-0 ${className||''}`} data-secondary-scene={kind} data-scene-visible={visible} data-motion={reduced?'reduced':'full'}>
    <div className={`absolute inset-0 ${kind==='results'?'bg-gradient-glow opacity-30':'bg-gradient-glow opacity-10'}`} aria-hidden="true"/>
    {!reduced&&visited&&<Suspense fallback={null}><SecondaryScene kind={kind} visible={visible}/></Suspense>}
  </div>;
}
