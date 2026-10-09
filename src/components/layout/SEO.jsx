import { Helmet } from 'react-helmet-async';
import { site } from '../../config/site';
import { SERVICES } from '../../config/content';
export function SEO({styleguide=false}){
  const title=`${site.name} | Family Dental Care & Appointments`;
  const description='Explore general dentistry, braces and aligners, implants, whitening, and children’s dental care. Request a visit with the dental team. Clinic presentation demo.';
  const url=site.url?new URL('./',site.url).href:'',schema={'@context':'https://schema.org','@type':'Dentist',name:site.name,description,...(url?{url}:{}),openingHours:site.schemaHours,telephone:site.schemaPhone,email:site.email,hasOfferCatalog:{'@type':'OfferCatalog',name:'Dental treatments',itemListElement:SERVICES.map(service=>({'@type':'Offer',itemOffered:{'@type':'Service',name:service.title}}))}};
  return <Helmet><title>{styleguide?'Design System | '+site.name:title}</title><meta name="description" content={description}/>{(styleguide||site.demo)&&<meta name="robots" content="noindex, nofollow"/>}{url&&<link rel="canonical" href={url}/>}
    <meta property="og:type" content="website"/><meta property="og:title" content={title}/><meta property="og:description" content={description}/><meta property="og:site_name" content={site.name}/>{url&&<meta property="og:url" content={url}/>}<meta property="og:image" content={url?new URL('social-card.png',url).href:`${import.meta.env.BASE_URL}social-card.png`}/><meta property="og:image:alt" content="Pearl Dental — thoughtful care for your smile"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={title}/><meta name="twitter:description" content={description}/><meta name="twitter:image" content={url?new URL('social-card.png',url).href:`${import.meta.env.BASE_URL}social-card.png`}/>
    <script type="application/ld+json">{JSON.stringify(schema).replace(/</g,'\\u003c')}</script>
  </Helmet>;
}
