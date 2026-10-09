import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { consumeLogoShine } from '../../utils/shine';
import { useExperience } from '../../context/Experience';
import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';

import { Sparkles as SparkleIcon } from 'lucide-react';
import { MathUtils, PCFSoftShadowMap, Vector3 } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Tooth } from './Tooth';
import { advanceScroll } from './sceneMotion.js';
import { OrbitingElements } from './OrbitingElements';
import { Sparkles, StarTextureProvider } from './Sparkles';
import { Lights } from './Lights';
import { Effects } from './Effects';
import { SceneFallback } from './SceneFallback';
import { useSceneVisibility } from '../../hooks/useSceneVisibility';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { HERO_SCENE as CONFIG } from '../../config/heroScene';
import { THREE } from '../../config/motion';
gsap.registerPlugin(ScrollTrigger);
const CAMERA_OPTIONS={position:CONFIG.camera.position,fov:CONFIG.camera.fov,near:CONFIG.camera.near,far:CONFIG.camera.far};
class SceneErrorBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?<SceneFallback/>:this.props.children;}
}
function CameraRig({mobile,reduced,interaction,scroll,time}){
  useFrame(({camera,pointer},delta)=>{
    time.current+=Math.min(delta,.05);
    const dt=Math.min(delta,.05),parallax=!mobile&&!reduced&&interaction.current.hovered?CONFIG.camera.parallax:0;
    // One frame-rate-independent filter drives tooth and camera together, in both scroll directions.
    scroll.current.progress=advanceScroll(scroll.current.progress,scroll.current.target,delta,reduced);
    camera.position.x=MathUtils.damp(camera.position.x,pointer.x*parallax,CONFIG.motion.damping,dt);
    camera.position.y=MathUtils.damp(camera.position.y,CONFIG.camera.position[1]+pointer.y*parallax,CONFIG.motion.damping,dt);
    camera.position.z=CONFIG.camera.position[2]+scroll.current.progress*CONFIG.camera.dolly;
    camera.lookAt(0,0,0);
  },-1);
  return null;
}
function ContextGuard({onFailure}){
  const gl=useThree(state=>state.gl);
  useEffect(()=>{
    const canvas=gl.domElement;
    const lost=event=>{event.preventDefault();onFailure();};
    canvas.addEventListener('webglcontextlost',lost);
    return()=>canvas.removeEventListener('webglcontextlost',lost);
  },[gl,onFailure]);
  return null;
}
function SceneReady({onReady}){const invalidate=useThree(state=>state.invalidate);useEffect(()=>{onReady();invalidate();},[onReady,invalidate]);return null;}
function World({mobile,reduced,interaction,scroll,intro,time,onHover,onShine,onReady,onFailure}){
  return <Suspense fallback={<Html center><div className="whitespace-nowrap rounded-full border border-brand-100 bg-white/80 px-5 py-3 text-xs text-brand-600">Polishing your experience…</div></Html>}><StarTextureProvider><ContextGuard onFailure={onFailure}/><CameraRig {...{mobile,reduced,interaction,scroll,time}}/><Lights {...{mobile,reduced,interaction,time}}/><Tooth {...{mobile,reduced,interaction,scroll,intro,time,onHover,onShine}}/><OrbitingElements {...{mobile,reduced,interaction,scroll,intro,time}}/><Sparkles {...{mobile,reduced,interaction,time}}/><Effects mobile={mobile} reduced={reduced}/><SceneReady onReady={onReady}/></StarTextureProvider></Suspense>;
}
export default function HeroScene(){
  const {ready:pageReady}=useExperience();
  const {progress:assetProgress}=useProgress();
  useEffect(()=>{window.dispatchEvent(new CustomEvent('clinical-assets-progress',{detail:assetProgress}));},[assetProgress]);
  const host=useRef(null),visible=useSceneVisibility(host),mobile=useMediaQuery('(max-width: 767px)'),reduced=!!useReducedMotion();
  const [supported,setSupported]=useState(null),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[hovered,setHovered]=useState(false);
  const introTimeline=useRef(null);
  const time=useRef(0),scroll=useRef({progress:0,target:0}),intro=useRef({tooth:reduced?1:0,spin:reduced?1:0,orbit:reduced?1:0});
  const interaction=useRef({hovered:false,burstAt:-Infinity,burstOrigin:new Vector3(0,.9,.3)});
  const onReady=useCallback(()=>{setReady(true);window.dispatchEvent(new Event('clinical-scene-ready'));},[]),onFailure=useCallback(()=>setFailed(true),[]);
  const onHover=useCallback(value=>{
    setHovered(value);
    window.dispatchEvent(new CustomEvent('clinical-cursor',{detail:value?'tooth':'default'}));
  },[]);
  const onShine=useCallback(()=>{
    if(reduced)return;
    interaction.current.burstAt=time.current;
    if(import.meta.env.DEV && host.current)host.current.dataset.shineCount=String(Number(host.current.dataset.shineCount||0)+1);
    interaction.current.burstOrigin.set(scroll.current.progress*CONFIG.motion.scrollRight,.9+Math.sin(time.current*CONFIG.motion.floatSpeed)*CONFIG.motion.floatAmplitude,.35);
  },[reduced]);
  useEffect(()=>{const shine=()=>{if(visible&&consumeLogoShine())onShine();};window.addEventListener('clinical-logo-shine',shine);return()=>window.removeEventListener('clinical-logo-shine',shine);},[onShine,visible]);
  useEffect(()=>{if(ready&&visible&&consumeLogoShine())onShine();},[ready,visible,onShine]);
  useEffect(()=>{
    // Three r170 requires WebGL 2. Release the probe immediately rather than retaining a spare context.
    const probe=document.createElement('canvas');let context;
    try{context=probe.getContext('webgl2',{failIfMajorPerformanceCaveat:true});setSupported(!!context);context?.getExtension('WEBGL_lose_context')?.loseContext();}catch{setSupported(false);}
  },[]);
  useLayoutEffect(()=>{
    if(!ready || !pageReady || failed || reduced){if(reduced){intro.current={tooth:1,spin:1,orbit:1};scroll.current.progress=0;scroll.current.target=0;}return;}
    const context=gsap.context(()=>{
      const timeline=gsap.timeline({paused:!visible});
      introTimeline.current=timeline;
      timeline.to(intro.current,{tooth:1,duration:CONFIG.motion.introDuration,ease:'power3.out'},0)
        .to(intro.current,{spin:1,duration:CONFIG.motion.introDuration,ease:'expo.out'},0)
        .to(intro.current,{orbit:1,duration:CONFIG.motion.orbitIntroDuration,ease:'expo.out'},.2);
    },host);
    return()=>{introTimeline.current=null;context.revert();};
  },[ready,pageReady,failed,reduced]);
  useEffect(()=>{if(introTimeline.current){if(visible)introTimeline.current.play();else introTimeline.current.pause();}},[visible,ready]);
  useLayoutEffect(()=>{
    if(!ready || failed || reduced)return;
    const context=gsap.context(()=>{
      const update=self=>{
        scroll.current.target=self.progress;
        if(interaction.current.hovered){interaction.current.hovered=false;onHover(false);}
        if(import.meta.env.DEV && host.current)host.current.dataset.scrollProgress=self.progress.toFixed(2);
      };
      const trigger=ScrollTrigger.create({trigger:document.getElementById('home'),start:'top top',end:'bottom top',onUpdate:update,onRefresh:update});
      // Initialize from the current position, including navigation back to the hero.
      update(trigger);
    },host);
    return()=>context.revert();
  },[ready,failed,reduced,onHover]);
  useEffect(()=>{if(!visible){interaction.current.hovered=false;onHover(false);}return()=>window.dispatchEvent(new CustomEvent('clinical-cursor',{detail:'default'}));},[visible,onHover]);
  const fallback=failed || supported===false;
  useEffect(()=>{if(fallback)window.dispatchEvent(new Event('clinical-scene-ready'));},[fallback]);
  return <div ref={host} data-scene-state={fallback?'fallback':ready?'ready':'loading'} data-scene-motion={reduced?'reduced':mobile?'mobile':'full'} data-scene-visible={visible} data-cursor={hovered?'tooth':'default'} className="absolute inset-0" onPointerLeave={()=>{interaction.current.hovered=false;onHover(false);}}>
    {supported===null && <SceneFallback loading/>}
    {fallback?<SceneFallback/>:supported && <SceneErrorBoundary onFailure={onFailure}><Canvas aria-label="Interactive glossy pearl-white molar with sage orbiting elements" role="img" dpr={mobile?[1,1.5]:THREE.dpr} frameloop={visible?'always':'never'} shadows={mobile?false:{type:PCFSoftShadowMap}} camera={CAMERA_OPTIONS} gl={{alpha:true,premultipliedAlpha:true,antialias:true,powerPreference:'high-performance'}} onCreated={({gl})=>gl.setClearColor('#000000',0)}>
      <World {...{mobile,reduced,interaction,scroll,intro,time,onHover,onShine,onReady,onFailure}}/>
    </Canvas></SceneErrorBoundary>}
    {!fallback && <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center"><button type="button" disabled={!ready||reduced} onClick={onShine} className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/60 px-4 py-2.5 text-[9px] font-medium text-brand-700 shadow-glass backdrop-blur-md transition-colors hover:border-brand-200 hover:bg-white active:bg-brand-50 disabled:opacity-50" aria-label={reduced?'Tooth sparkle animation disabled by reduced-motion preference':'Make the tooth shine'} aria-disabled={reduced||!ready}><SparkleIcon size={13}/>{reduced?'A little brilliance, at rest':'Click the tooth. A little brilliance.'}</button></div>}
  </div>;
}
