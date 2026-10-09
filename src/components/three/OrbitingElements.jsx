import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { MathUtils, Quaternion, Vector3 } from 'three';
import { HERO_SCENE as CONFIG } from '../../config/heroScene';
import { StarSprite } from './Sparkles';
const ELEMENTS=[
  {type:'molecule',position:[-1.6,.8,-.1],size:.22,speed:.18},
  {type:'molecule',position:[1.55,-.5,.25],size:.16,speed:-.13},
  {type:'molecule',position:[.75,1.55,-.65],size:.11,speed:.21},
  {type:'plus',position:[1.55,.95,-.35],size:.12,speed:.17},
  {type:'plus',position:[-1.3,-1.1,.1],size:.09,speed:-.14},
  {type:'octahedron',position:[-1.1,1.55,-.5],size:.1,speed:.12},
  {type:'octahedron',position:[1.1,-1.5,-.5],size:.09,speed:-.19},
  {type:'star',position:[1.8,.2,.6],size:.09,speed:.11},
  {type:'star',position:[-.6,-1.65,.35],size:.065,speed:-.15,gold:true},
];
function Plus({size}){return <group><mesh><boxGeometry args={[size*.65,size*2.5,size*.65]}/><meshPhysicalMaterial color={CONFIG.colors.paleSage} roughness={.18} metalness={.12} clearcoat={1}/></mesh><mesh><boxGeometry args={[size*2.5,size*.65,size*.65]}/><meshPhysicalMaterial color={CONFIG.colors.paleSage} roughness={.18} metalness={.12} clearcoat={1}/></mesh></group>;}
const ATOMS=[[0,0,0],[.35,.13,0],[-.22,.29,.08]];
function Molecule({size,mobile}){
  const bonds=useMemo(()=>ATOMS.slice(1).map(point=>{const end=new Vector3(...point);return {position:end.clone().multiplyScalar(.5),length:end.length(),rotation:new Quaternion().setFromUnitVectors(new Vector3(0,1,0),end.clone().normalize())};}),[]);
  return <group scale={size/.18}>
    {bonds.map((bond,index)=><mesh key={index} position={bond.position} quaternion={bond.rotation}><cylinderGeometry args={[.028,.028,bond.length,8]}/><meshStandardMaterial color={CONFIG.colors.brand} roughness={.3}/></mesh>)}
    {ATOMS.map((point,index)=><mesh key={index} position={point}><sphereGeometry args={[index===0?.17:.11,mobile?16:24,16]}/><meshPhysicalMaterial color={index===0?CONFIG.colors.paleSage:CONFIG.colors.aqua} transmission={.65} thickness={.4} ior={1.3} roughness={.1} clearcoat={1}/></mesh>)}
  </group>;
}
function burstWave(time,interaction){const age=time-interaction.current.burstAt;return age>=0&&age<CONFIG.orbit.burstDuration?Math.sin(age/CONFIG.orbit.burstDuration*Math.PI):0;}
function Orbital({element,index,mobile,reduced,intro,time,interaction}){
  const ref=useRef(null), target=useMemo(()=>new Vector3(),[]),phaseRef=useRef(0),speed=useRef(1);
  useFrame((state,delta)=>{
    const dt=Math.min(delta,.05),t=time.current,progress=reduced?1:intro.current.orbit,[x,y,z]=element.position;
    speed.current=MathUtils.damp(speed.current,interaction.current.hovered?CONFIG.orbit.hoverSpeed:1,CONFIG.motion.damping,dt);
    if(!reduced)phaseRef.current+=dt*element.speed*CONFIG.orbit.speedMultiplier*speed.current;
    const phase=reduced?0:phaseRef.current;
    const spread=1+(1-progress)*3+(reduced?0:(speed.current-1)*CONFIG.orbit.hoverSpread+burstWave(t,interaction)*CONFIG.orbit.burstSpread);
    target.set((x*Math.cos(phase)+z*Math.sin(phase))*spread,y+(reduced?0:Math.sin(t*CONFIG.orbit.bobSpeed+index)*CONFIG.orbit.bobAmplitude),(-x*Math.sin(phase)+z*Math.cos(phase))*spread);
    if(!mobile&&!reduced){
      const pointerX=state.pointer.x*state.viewport.width/2, pointerY=state.pointer.y*state.viewport.height/2;
      const dx=target.x-pointerX,dy=target.y-pointerY,distance=Math.hypot(dx,dy);
      const push=Math.max(0,1-distance/CONFIG.orbit.pushRadius)*CONFIG.orbit.pushStrength;
      target.x+=dx/Math.max(distance,.01)*push;target.y+=dy/Math.max(distance,.01)*push;
    }
    ref.current.position.lerp(target,1-Math.exp(-CONFIG.motion.damping*Math.min(delta,.05)));
    ref.current.scale.setScalar(progress*(reduced?1:1+Math.sin(t+index)*.045));
    if(!reduced){ref.current.rotation.y=phase;ref.current.rotation.x=Math.sin(phase)*.3;ref.current.rotation.z=phase*.65;}
  });
  return <group ref={ref} position={element.position}><Float enabled={!reduced} speed={.8+index*.1} floatIntensity={.2} rotationIntensity={.15}>
    {element.type==='sphere' && <mesh><sphereGeometry args={[element.size,mobile?20:32,20]}/><meshPhysicalMaterial color={CONFIG.colors.paleSage} transmission={.9} thickness={.6} ior={1.3} roughness={.08} clearcoat={1} envMapIntensity={1.4}/></mesh>}
    {element.type==='molecule' && <Molecule size={element.size} mobile={mobile}/> }
    {element.type==='plus' && <Plus size={element.size}/>}
    {element.type==='octahedron' && <mesh><octahedronGeometry args={[element.size]}/><meshPhysicalMaterial color={CONFIG.colors.aqua} roughness={.2} metalness={.2}/></mesh>}
    {element.type==='star' && <StarSprite color={element.gold?CONFIG.colors.gold:CONFIG.colors.aqua} scale={element.size*2}/>}
  </Float></group>;
}
function OrbitRing({index,reduced,mobile,time,intro,interaction,scroll}){
  const ref=useRef(null),phase=useRef(0),speed=useRef(1);
  useFrame((_,delta)=>{
    const dt=Math.min(delta,.05);
    speed.current=MathUtils.damp(speed.current,interaction.current.hovered?1.7:1,5,dt);
    if(!reduced)phase.current+=dt*(.14+index*.045)*speed.current;
    ref.current.rotation.set(Math.PI/2+.25*index+(reduced?0:Math.sin(phase.current)*.22),.35*index+phase.current*.5,-.4+index*.6+phase.current*(index%2?-.65:.65)+scroll.current.progress*.25);
    ref.current.scale.setScalar((reduced?1:intro.current.orbit)*(reduced?1:1+burstWave(time.current,interaction)*.12));
  });
  return <mesh ref={ref}><torusGeometry args={[CONFIG.orbit.ringRadius+index*.18,CONFIG.orbit.torusTube,mobile?6:8,mobile?80:128]}/><meshBasicMaterial color={index===1?CONFIG.colors.paleSage:CONFIG.colors.brand} transparent opacity={index===1?.4:.3} depthWrite={false}/></mesh>;
}
function Rings(props){return <group>{Array.from({length:props.mobile?2:3},(_,index)=><OrbitRing key={index} index={index} {...props}/>)}</group>;}
export function OrbitingElements(props){return <group name="orbiting-elements"><Rings {...props}/>{ELEMENTS.filter((_,index)=>!props.mobile||[0,1,3,8].includes(index)).map((element,index)=><Orbital key={element.type+index} element={element} index={index} {...props}/>)}</group>;}
