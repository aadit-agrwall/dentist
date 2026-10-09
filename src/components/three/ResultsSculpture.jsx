import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, MathUtils } from 'three';
import { useScrollVelocity } from '../../hooks/useScrollVelocity';
import { INTERACTIONS } from '../../config/interactions';
export default function ResultsSculpture({mobile}){
  const ref=useRef(null),velocity=useScrollVelocity(),speed=useRef(0);
  const geometry=useMemo(()=>{
    const count=mobile?100:240,positions=[],colors=[];
    const blue=new Color('#3D7A60'),aqua=new Color('#83B89D');
    for(let i=0;i<count;i++){const progress=i/(count-1),angle=progress*Math.PI*7;for(let side=0;side<2;side++){positions.push(Math.cos(angle+side*Math.PI)*.8,(progress-.5)*3.8,Math.sin(angle+side*Math.PI)*.8);const color=side?blue:aqua;colors.push(color.r,color.g,color.b);}}
    const result=new BufferGeometry();result.setAttribute('position',new Float32BufferAttribute(positions,3));result.setAttribute('color',new Float32BufferAttribute(colors,3));return result;
  },[mobile]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  useFrame((_,delta)=>{const dt=Math.min(delta,.05);velocity.current=MathUtils.damp(velocity.current,0,2,dt);speed.current=MathUtils.damp(speed.current,.04+velocity.current*INTERACTIONS.scrollVelocityRotation,3,dt);ref.current.rotation.y+=speed.current*dt;});
  return <group ref={ref} position={[mobile?0:1.7,.4,-1]} rotation={[.1,0,-.28]}><points><primitive object={geometry} attach="geometry"/><pointsMaterial vertexColors size={mobile ? .027 : .034} transparent opacity={.35} depthWrite={false} blending={AdditiveBlending} sizeAttenuation/></points></group>;
}
