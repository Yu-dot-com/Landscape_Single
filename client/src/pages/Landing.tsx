import  { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BASE_CARDS = [
  { id: 1, img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" },
  { id: 2, img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80" },
  { id: 3, img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80" },
  { id: 4, img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80" },
  { id: 5, img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80" },
];

const INFINITE_CARDS = [...BASE_CARDS, ...BASE_CARDS, ...BASE_CARDS, ...BASE_CARDS, ...BASE_CARDS, ...BASE_CARDS];

export default function Landing() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rotation = useTransform(scrollYProgress, (value) => {
    return value * -140; 
  });

  return (
    <div ref={containerRef} className="relative bg-[#0B0C0E] text-[#F3F4F6] min-h-[600vh] font-sans antialiased overflow-x-hidden selection:bg-neutral-800">
      
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-2 backdrop-blur-md bg-[#0B0C0E]/30 border-b border-white/3">
        {/* Logo (Left) */}
        <div className="w-6 h-6 border border-neutral-700 rounded-full flex items-center justify-center text-white font-serif text-base font-semibold hover:bg-white hover:text-[#0B0C0E] transition-all duration-500 cursor-pointer">
          X
        </div>
        
        {/* Login Button (Right) */}
        <div>
          <button className="border border-neutral-800 bg-white/5 hover:bg-white hover:text-[#0B0C0E] text-[10px] uppercase tracking-[0.2em] px-5 py-2 rounded-full font-medium transition-all duration-300">
            Login
          </button>
        </div>
      </nav>

      {/* ==================== STAGE CAROUSEL ARCS ==================== */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-20">
        
        {/* THE MAIN WHEEL STAGE */}
        <motion.div 
          style={{ 
            rotate: rotation,
            transformOrigin: "50% 1500px" 
          }}
          className="absolute top-[10vh] left-1/2 -translate-x-1/2 w-[2400px] h-[2400px] flex justify-center items-start pointer-events-none"
        >
          {INFINITE_CARDS.map((card, index) => {
            const totalCards = INFINITE_CARDS.length;
            const cardAngle = (index / totalCards) * 360;
            
            return (
              <div
                key={`${card.id}-${index}`}
                className="absolute pointer-events-auto"
                style={{
                  height: "1500px", 
                  width: "220px",
                  transformOrigin: "bottom center",
                  transform: `rotate(${cardAngle}deg)`,
                  top: 0,
                }}
              >
                {/* Modern Glassmorphic Frame Canvas */}
                <motion.div 
                  // FIX: Changed 'shadow' to 'boxShadow' to clear the TypeScript build failure
                  whileHover={{ y: -18, scale: 1.025, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="w-full h-[320px] bg-white/3 backdrop-blur-md rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/[0.08] flex flex-col justify-between cursor-pointer group select-none transition-shadow"
                >
                  {/* Photo Frame Window */}
                  <div className="w-full h-full rounded-lg bg-neutral-900/40 overflow-hidden relative border border-white/[0.03]">
                    <img 
                      src={card.img} 
                      alt="Presentation Image" 
                      className="w-full h-full object-cover opacity-85 transition-all duration-[1000ms] ease-out group-hover:scale-105 group-hover:opacity-100 filter contrast-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/[0.08] pointer-events-none" />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ==================== FIXED HERO TYPOGRAPHY ==================== */}
      <div className="fixed bottom-0 left-0 w-full p-8   pointer-events-none z-30 flex flex-col items-center text-center">
        <p className="text-[15px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-4 font-mono">
          Be Creative. Be Collaborative.
        </p>
       <h1 className="text-3xl md:text-5xl font-normal tracking-tight max-w-3xl leading-[1.3] text-white/90 font-sans drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]">
  The real-time canvas for <br /> modern landscape architecture.
</h1>
      </div>

      {/* Deep Background Mask */}
      <div className="fixed bottom-0 left-0 w-full h-[35vh] bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/90 to-transparent pointer-events-none z-10" />
    </div>
  );
}