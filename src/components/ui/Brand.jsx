import { requestLogoShine } from '../../utils/shine';
import { useId } from 'react';
import { site } from '../../config/site';
import { cn } from '../../utils/cn';
export function ToothMark({className}) {
  const id=useId().replace(/:/g,'');
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={cn('h-10 w-10',className)}><defs><linearGradient id={id} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse"><stop stopColor="#286248"/><stop offset="1" stopColor="#719E82"/></linearGradient></defs><path d="M23 10C16 4 6 9 9 20c1 4 3 6 4 13 1 8 5 10 7 2l3-9c1-2 2-2 3 0l3 9c2 8 6 6 7-2 1-7 3-9 4-13 1-4 0-7-2-9-4-4-9-4-15-1Z" fill={`url(#${id})`}/><path d="m37 3 1.5 4.5L43 9l-4.5 1.5L37 15l-1.5-4.5L31 9l4.5-1.5L37 3Z" fill="#719E82"/><path d="M17 14c2-1 5 1 8 1" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".7"/></svg>;
}
export function Brand({light=false,className}) {
  return <a onClick={requestLogoShine} href="#home" aria-label={`${site.name} home`} className={cn('group inline-flex shrink-0 items-center gap-2 rounded-lg',className)}><ToothMark className="brand-tooth transition-transform duration-300 group-hover:-rotate-6 group-active:scale-95"/><span className={cn('font-heading text-xs font-extrabold tracking-tight sm:text-sm',light?'text-white':'text-forest')}>{site.name}</span></a>;
}
