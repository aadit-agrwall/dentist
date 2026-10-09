import { AppShell } from './components/layout/AppShell';
import { lazy, Suspense } from 'react';
import { SEO } from './components/layout/SEO';
const Styleguide=lazy(()=>import('./Styleguide')); 
import Home from './Home';
// The design library remains intentionally unlisted alongside the public homepage.
export default function App() {
  const isStyleguide = window.location.pathname.replace(/\/$/, '') === `${import.meta.env.BASE_URL}styleguide`;
  return <AppShell><SEO styleguide={isStyleguide}/>{isStyleguide ? <Suspense fallback={<div className="p-12">Preparing the design library…</div>}><Styleguide/></Suspense> : <Home/>}</AppShell>;
}
