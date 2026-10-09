/** Geometry, lighting, and motion budgets for the procedural hero. No model assets. */
export const HERO_SCENE = Object.freeze({
  camera: { position:[0, .25, 7.7], fov:36, near:.1, far:60, dolly:.65, parallax:.12 },
  geometry: { crownSegments:96, mobileCrownSegments:56, profileSamples:48, rootSegments:36, rootRadialSegments:24, noise:.008 },
  material: { color:'#FFFCF5', roughness:.2, metalness:0, clearcoat:1, clearcoatRoughness:.14, sheen:.6, sheenColor:'#A1BFA9', ior:1.45, envMapIntensity:1.05 },
  motion: { introDuration:1.6, orbitIntroDuration:1.7, damping:5, floatAmplitude:.13, floatSpeed:.85, breathing:.008, rotationSpeed:.16,  reducedRotationSpeed:.012, hoverScale:1.06, hoverLift:.1, clickSpinDamping:3.2, scrollTurn:.65, tilt:.18, scrollRight:.18, scrollScale:.92, scrollDamping:6 },
  burst: { count:40, duration:1.05, speed:2.3, gravity:.35, pulseDuration:.7, pulseAmount:.055, flashDuration:.28 },
  shadows: { position:[0,-1.95,0], opacity:.24, scale:7, blur:2.8, far:5, resolution:256, mobileResolution:128 },
  effects: { bloomIntensity:.3, luminanceThreshold:.9, vignetteDarkness:.12, vignetteOffset:.35 },
  colors: { brand:'#3D7A60', paleSage:'#A1BFA9', aqua:'#83B89D', gold:'#C4A66B' },
  orbit: { pushRadius:1.4, pushStrength:.32, ringRadius:1.85, torusTube:.016, speedMultiplier:1.6, hoverSpeed:1.65, hoverSpread:.06, burstSpread:.22, burstDuration:1.6, bobAmplitude:.18, bobSpeed:.9 },
});
