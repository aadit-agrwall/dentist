import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { INTERACTIONS } from '../config/interactions';
gsap.registerPlugin(ScrollTrigger);
export function useScrollVelocity(){
  const velocity=useRef(0);
  useEffect(()=>{const trigger=ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{velocity.current=Math.min(Math.abs(self.getVelocity()),INTERACTIONS.scrollVelocityCap)/INTERACTIONS.scrollVelocityCap;}});return()=>trigger.kill();},[]);
  return velocity;
}
