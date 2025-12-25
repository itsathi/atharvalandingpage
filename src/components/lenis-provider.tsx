"use client";

import { useRef, useEffect } from "react";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- GSAP ScrollTrigger sync ---
    let ScrollTrigger: any;
    let gsap: any;
    let cleanup: (() => void) | undefined;
    import("gsap").then((mod) => {
      gsap = mod.default;
      import("gsap/ScrollTrigger").then((st) => {
        ScrollTrigger = st.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", ScrollTrigger.update);
        cleanup = () => lenis.off("scroll", ScrollTrigger.update);
      });
    });

    return () => {
      lenis.destroy();
      if (cleanup) cleanup();
    };
  }, []);

  return <>{children}</>;
}

