import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Repository deployments use a subfolder; local development keeps the root URL.
export default defineConfig({base:process.env.PAGES_BASE_PATH||'/',plugins:[react()],build:{rollupOptions:{output:{manualChunks(id){
  if(id.includes('vite/preload-helper'))return 'preload';
  if(id.includes('commonjsHelpers'))return 'react-core';
  if(!id.includes('node_modules'))return;
  if(/node_modules\/(react|react-dom|scheduler|react-is)\//.test(id))return 'react-core';
  if(/three|react-reconciler|react-three|postprocessing|maath|meshline|troika/.test(id))return 'three';
  if(id.includes('gsap')||id.includes('lenis'))return 'scroll';
  if(id.includes('framer-motion')||id.includes('motion-dom'))return 'motion';
  if(id.includes('react-hook-form'))return 'forms';
}}}}});
