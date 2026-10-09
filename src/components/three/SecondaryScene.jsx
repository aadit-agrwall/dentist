import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { THREE } from '../../config/motion';
const SCENES={services:lazy(()=>import('./ServicesParticles')),results:lazy(()=>import('./ResultsSculpture')),contact:lazy(()=>import('./ContactRings'))};
class SecondaryBoundary extends Component{
  state={failed:false};static getDerivedStateFromError(){return{failed:true};}
  render(){return this.state.failed?null:this.props.children;}
}
function ContextLoss({onLost}){
  const gl=useThree(state=>state.gl);
  useEffect(()=>{const lost=event=>{event.preventDefault();onLost();};gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,onLost]);return null;
}
function PointerBridge({mobile}){
  const {gl,pointer}=useThree();
  useEffect(()=>{
    if(mobile)return;
    const section=gl.domElement.closest('section');if(!section)return;
    const move=event=>{const rect=gl.domElement.getBoundingClientRect();pointer.set(Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1)),Math.max(-1,Math.min(1,-(event.clientY-rect.top)/rect.height*2+1)));};
    const leave=()=>pointer.set(0,0);
    section.addEventListener('pointermove',move,{passive:true});section.addEventListener('pointerleave',leave);
    return()=>{section.removeEventListener('pointermove',move);section.removeEventListener('pointerleave',leave);};
  },[mobile,gl,pointer]);return null;
}
const CAMERA={position:[0,0,6],fov:45};
export default function SecondaryScene({kind,visible}){
  const [supported,setSupported]=useState(false),[lost,setLost]=useState(false),mobile=useMediaQuery('(max-width: 767px)');
  useEffect(()=>{const probe=document.createElement('canvas');try{const gl=probe.getContext('webgl2',{failIfMajorPerformanceCaveat:true});setSupported(!!gl);gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{setSupported(false);}},[]);
  const Scene=SCENES[kind];
  if(!supported||lost)return null;
  return <SecondaryBoundary><Canvas aria-hidden="true" dpr={mobile?1:THREE.dpr} frameloop={visible?'always':'never'} camera={CAMERA} gl={{alpha:true,antialias:false,powerPreference:'low-power'}} onCreated={({gl})=>gl.setClearColor('#000000',0)}><PointerBridge mobile={mobile}/><ContextLoss onLost={()=>setLost(true)}/><Suspense fallback={null}><Scene mobile={mobile}/></Suspense></Canvas></SecondaryBoundary>;
}
