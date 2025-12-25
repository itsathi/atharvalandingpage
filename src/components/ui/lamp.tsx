"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className=" bg-gradient-to-br from-slate-300 to-slate-500 
                   py-4 bg-clip-text text-center text-4xl 
                   font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  );
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative w-full bg-slate-950 overflow-hidden rounded-md flex flex-col items-center justify-center py-16",
        className
      )}
    >
      {/* GLOW WRAPPER (fixed height, no flex-1) */}
      <div className="relative w-full h-56  flex items-center justify-center isolate">
        {/* Left glow */}
        <motion.div
          initial={{ opacity: 0.5, width: "12rem" }}
          whileInView={{ opacity: 1, width: "24rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute right-1/2 h-56 w-[24rem] bg-gradient-conic 
                     from-cyan-500 via-transparent to-transparent
                     [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-full left-0 bg-slate-950 h-40 bottom-0 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full left-0 bg-slate-950 bottom-0 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right glow */}
        <motion.div
          initial={{ opacity: 0.5, width: "12rem" }}
          whileInView={{ opacity: 1, width: "24rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute left-1/2 h-56 w-[24rem] bg-gradient-conic 
                     from-transparent via-transparent to-cyan-500
                     [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-full right-0 bg-slate-950 bottom-0 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-slate-950 h-40 bottom-0 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Center glow layers */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>

        {/* Cyan line */}
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        />

        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400"
        />

        {/* Top cover */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 " />
      </div>

      {/* Content */}
      <div className="relative z-50 flex flex-col items-center text-center ">
        {children}
      </div>
    </div>
  );
};
