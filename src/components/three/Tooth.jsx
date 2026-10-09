import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, MeshPhysicalMaterial } from 'three';
import { HERO_SCENE as CONFIG } from '../../config/heroScene';
import { createCrownGeometry, createRootGeometry } from './toothGeometry';
import { CrownGlint } from './Sparkles';
export function Tooth({mobile,reduced,interaction,scroll,intro,time,onHover,onShine}){
  const root=useRef(null), hoverScale=useRef(1), phase=useRef(0), turn=useRef(-.3), hoverWeight=useRef(0), hitArea=useRef(null), celebration=useRef({angle:0,target:0,lastBurst:-Infinity});
  const crown=useMemo(()=>createCrownGeometry(mobile),[mobile]);
  const roots=useMemo(()=>[0,1,2].map(index=>createRootGeometry(index,mobile)),[mobile]);
  const material=useMemo(()=>new MeshPhysicalMaterial(CONFIG.material),[]);
  // Geometry and material are explicitly owned here; R3F must not dispose shared instances.
  useEffect(()=>()=>{crown.dispose();roots.forEach(geometry=>geometry.dispose());},[crown,roots]);
  useEffect(()=>()=>material.dispose(),[material]);
  useFrame((state,delta)=>{
    if(!root.current)return;
    const dt=Math.min(delta,.05), t=time.current, config=CONFIG.motion;
    phase.current+=dt*(reduced?config.reducedRotationSpeed:config.rotationSpeed);
    hoverWeight.current=MathUtils.damp(hoverWeight.current,interaction.current.hovered&&!reduced?1:0,config.damping,dt);
    hoverScale.current=MathUtils.damp(hoverScale.current,interaction.current.hovered&&!reduced?config.hoverScale:1,config.damping,dt);
    const age=t-interaction.current.burstAt;
    const pulse=!reduced && age>=0 && age<CONFIG.burst.pulseDuration ? Math.sin(age/CONFIG.burst.pulseDuration*Math.PI*2)*Math.exp(-age*5)*CONFIG.burst.pulseAmount:0;
    if(!reduced&&interaction.current.burstAt!==celebration.current.lastBurst){
      celebration.current.lastBurst=interaction.current.burstAt;
      if(Number.isFinite(interaction.current.burstAt))celebration.current.target+=Math.PI*2;
    }
    celebration.current.angle=MathUtils.damp(celebration.current.angle,reduced?0:celebration.current.target,config.clickSpinDamping,dt);
    // Normalize complete turns only once settled; the orientation stays visually identical.
    if(celebration.current.target>0&&Math.abs(celebration.current.target-celebration.current.angle)<.001){celebration.current.angle-=celebration.current.target;celebration.current.target=0;}
    const breathe=reduced?1:1+Math.sin(t*config.floatSpeed)*config.breathing;
    const scale=(reduced?1:intro.current.tooth)*hoverScale.current*breathe*MathUtils.lerp(1,config.scrollScale,scroll.current.progress);
    root.current.scale.set(scale*(1-pulse*.55),scale*(1+pulse),scale*(1-pulse*.55));
    root.current.position.set(scroll.current.progress*config.scrollRight,reduced?0:Math.sin(t*config.floatSpeed)*config.floatAmplitude+hoverWeight.current*config.hoverLift,0);
    const pointerEnabled=!mobile&&!reduced&&interaction.current.hovered;
    root.current.rotation.x=MathUtils.damp(root.current.rotation.x,.12+(pointerEnabled?-state.pointer.y*config.tilt:0),config.damping,dt);
    // Hover settles the idle sway; it never switches angular speed or restarts the phase.
    const idle = reduced ? Math.sin(phase.current) * .04 : Math.sin(phase.current) * MathUtils.lerp(.42,.14,hoverWeight.current);
    const targetTurn = -.3 + idle
      + (pointerEnabled ? state.pointer.x * config.tilt : 0)
      + (reduced ? 0 : (1 - intro.current.spin) * Math.PI * .65);
    turn.current = MathUtils.damp(turn.current, targetTurn, config.damping, dt);
    root.current.rotation.y = turn.current + scroll.current.progress * config.scrollTurn + celebration.current.angle;
    if(hitArea.current){
      // The raycast hull follows scroll, but never the floating/tilting enamel.
      hitArea.current.position.x=scroll.current.progress*config.scrollRight;
      hitArea.current.scale.set(.98,1.5,.85).multiplyScalar(MathUtils.lerp(1,config.scrollScale,scroll.current.progress));
    }
    root.current.rotation.z=MathUtils.damp(root.current.rotation.z,-.09+(pointerEnabled?-state.pointer.x*config.tilt*.6:0),config.damping,dt);
  });
  const over=event=>{
    event.stopPropagation();
    if(reduced||mobile||intro.current.tooth<.8||event.sourceEvent?.pointerType==='touch')return;
    interaction.current.hovered=true;onHover(true);
  };
  const out=()=>{interaction.current.hovered=false;onHover(false);};
  return <>
    {/* Invisible to every render pass, but raycastable. Stable bounds prevent hover oscillation. */}
    <mesh ref={hitArea} visible={false} position={[0,-.25,0]} scale={[.98,1.5,.85]} onPointerOver={over} onPointerOut={out} onClick={event=>{event.stopPropagation();onShine();}}>
      <sphereGeometry args={[1,24,16]}/><meshBasicMaterial/>
    </mesh>
    <group ref={root} name="procedural-molar" dispose={null}>
    <mesh name="molar-crown" geometry={crown} material={material} layers-mask={3} castShadow receiveShadow/>
    {roots.map((geometry,index)=><mesh key={index} name={`molar-root-${index+1}`} geometry={geometry} material={material} layers-mask={3} castShadow receiveShadow/>)}
    <CrownGlint time={time} reduced={reduced}/>
  </group></>;
}
