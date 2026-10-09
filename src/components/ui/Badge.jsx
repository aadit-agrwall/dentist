import { cn } from '../../utils/cn';
const tones = { blue:'bg-brand-50 text-brand-700 border-brand-200/60', mint:'bg-mint/10 text-brand-800 border-mint/30', light:'bg-white/10 text-white border-white/20' };
export function Badge({children,tone='blue',dot=false,className,...props}) {
  return <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]',tones[tone],className)} {...props}>{dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"/>}{children}</span>;
}
