import { Sparkles } from 'lucide-react';
/** CSS-only burst: no timers, state churn, or frames while the element rests. */
export function HoverSparkles(){return <span aria-hidden="true" className="hover-sparkles pointer-events-none absolute -right-2 -top-2"><Sparkles size={15}/><span>✦</span><span>✧</span></span>;}
