"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { EncryptedText } from "@/components/ui/encrypted-text";

export default function Preloader({
  progress,
  onComplete,
}: {
  progress: number;
  onComplete: () => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (progress === 100) {
      gsap.timeline({ onComplete })
        .to(text.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .to(wrapper.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
        });
    }
  }, [progress, onComplete]);

  return (
    <div ref={wrapper} className="fixed inset-0 z-[9998] bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-64 h-[3px] bg-white/20 mb-2">
          <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-white/70 text-xs mb-6">{progress}%</p>
        <h1
          ref={text}
          className="opacity-0 translate-y-6 tracking-[0.4em] text-white"
        >
            <EncryptedText
        text="Atharva Acharya"
        encryptedClassName="text-neutral-500"
        revealedClassName="dark:text-white text-black"
        revealDelayMs={50}
      />
        </h1>
      </div>
    </div>
  );
}
