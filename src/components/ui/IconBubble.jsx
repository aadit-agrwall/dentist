import { cn } from '../../utils/cn';
export function IconBubble({icon:Icon, className, size=22}) {
  return <span className={cn('inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-100 bg-gradient-to-br from-white to-brand-50 text-brand-600 shadow-glass',className)}><Icon size={size} strokeWidth={1.5} aria-hidden="true"/></span>;
}
