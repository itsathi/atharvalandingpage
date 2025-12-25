// This utility synchronizes Lenis with GSAP's ScrollTrigger for smooth scroll-based animations
import { useEffect } from "react";

export function useLenisGsapSync(lenis: any) {
  useEffect(() => {
    if (!lenis) return;
    let ScrollTrigger: any;
    let gsap: any;
    // Dynamically import gsap and ScrollTrigger to avoid SSR issues
    import("gsap").then((mod) => {
      gsap = mod.default;
      import("gsap/ScrollTrigger").then((st) => {
        ScrollTrigger = st.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", ScrollTrigger.update);
      });
    });
    return () => {
      if (lenis && ScrollTrigger) {
        lenis.off("scroll", ScrollTrigger.update);
      }
    };
  }, [lenis]);
}
