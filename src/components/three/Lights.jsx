import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { MathUtils, PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { HERO_SCENE as CONFIG } from '../../config/heroScene';
function Reflections(){
  const {gl,scene}=useThree();
  useLayoutEffect(()=>{
    const room=new RoomEnvironment(),generator=new PMREMGenerator(gl),target=generator.fromScene(room,.04),previous=scene.environment;
    scene.environment=target.texture;
    room.dispose();generator.dispose();
    return()=>{scene.environment=previous;target.dispose();};
  },[gl,scene]);
  return null;
}
export function Lights({mobile,reduced,interaction,time}){
  const pointer=useRef(null),rim=useRef(null),shadow=useRef(null),contact=useRef(null);
  useLayoutEffect(()=>{contact.current?.traverse(object=>{if(object.isOrthographicCamera)object.layers.set(1);});},[]);
  useFrame((state,delta)=>{
    const dt=Math.min(delta,.05),canReact=!mobile&&!reduced;
    pointer.current.position.x=MathUtils.damp(pointer.current.position.x,canReact?state.pointer.x*3:2,CONFIG.motion.damping,dt);
    pointer.current.position.y=MathUtils.damp(pointer.current.position.y,canReact?state.pointer.y*2+2:2,CONFIG.motion.damping,dt);
    rim.current.intensity=MathUtils.damp(rim.current.intensity,interaction.current.hovered&&!reduced?2.3:1.5,CONFIG.motion.damping,dt);
    shadow.current.scale.setScalar(reduced?1:1+Math.sin(time.current*CONFIG.motion.floatSpeed)*.025);
  });
  return <><Reflections/>
    <hemisphereLight args={['#FFFFFF','#A1BFA9',1.35]}/>
    <directionalLight position={[3,5,4]} intensity={3} color="#FFFFFF" castShadow={!mobile} shadow-mapSize-width={512} shadow-mapSize-height={512} shadow-bias={-.001} shadow-normalBias={.04} shadow-radius={4}/>
    <directionalLight position={[-3,1,-3]} intensity={2.5} color={CONFIG.colors.brand}/>
    <pointLight ref={pointer} position={[2,2,3]} color={CONFIG.colors.paleSage} intensity={4} distance={10} decay={2}/>
    <pointLight ref={rim} position={[1,.6,-1.7]} color={CONFIG.colors.aqua} intensity={1.5} distance={6}/>
    <group ref={shadow} position={CONFIG.shadows.position}><ContactShadows ref={contact} frames={reduced?1:Infinity} color={CONFIG.colors.brand} opacity={CONFIG.shadows.opacity} scale={CONFIG.shadows.scale} blur={CONFIG.shadows.blur} far={CONFIG.shadows.far} resolution={mobile?CONFIG.shadows.mobileResolution:CONFIG.shadows.resolution} smooth={!mobile}/></group>
  </>;
}
