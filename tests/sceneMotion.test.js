import test from 'node:test';
import assert from 'node:assert/strict';
import { Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector3 } from 'three';
import { advanceScroll } from '../src/components/three/sceneMotion.js';

test('Scroll reverses continuously and settles back at the hero without overshoot', () => {
  let value = 0;
  for (let frame = 0; frame < 60; frame++) value = advanceScroll(value, 1, 1 / 60);
  const previous = value;
  value = advanceScroll(value, 0, 1 / 60);
  assert.ok(value > 0 && value < previous);
  assert.ok(previous - value < .1, 'Reversal must not snap');
  for (let frame = 0; frame < 180; frame++) value = advanceScroll(value, 0, 1 / 60);
  assert.ok(value < .000001);
  assert.equal(advanceScroll(value, 1, 1 / 60, true), 0);
});

test('Scroll smoothing has the same result at 30fps and 60fps', () => {
  const simulate = fps => {
    let value = 0;
    for (let frame = 0; frame < fps; frame++) value = advanceScroll(value, 1, 1 / fps);
    return value;
  };
  assert.ok(Math.abs(simulate(30) - simulate(60)) < 1e-10);
});

test('Hidden interaction hull remains raycastable without rendering or casting shadows', () => {
  const geometry = new SphereGeometry(1, 24, 16), material = new MeshBasicMaterial();
  const hull = new Mesh(geometry, material);
  hull.visible = false;
  hull.scale.set(.98, 1.5, .85);
  hull.updateMatrixWorld();
  const ray = new Raycaster(new Vector3(0, 0, 5), new Vector3(0, 0, -1));
  assert.ok(ray.intersectObject(hull).length > 0);
  assert.equal(hull.castShadow, false);
  geometry.dispose(); material.dispose();
});
