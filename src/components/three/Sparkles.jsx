import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles as DreiSparkles } from '@react-three/drei';
import { AdditiveBlending, CanvasTexture, Object3D, SRGBColorSpace, Vector3 } from 'three';
import { HERO_SCENE as CONFIG } from '../../config/heroScene';
const StarTextureContext=createContext(null);
export function StarTextureProvider({children}){
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
    const context=canvas.getContext('2d');
    const glow=context.createRadialGradient(64,64,0,64,64,62);glow.addColorStop(0,'rgba(255,255,255,.95)');glow.addColorStop(.2,'rgba(255,255,255,.3)');glow.addColorStop(1,'rgba(255,255,255,0)');context.fillStyle=glow;context.fillRect(0,0,128,128);
    context.beginPath();for(let point=0;point<8;point++){const angle=point*Math.PI/4-Math.PI/2,radius=point%2?10:52;const x=64+Math.cos(angle)*radius,y=64+Math.sin(angle)*radius;if(point===0)context.moveTo(x,y);else context.lineTo(x,y);}context.closePath();context.fillStyle='white';context.fill();
    const result=new CanvasTexture(canvas);result.colorSpace=SRGBColorSpace;return result;
  },[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <StarTextureContext.Provider value={texture}>{children}</StarTextureContext.Provider>;
}
export function StarSprite({color='white',scale=.25,...props}){
  const texture=useContext(StarTextureContext);
  return <sprite scale={[scale,scale,scale]} {...props}><spriteMaterial map={texture} color={color} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}/></sprite>;
}
function AnimatedGlint({time,reduced}){
  const ref=useRef(null),texture=useContext(StarTextureContext);
  useFrame(()=>{const scale=reduced ? .22 : .15+Math.pow(Math.sin(time.current*1.8)*.5+.5,5)*.18;ref.current.scale.setScalar(scale);});
  return <sprite ref={ref} position={[.48,1.04,.64]}><spriteMaterial map={texture} color="#FFFFFF" transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}/></sprite>;
}
// Keep the crown decoration attached to the tooth so its highlight follows every tilt.
export { AnimatedGlint as CrownGlint };
function ShineBurst({interaction,time,reduced}){
  const mesh=useRef(null),flash=useRef(null),texture=useContext(StarTextureContext);
  const object=useMemo(()=>new Object3D(),[]);
  const directions=useMemo(()=>Array.from({length:CONFIG.burst.count},(_,index)=>{
    const y=1-2*(index+.5)/CONFIG.burst.count,r=Math.sqrt(1-y*y),angle=index*Math.PI*(3-Math.sqrt(5));
    return new Vector3(Math.cos(angle)*r,y,Math.sin(angle)*r);
  }),[]);
  useFrame(({camera})=>{
    const age=time.current-interaction.current.burstAt, active=!reduced&&age>=0&&age<CONFIG.burst.duration;
    mesh.current.visible=active;flash.current.visible=active && age<CONFIG.burst.flashDuration;
    if(!active)return;
    flash.current.position.copy(interaction.current.burstOrigin);
    flash.current.scale.setScalar(.4+age*3);
    flash.current.material.opacity=Math.max(0,1-age/CONFIG.burst.flashDuration)*.3;
    for(let index=0;index<directions.length;index++){
      object.position.copy(interaction.current.burstOrigin).addScaledVector(directions[index],age*CONFIG.burst.speed);
      object.position.y-=age*age*CONFIG.burst.gravity;
      object.quaternion.copy(camera.quaternion);
      object.scale.setScalar((.065+(index%3)*.014)*Math.pow(1-age/CONFIG.burst.duration,1.5));
      object.updateMatrix();mesh.current.setMatrixAt(index,object.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate=true;
  });
  return <group name="shine-burst"><instancedMesh ref={mesh} args={[null,null,CONFIG.burst.count]} visible={false} frustumCulled={false} raycast={()=>null}><planeGeometry args={[1,1]}/><meshBasicMaterial map={texture} color={CONFIG.colors.paleSage} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}/></instancedMesh><sprite ref={flash} visible={false}><spriteMaterial map={texture} color="white" transparent opacity={.3} depthWrite={false} blending={AdditiveBlending} toneMapped={false}/></sprite></group>;
}
export function Sparkles({mobile,reduced,interaction,time}){
  return <><ShineBurst interaction={interaction} time={time} reduced={reduced}/>{!reduced && <DreiSparkles count={mobile?10:24} scale={[4.5,4.8,2]} size={mobile?1.4:1.8} speed={.15} opacity={.35} color={CONFIG.colors.paleSage}/>}</>;
}
