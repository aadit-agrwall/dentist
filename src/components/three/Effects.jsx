import { useEffect, useMemo } from 'react';
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing';
import { BlendFunction, Effect, ToneMappingMode } from 'postprocessing';
import { HERO_SCENE as CONFIG } from '../../config/heroScene';
function PremultipliedAlpha(){
  // Fullscreen effects write straight RGB even into transparent pixels. Premultiply
  // once at the output so WebGL composites cleanly over the page's gradient.
  const effect=useMemo(()=>new Effect('PremultipliedAlpha',`
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      outputColor = vec4(inputColor.rgb * inputColor.a, inputColor.a);
    }
  `,{blendFunction:BlendFunction.SRC}),[]);
  useEffect(()=>()=>effect.dispose(),[effect]);
  return <primitive object={effect}/>;
}
export function Effects({mobile,reduced}){
  if(mobile||reduced)return null;
  return <EffectComposer multisampling={0} enableNormalPass={false}><Bloom intensity={CONFIG.effects.bloomIntensity} luminanceThreshold={CONFIG.effects.luminanceThreshold} luminanceSmoothing={.2} mipmapBlur/><ToneMapping mode={ToneMappingMode.ACES_FILMIC}/><Vignette eskil={true} offset={CONFIG.effects.vignetteOffset} darkness={CONFIG.effects.vignetteDarkness}/><PremultipliedAlpha/></EffectComposer>;
}
