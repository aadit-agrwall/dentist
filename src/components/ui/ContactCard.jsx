import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { IconBubble } from './IconBubble';
export function ContactCard({icon,label,value,href,external=false,copyValue=value,copyable=true,copyLabel=label}){
  const [copied,setCopied]=useState(false);
  const copy=async()=>{
    try{await navigator.clipboard.writeText(copyValue);setCopied(true);toast.success('Copied!');}
    catch{toast.error(`Could not copy. Select the ${label.toLowerCase()} manually.`);}
  };
  return <div className="contact-card group/contact relative flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/60 p-4 transition-[border-color,box-shadow] hover:border-brand-300 hover:shadow-soft-glow focus-within:border-brand-300" onPointerLeave={()=>setCopied(false)}>
    <span className="contact-icon shrink-0"><IconBubble icon={icon} className="!h-11 !w-11 !rounded-xl" size={18}/></span><div className="min-w-0 flex-1"><p className="text-[9px] font-semibold uppercase tracking-widest text-brand-500">{label}</p><a href={href} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined} className="reactive-link mt-1 inline-block break-all rounded text-xs text-ink transition-colors hover:text-brand-600 active:text-brand-800">{value}</a></div>
    {copyable&&<button type="button" aria-label={`Copy ${copyLabel.toLowerCase()}`} onClick={copy} className="contact-copy flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-600 transition-all hover:bg-brand-50 active:scale-95">{copied?<Check size={14}/>:<Copy size={14}/>}</button>}
  </div>;
}
