import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Reveal, SectionHeading } from '../ui';
import { ContactCard } from '../ui/ContactCard';
import { AppointmentForm } from '../contact/AppointmentForm';
import { SceneSlot } from '../three/SceneSlot';
import { GradientBlobs } from '../layout/GradientBlobs';
import { site } from '../../config/site';
function MapCard(){return <div className="glass relative mt-6 overflow-hidden !rounded-2xl">
  {site.mapEmbedUrl?<iframe title={`${site.name} clinic location`} src={site.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-56 w-full border-0"/>:<div className="map-placeholder relative flex h-52 items-center justify-center bg-pearl"><div aria-hidden="true" className="absolute inset-0 opacity-50" style={{backgroundImage:'linear-gradient(32deg, transparent 44%, white 44%, white 49%, transparent 49%),linear-gradient(110deg, transparent 43%, white 43%, white 48%, transparent 48%)',backgroundSize:'96px 96px'}}/><div className="relative flex flex-col items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/80 text-brand-600 shadow-glass"><MapPin size={22}/></span><span className="text-xs font-semibold text-brand-700">Clinic address · Demo placeholder</span></div></div>}
  <p className="border-t border-brand-100/60 bg-white/60 px-5 py-4 text-[11px] leading-6 text-ink/60">{site.mapEmbedUrl?'Find the clinic here. Contact the team before your visit.':'Add the clinic’s verified address and Google Maps location before publishing.'}</p>
</div>;}
export function Contact(){return <section id="contact" className="section-space relative isolate scroll-mt-28 overflow-hidden bg-gradient-to-b from-white to-pearl"><GradientBlobs/><div className="page-container grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
  <Reveal><SectionHeading eyebrow="We look forward to meeting you" title="Make time for" highlight="your smile." subtitle="Have a question or want to plan a visit? Call, message, or send an appointment request. This demo uses placeholder contact details."/>
    <div className="mt-9 space-y-3"><ContactCard icon={Phone} label="Call" copyLabel="Phone" value={site.phone} href={site.phoneHref}/><ContactCard icon={MessageCircle} label="WhatsApp" value="Chat on WhatsApp" href={site.whatsapp} external copyable={false}/><ContactCard icon={Mail} label="Email" value={site.email} href={site.emailHref}/><div className="glass flex items-center gap-4 !rounded-2xl p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500"><Clock size={18}/></span><div><p className="text-[9px] font-semibold uppercase tracking-widest text-brand-500">Demo opening hours</p><p className="mt-1 text-xs leading-6 text-ink">{site.hours}</p></div></div></div>
    <MapCard/><div id="contact-3d" aria-hidden="true" className="pointer-events-none relative mx-auto mt-4 h-32 w-48 opacity-60"><SceneSlot kind="contact"/></div>
  </Reveal><Reveal delay={.1}><AppointmentForm/></Reveal>
</div></section>;}
