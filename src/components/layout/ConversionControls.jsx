import { useSiteMotion as useReducedMotion } from '../../hooks/useSiteMotion.js';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { site } from '../../config/site';
/** Hide fixed conversion UI around form focus and footer to protect their controls. */
export function ConversionControls(){
  const [formVisible,setFormVisible]=useState(false),[pastHero,setPastHero]=useState(false),[footerVisible,setFooterVisible]=useState(false),[editing,setEditing]=useState(false),[keyboardOpen,setKeyboardOpen]=useState(false),reduced=useReducedMotion();
  useEffect(()=>{
    const hero=document.querySelector('#home'),footer=document.querySelector('footer');if(!hero)return;
    const update=()=>setPastHero(hero.getBoundingClientRect().bottom<=0);
    const form=document.querySelector('#contact'),formObserver=new IntersectionObserver(([entry])=>setFormVisible(entry.isIntersecting));if(form)formObserver.observe(form);
    const footObserver=new IntersectionObserver(([entry])=>setFooterVisible(entry.isIntersecting));if(footer)footObserver.observe(footer);
    const focus=()=>setEditing(!!document.activeElement?.closest('#contact form'));
    const viewport=window.visualViewport,resize=()=>setKeyboardOpen(!!viewport&&viewport.height<window.innerHeight*.75);
    window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);document.addEventListener('focusin',focus);document.addEventListener('focusout',focus);viewport?.addEventListener('resize',resize);update();
    return()=>{footObserver.disconnect();formObserver.disconnect();window.removeEventListener('scroll',update);window.removeEventListener('resize',update);document.removeEventListener('focusin',focus);document.removeEventListener('focusout',focus);viewport?.removeEventListener('resize',resize);};
  },[]);
  const available=!footerVisible&&!editing&&!keyboardOpen&&!formVisible;
  const visible=pastHero&&available;
  return <AnimatePresence>{visible&&
    <motion.div key="mobile" initial={{opacity:0,y:reduced?0:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:24}} transition={{duration:reduced?0:.25}} className="conversion-mobile fixed inset-x-0 bottom-0 z-40 border-t border-white/80 bg-white/75 px-4 pt-3 shadow-glass backdrop-blur-xl lg:hidden" aria-label="Quick contact"><div className="mx-auto grid max-w-lg grid-cols-2 gap-3"><a href={site.phoneHref} className="conversion-link glass flex min-h-12 items-center justify-center gap-2 !rounded-full text-sm font-semibold text-brand-700"><Phone size={17}/>Call Now</a><a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="conversion-link glass flex min-h-12 items-center justify-center gap-2 !rounded-full text-sm font-semibold text-brand-700"><MessageCircle size={17}/>WhatsApp</a></div></motion.div>}
    {available&&<motion.a key="desktop" href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" data-cursor="button" initial={{opacity:0,scale:reduced?1:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="conversion-desktop group fixed bottom-8 right-8 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-gradient-brand text-white shadow-soft-glow transition-shadow hover:shadow-glow-hover active:scale-95 lg:flex"><span aria-hidden="true" className="absolute inset-0 animate-pulse-ring rounded-full border border-brand-300"/><MessageCircle size={25}/><span className="pointer-events-none absolute right-[calc(100%+12px)] whitespace-nowrap rounded-full border border-brand-100 bg-white px-4 py-2 text-xs font-medium text-brand-700 opacity-0 shadow-glass transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Chat with us</span></motion.a>
  }</AnimatePresence>;
}
