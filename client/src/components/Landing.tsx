import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import hand from "../assets/hands.png";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1500", 
          scrub: true,
          pin: true,
        }
      });

      tl.from(".top-hand", { y: "-20vh", duration: 1 }, 0)
        .from(".bottom-hand", { y: "30vh", duration: 1 }, 0)
        .from(".left-hand", { x: "-34vw", duration: 1 }, 0)
        .from(".right-hand", { x: "34vw", duration: 1 }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full bg-[#f5f1e8] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <h1 className="text-6xl font-bold text-[#36533C]">
          Design Together
        </h1>
      </div>

      <img
        src={hand}
        className="top-hand absolute w-80 top-1/2 left-1/2 z-10"
        style={{ transform: "translate(-50%, -50%)  rotate(180deg)",transformOrigin: "center 40%" }}
        alt="Top Hand"
      />

      <img
        src={hand}
        className="bottom-hand absolute mt-10 w-80 top-1/2 left-1/2 z-30"
        style={{ transform: "translate(-50%, -50%) rotate(0deg)",transformOrigin: "center 20%" }}
        alt="Bottom Hand"
      />

      <img
        src={hand}
        className="left-hand absolute mt-20 w-80 top-1/2 left-1/2 z-40"
        style={{ transform: "translate(-50%, -50%) rotate(90deg)",transformOrigin: "center 30%" }}
        alt="Left Hand"
      />

      <img
        src={hand}
        className="right-hand absolute mt-20 w-80 top-1/2 left-1/2 z-20"
        style={{ transform: "translate(-50%, -50%) rotate(-90deg)",transformOrigin: "center 30%" }}
        alt="Right Hand"
      />
    </section>
  );
}