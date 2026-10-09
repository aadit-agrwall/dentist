import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { KeywordMarquee, Services } from './components/sections/Services';
import { Process } from './components/sections/Process';
import { Results } from './components/sections/Results';
import { Testimonials } from './components/sections/Testimonials';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
export default function Home(){return <><Navbar/><main id="main" tabIndex={-1}><Hero/><KeywordMarquee/><Services/><Process/><Results/><Testimonials/><FAQ/><Contact/></main><Footer/></>;}
