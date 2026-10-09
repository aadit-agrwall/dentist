import { useEffect, useState } from 'react';
/** Stop GPU work outside the viewport or while the browser tab is hidden. */
export function useSceneVisibility(ref) {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    let inViewport=false;
    const update=()=>setVisible(inViewport && !document.hidden);
    const observer=new IntersectionObserver(([entry])=>{inViewport=entry.isIntersecting;update();},{threshold:.01});
    if(ref.current)observer.observe(ref.current);
    document.addEventListener('visibilitychange',update);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);};
  },[ref]);
  return visible;
}
