export function WaveDivider({bottom=false,fill='#173F2B'}) {
  return <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className={`pointer-events-none block h-10 w-full sm:h-16 ${bottom?'rotate-180':''}`}><path d="M0 80V55C270-10 520 0 720 30S1180 95 1440 35V80Z" fill={fill}/></svg>;
}
