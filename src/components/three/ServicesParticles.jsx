import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Vector2 } from 'three';
import { INTERACTIONS } from '../../config/interactions';
const VERTEX=`
 uniform float uTime; uniform float uDpr; uniform vec2 uBounds; uniform vec2 uMouse; uniform float uReactive;
 attribute float aSeed; varying float vAlpha;
 void main(){
  vec3 p=position; p.xy*=uBounds*.58;
  p.x+=sin(p.y*1.3+uTime*.16+aSeed*6.28)*.16;
  p.y+=sin(p.x*.8-uTime*.13)*.12+cos(p.z*2.0+uTime*.1)*.07;
  vec2 delta=p.xy-uMouse;float distanceToMouse=length(delta);
  p.xy+=normalize(delta+vec2(.001))*(1.-smoothstep(0.,.9,distanceToMouse))*.2*uReactive;
  vec4 viewPosition=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*viewPosition;
  gl_PointSize=(2.0+aSeed*2.0)*uDpr*clamp(5.0/-viewPosition.z,.5,1.5);
  vAlpha=.24+aSeed*.24;
 }`;
const FRAGMENT=`
 uniform vec3 uColor; varying float vAlpha;
 void main(){float glow=1.-smoothstep(.05,.5,length(gl_PointCoord-vec2(.5)));if(glow<.01)discard;gl_FragColor=vec4(uColor,glow*vAlpha);}
`;
export default function ServicesParticles({mobile}){
  const material=useRef(null),time=useRef(0),{viewport,gl}=useThree();
  const geometry=useMemo(()=>{
    const count=mobile?INTERACTIONS.mobileParticleCount:INTERACTIONS.particleCount,positions=new Float32Array(count*3),seeds=new Float32Array(count);
    // A deterministic distribution avoids particle jumps and hydration/randomness surprises.
    let seed=127;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    for(let i=0;i<count;i++){positions[i*3]=random()*2-1;positions[i*3+1]=random()*2-1;positions[i*3+2]=random()-.5;seeds[i]=random();}
    const result=new BufferGeometry();result.setAttribute('position',new Float32BufferAttribute(positions,3));result.setAttribute('aSeed',new Float32BufferAttribute(seeds,1));return result;
  },[mobile]);
  const target=useMemo(()=>new Vector2(),[]);
  const uniforms=useMemo(()=>({uTime:{value:0},uDpr:{value:1},uBounds:{value:new Vector2()},uMouse:{value:new Vector2()},uReactive:{value:0},uColor:{value:new Color('#3D7A60')}}),[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  useFrame(({pointer},delta)=>{
    time.current+=Math.min(delta,.05);const u=material.current.uniforms;
    u.uTime.value=time.current;u.uDpr.value=gl.getPixelRatio();u.uBounds.value.set(viewport.width,viewport.height);
    u.uMouse.value.lerp(target.set(pointer.x*viewport.width/2,pointer.y*viewport.height/2),.08);u.uReactive.value=mobile?0:1;
  });
  return <points frustumCulled={false}><primitive object={geometry} attach="geometry"/><shaderMaterial ref={material} vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending}/></points>;
}
