import { useExperience } from '../context/Experience';
/** Device preference is the default; a visitor can explicitly opt into or out of motion. */
export function useSiteMotion(){return useExperience().reducedMotion;}
