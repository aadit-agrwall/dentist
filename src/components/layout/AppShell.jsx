import { useExperience } from '../../context/Experience';
import { PageLoader } from './PageLoader';
import { BackToTop } from './BackToTop';
import { ConversionControls } from './ConversionControls';
import { Toaster } from 'react-hot-toast';
import { useScrollChoreography } from '../../hooks/useScrollChoreography';
import { useLenis } from '../../hooks/useLenis';
import { ScrollProgress } from './ScrollProgress';
import { CustomCursor } from './CustomCursor';
export function AppShell({children}) {
  useLenis();
  useScrollChoreography();
  const {ready}=useExperience();
  return <><PageLoader/><div inert={!ready?'':undefined} aria-hidden={!ready?true:undefined}><ScrollProgress/><CustomCursor/>{children}<ConversionControls/><BackToTop/><Toaster position="top-center" toastOptions={{className:'!rounded-2xl !font-body',style:{color:'#43574E',background:'#FFFFFF'}}}/></div></>;
}
