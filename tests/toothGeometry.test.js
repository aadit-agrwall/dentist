import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createCrownGeometry, createRootGeometry } from '../src/components/three/toothGeometry.js';
for(const mobile of [false,true]){
  test(`${mobile?'Mobile':'Desktop'} molar is finite and roots face outward`,()=>{
    const crown=createCrownGeometry(mobile);
    assert.ok(crown.boundingSphere.radius>0 && crown.boundingSphere.radius<2);
    assert.ok([...crown.attributes.position.array,...crown.attributes.normal.array].every(Number.isFinite));
    for(let index=0;index<3;index++){
      const geometry=createRootGeometry(index,mobile),position=geometry.attributes.position,normal=geometry.attributes.normal;
      const radialSegments=mobile?16:24,a=10*(radialSegments+1)+4,b=a+radialSegments/2;
      const radial=new Vector3(position.getX(a)-position.getX(b),position.getY(a)-position.getY(b),position.getZ(a)-position.getZ(b));
      assert.ok(radial.dot(new Vector3(normal.getX(a),normal.getY(a),normal.getZ(a)))>0,'Root side normals must face outward');
      assert.ok(normal.getY(normal.count-2)>0,'Root upper cap must face up');
      assert.ok(normal.getY(normal.count-1)<0,'Root tip cap must face down');
      assert.ok([...position.array,...normal.array].every(Number.isFinite));geometry.dispose();
    }
    crown.dispose();
  });
}
