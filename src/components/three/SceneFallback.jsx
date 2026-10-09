import { ToothMark } from '../ui/Brand';
export function SceneFallback({loading=false}){
  return <div role="img" aria-label={loading?'Loading the interactive pearl-white tooth':'A tooth illustration on a soft sage gradient'} className="absolute inset-0 flex items-center justify-center rounded-[3rem] bg-gradient-glow"><div className="flex h-64 w-64 flex-col items-center justify-center rounded-[3rem] border border-white/80 bg-white/40 shadow-soft-glow backdrop-blur-sm"><ToothMark className="!h-36 !w-36"/><p className="mt-5 text-[9px] uppercase tracking-[.2em] text-brand-600/70">{loading?'Polishing your experience':'A brighter first impression'}</p>{loading && <span className="mt-4 h-1 w-12 animate-pulse rounded-full bg-brand-200"/>}</div></div>;
}
