import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperience } from '../context/Experience';
gsap.registerPlugin(ScrollTrigger);
const SCROLL_MOTION={artTravel:18,heroTravel:36,ctaScale:.97,duration:.85};
/** Transform-only accents complement the shared content reveals; every trigger is scoped and reverted. */
export function useScrollChoreography(){
  const {ready,reducedMotion}=useExperience();
  useLayoutEffect(()=>{
    if(!ready||reducedMotion||!document.getElementById('home'))return;
    const context=gsap.context(()=>{
      gsap.utils.toArray('.service-artwork').forEach(art=>{
        gsap.fromTo(art,{y:SCROLL_MOTION.artTravel},{y:-SCROLL_MOTION.artTravel,ease:'none',scrollTrigger:{trigger:art.closest('.service-card'),start:'top bottom',end:'bottom top',scrub:.6}});
      });
      gsap.fromTo('.footer-cta',{scale:SCROLL_MOTION.ctaScale},{scale:1,duration:SCROLL_MOTION.duration,ease:'power3.out',scrollTrigger:{trigger:'.footer-cta',start:'top 90%',toggleActions:'play none none reverse'}});
      const media=gsap.matchMedia();
      media.add('(min-width:1024px)',()=>{
        gsap.to('.hero-showcase',{y:-SCROLL_MOTION.heroTravel,ease:'none',scrollTrigger:{trigger:'#home',start:'top top',end:'bottom top',scrub:.6}});
      });
      return()=>media.revert();
    });
    ScrollTrigger.refresh();
    return()=>context.revert();
  },[ready,reducedMotion]);
}
