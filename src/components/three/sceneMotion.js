import { HERO_SCENE } from '../../config/heroScene.js';

/** A single bounded filter shared by scroll-driven camera and tooth transforms. */
export function advanceScroll(current, target, delta, reduced = false) {
  if (reduced) return 0;
  const boundedTarget = Math.max(0, Math.min(1, target));
  const frame = Math.max(0, Math.min(delta, .05));
  return current + (boundedTarget - current) * (1 - Math.exp(-HERO_SCENE.motion.scrollDamping * frame));
}
