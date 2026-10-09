import { cn } from '../../utils/cn';
export function Marquee({items,className,duration=28,reverse=false,label='Highlights'}) {
  return <div role="group" aria-label={label} className={cn('overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',className)}>
    <div className="marquee-track flex w-max animate-marquee" style={{animationDuration:`${duration}s`,animationDirection:reverse?'reverse':'normal'}}>
      {[0,1].map(copy=><div key={copy} aria-hidden={copy===1?true:undefined} inert={copy===1?'':undefined} className="flex shrink-0 items-center">{items.map((item,index)=><div key={index} className="flex items-center gap-10 px-5"><span className="keyword-reveal whitespace-nowrap font-heading text-sm font-semibold text-ink/60">{item}</span><span className="text-brand-300" aria-hidden="true">✦</span></div>)}</div>)}
    </div>
  </div>;
}
