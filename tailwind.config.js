/** Ivory & Evergreen tokens: the single source of truth for visual styling. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {50:'#F1F6F1',100:'#E3EDE4',200:'#C7DACB',300:'#A1BFA9',400:'#719E82',500:'#3D7A60',600:'#286248',700:'#1C503A',800:'#173E2E',900:'#123126'},
        lime:'#E1F47B', forest:'#173F2B', ink:'#43574E', pure:'#FFFFFF', snow:'#F6F5EE', pearl:'#EDF2DF', frost:'#E8E9DE', aqua:'#83B89D', mint:'#AED3B9', gold:'#C4A66B', 'champagne':'#D6C5A5',
      },
      fontFamily: { heading:['Plus Jakarta Sans','sans-serif'], body:['Inter','sans-serif'] },
      borderRadius: { xl:'1rem', '2xl':'1.5rem', '3xl':'2rem', '4xl':'2.5rem', pill:'9999px' },
      boxShadow: { 'soft-glow':'0 20px 60px -15px rgba(28,80,58,0.18)', glass:'0 8px 32px rgba(28,50,36,0.06)', 'glow-hover':'0 24px 72px -12px rgba(28,80,58,0.24)' },
      backgroundImage: { 'gradient-brand':'linear-gradient(135deg, #286248, #3D7A60 50%, #719E82)', 'gradient-glow':'radial-gradient(circle, rgba(28,80,58,0.18), transparent 70%)', 'gradient-aqua':'linear-gradient(135deg, #3D7A60, #83B89D)' },
      transitionTimingFunction: { luxury:'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-16px)'}},
        'float-slow':{'0%,100%':{transform:'translate3d(0,0,0)'},'50%':{transform:'translate3d(12px,-24px,0)'}},
        'pulse-ring':{'0%':{transform:'scale(1)',opacity:'0.6'},'100%':{transform:'scale(1.65)',opacity:'0'}},
        shimmer:{'0%':{transform:'translateX(-150%) skewX(-20deg)'},'100%':{transform:'translateX(250%) skewX(-20deg)'}},
        'gradient-shift':{'0%,100%':{backgroundPosition:'0% 50%'},'50%':{backgroundPosition:'100% 50%'}},
        marquee:{to:{transform:'translateX(-50%)'}},
        'spin-slow':{to:{transform:'rotate(360deg)'}},
        'fade-up':{from:{opacity:'0',transform:'translateY(24px)'},to:{opacity:'1',transform:'translateY(0)'}},
      },
      animation: {float:'float 6s ease-in-out infinite','float-slow':'float-slow 12s ease-in-out infinite','pulse-ring':'pulse-ring 2s ease-out infinite',shimmer:'shimmer 1.4s ease-in-out','gradient-shift':'gradient-shift 8s ease infinite',marquee:'marquee 28s linear infinite','spin-slow':'spin-slow 24s linear infinite','fade-up':'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both'},
    },
  },
  plugins: [],
};
