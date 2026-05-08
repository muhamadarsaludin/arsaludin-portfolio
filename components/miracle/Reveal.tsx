"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMediaQuery, Breakpoint } from "@/hooks/useMediaQuery";

export type RevealAnimation =
  | "fade" | "fade-up" | "fade-down" | "fade-left" | "fade-right"
  | "zoom-in" | "zoom-out" | "slide-blur-up" | "slide-blur-down"
  | "flip-up" | "flip-down" | "reveal-text"
  | "skew-up" | "skew-down";

/**
 * Generic Responsive Type
 */
export type ResponsiveValue<T> = T | {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
  mobile?: T;
  tablet?: T;
  desktop?: T;
};

export type ResponsiveAnimation = ResponsiveValue<RevealAnimation>;

interface MiracleRevealProps {
  children: React.ReactNode;
  animation?: ResponsiveAnimation;
  duration?: ResponsiveValue<number>;
  delay?: ResponsiveValue<number>;
  threshold?: ResponsiveValue<number>;
  distance?: ResponsiveValue<number>;
  once?: ResponsiveValue<boolean>;
  className?: string;
}

const revealVariants: Record<string, any> = {
  "fade": { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  "fade-up": { hidden: (d: number) => ({ opacity: 0, y: d }), visible: { opacity: 1, y: 0 } },
  "fade-down": { hidden: (d: number) => ({ opacity: 0, y: -d }), visible: { opacity: 1, y: 0 } },
  "fade-left": { hidden: (d: number) => ({ opacity: 0, x: d }), visible: { opacity: 1, x: 0 } },
  "fade-right": { hidden: (d: number) => ({ opacity: 0, x: -d }), visible: { opacity: 1, x: 0 } },
  "zoom-in": { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
  "zoom-out": { hidden: { opacity: 0, scale: 1.05 }, visible: { opacity: 1, scale: 1 } },
  "slide-blur-up": { hidden: (d: number) => ({ opacity: 0, y: d, filter: "blur(10px)" }), visible: { opacity: 1, y: 0, filter: "blur(0px)" } },
  "slide-blur-down": { hidden: (d: number) => ({ opacity: 0, y: -d, filter: "blur(10px)" }), visible: { opacity: 1, y: 0, filter: "blur(0px)" } },
  "flip-up": { hidden: (d: number) => ({ opacity: 0, y: d, rotateX: -20 }), visible: { opacity: 1, y: 0, rotateX: 0 } },
  "flip-down": { hidden: (d: number) => ({ opacity: 0, y: -d, rotateX: 20 }), visible: { opacity: 1, y: 0, rotateX: 0 } },
  "reveal-text": { hidden: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }, visible: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } },
  "skew-up": { hidden: (d: number) => ({ opacity: 0, y: d, skewY: 5, transformOrigin: "top left" }), visible: { opacity: 1, y: 0, skewY: 0 } },
  "skew-down": { hidden: (d: number) => ({ opacity: 0, y: -d, skewY: -5, transformOrigin: "bottom right" }), visible: { opacity: 1, y: 0, skewY: 0 } },
};

export const MiracleReveal = ({
  children,
  animation = "fade-up",
  duration = 0.6,
  delay = 0,
  className = "",
  once = false,
  threshold = 0.1,
  distance = 80,
}: MiracleRevealProps) => {
  const { breakpoint, isDesktop, isTablet, isMobile } = useMediaQuery();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Logic Resolver
   */
  const resolveValue = <T,>(input: ResponsiveValue<T>, defaultValue: T): T => {
    if (typeof input !== "object" || input === null) return input as T;
    
    const res = input as any;
    if (!mounted) return res.default ?? res.mobile ?? defaultValue;

    const bpOrder: Breakpoint[] = ["2xl", "xl", "lg", "md", "sm", "default"];
    const currentIndex = bpOrder.indexOf(breakpoint);

    for (let i = currentIndex; i < bpOrder.length; i++) {
      const key = bpOrder[i];
      if (res[key] !== undefined) return res[key];
    }

    if (isDesktop && res.desktop !== undefined) return res.desktop;
    if (isTablet && res.tablet !== undefined) return res.tablet;
    if (isMobile && res.mobile !== undefined) return res.mobile;

    return res.default ?? res.mobile ?? defaultValue;
  };

  const active = {
    anim: resolveValue(animation, "fade-up" as RevealAnimation),
    duration: resolveValue(duration, 0.6),
    delay: resolveValue(delay, 0),
    threshold: resolveValue(threshold, 0.1),
    distance: resolveValue(distance, 100),
    once: resolveValue(once, false),
  };

  return (
    <div className={className}>
      <motion.div
        key={mounted ? `${active.anim}-${active.duration}-${active.distance}` : "ssr"}
        custom={active.distance}
        initial="hidden"
        whileInView="visible"
        viewport={{ 
          once: active.once, 
          amount: active.threshold,
          margin: "0px 0px -20px 0px" 
        }}
        className="h-full w-full"
        variants={revealVariants[active.anim] || revealVariants["fade-up"]}
        transition={{
          duration: active.duration,
          delay: active.delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          willChange: "transform, opacity, filter",
          backfaceVisibility: "hidden",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};