import { BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, LatheGeometry, Vector2, Vector3 } from 'three';
import { HERO_SCENE as CONFIG } from '../../config/heroScene.js';
const CROWN_PROFILE=[ [0,-.21],[.42,-.19],[.64,-.08],[.76,.16],[.87,.5],[.87,.8],[.73,1.02],[.45,1.04],[.18,.99],[0,.98] ];
const ROOT_PATHS=[
  [[-.39,.22,.24],[-.43,-.55,.3],[-.56,-1.12,.3],[-.72,-1.58,.24]],
  [[.4,.22,.22],[.43,-.57,.24],[.48,-1.16,.14],[.63,-1.58,.05]],
  [[0,.22,-.35],[.03,-.59,-.4],[.12,-1.15,-.46],[.18,-1.55,-.52]],
];
export function createCrownGeometry(mobile=false){
  const curve=new CatmullRomCurve3(CROWN_PROFILE.map(([radius,y])=>new Vector3(radius,y,0)),false,'centripetal');
  const points=curve.getPoints(CONFIG.geometry.profileSamples).map(point=>new Vector2(Math.max(0,point.x),point.y));
  const geometry=new LatheGeometry(points,mobile?CONFIG.geometry.mobileCrownSegments:CONFIG.geometry.crownSegments);
  const position=geometry.attributes.position;
  for(let i=0;i<position.count;i++){
    const x=position.getX(i), y=position.getY(i), z=position.getZ(i), angle=Math.atan2(z,x), radius=Math.hypot(x,z);
    // Four soft cusp shoulders and a shallow occlusal groove, with seamless low-amplitude enamel texture.
    const top=Math.max(0,Math.min(1,(y-.65)/.4));
    const squareness=1+.065*Math.cos(4*angle);
    const cusp=.17*Math.pow(Math.sin(2*angle),2)*top*Math.min(1,radius/.45);
    const groove=.025*Math.exp(-radius*radius/.12)*top;
    const noise=CONFIG.geometry.noise*Math.sin(x*9+z*3)*Math.sin(z*8-y*5)*Math.cos(y*7+x*4);
    position.setXYZ(i,x*squareness*.98,y+cusp-groove+noise,z*squareness*.88);
  }
  geometry.computeVertexNormals();geometry.computeBoundingSphere();
  return geometry;
}
export function createRootGeometry(rootIndex,mobile=false){
  const curve=new CatmullRomCurve3(ROOT_PATHS[rootIndex].map(point=>new Vector3(...point)));
  const segments=mobile?24:CONFIG.geometry.rootSegments, radial=mobile?16:CONFIG.geometry.rootRadialSegments;
  const frames=curve.computeFrenetFrames(segments,false), positions=[],indices=[];
  for(let row=0;row<=segments;row++){
    const t=row/segments, center=curve.getPointAt(t), radius=.315*Math.pow(1-t,.72)+.018;
    for(let column=0;column<=radial;column++){
      const angle=column/radial*Math.PI*2;
      const normal=frames.normals[row], binormal=frames.binormals[row];
      positions.push(center.x+radius*(Math.cos(angle)*normal.x+Math.sin(angle)*binormal.x),center.y+radius*(Math.cos(angle)*normal.y+Math.sin(angle)*binormal.y),center.z+radius*(Math.cos(angle)*normal.z+Math.sin(angle)*binormal.z));
      if(row<segments && column<radial){const a=row*(radial+1)+column,b=a+radial+1;indices.push(a,a+1,b,b,a+1,b+1);}
    }
  }
  // Close both ends so the root remains watertight even when seen from below.
  [0,segments].forEach((row,cap)=>{
    const center=curve.getPointAt(row/segments), centerIndex=positions.length/3;positions.push(center.x,center.y,center.z);
    for(let column=0;column<radial;column++){const a=row*(radial+1)+column;indices.push(...(cap?[centerIndex,a,a+1]:[centerIndex,a+1,a]));}
  });
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();geometry.computeBoundingSphere();return geometry;
}
