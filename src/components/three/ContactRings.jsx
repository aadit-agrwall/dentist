import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Quaternion, Vector3, Matrix4 } from 'three';
const TARGET=new Vector3(),ORIGIN=new Vector3(),UP=new Vector3(0,1,0),LOOK=new Matrix4(),ROTATION=new Quaternion();
export default function ContactRings({mobile}){
  const ref=useRef(null),time=useRef(0);
  useFrame(({pointer},delta)=>{
    const dt=Math.min(delta,.05);time.current+=dt;
    TARGET.set(mobile?0:pointer.x*.8,mobile?0:pointer.y*.6,4);
    LOOK.lookAt(TARGET,ORIGIN,UP);ROTATION.setFromRotationMatrix(LOOK);ref.current.quaternion.slerp(ROTATION,1-Math.exp(-3*dt));
    ref.current.position.y=Math.sin(time.current*.7)*.1;
  });
  return <><hemisphereLight args={['#FFFFFF','#A1BFA9',2]}/><directionalLight position={[2,3,4]} intensity={3}/><group ref={ref}>{Array.from({length:mobile?2:3},(_,index)=><mesh key={index} rotation={[index*.75,index*.4,index*.25]}><torusGeometry args={[.8+index*.2,.025,12,mobile?56:80]}/><meshPhysicalMaterial color={index===1?'#83B89D':'#719E82'} roughness={.18} metalness={.35} clearcoat={1} transparent opacity={.6}/></mesh>)}</group></>;
}
