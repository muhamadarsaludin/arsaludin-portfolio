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
 * Defines responsive animation properties.
 * Supports Tailwind-like breakpoints and legacy category fallbacks.
 */
export type ResponsiveAnimation = {
  default?: RevealAnimation;
  sm?: RevealAnimation;
  md?: RevealAnimation;
  lg?: RevealAnimation;
  xl?: RevealAnimation;
  "2xl"?: RevealAnimation;
  mobile?: RevealAnimation;
  tablet?: RevealAnimation;
  desktop?: RevealAnimation;
};

interface MiracleRevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation | ResponsiveAnimation;
  duration?: number;
  delay?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
  distance?: number;
}

/**
 * Animation variants for Framer Motion.
 * 'd' represents the distance prop passed via the 'custom' prop.
 */
const revealVariants: Record<string, any> = {
  "fade": { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1 } 
  },
  "fade-up": { 
    hidden: (d: number) => ({ opacity: 0, y: d }), 
    visible: { opacity: 1, y: 0 } 
  },
  "fade-down": { 
    hidden: (d: number) => ({ opacity: 0, y: -d }), 
    visible: { opacity: 1, y: 0 } 
  },
  "fade-left": { 
    hidden: (d: number) => ({ opacity: 0, x: d }), 
    visible: { opacity: 1, x: 0 } 
  },
  "fade-right": { 
    hidden: (d: number) => ({ opacity: 0, x: -d }), 
    visible: { opacity: 1, x: 0 } 
  },
  "zoom-in": { 
    hidden: { opacity: 0, scale: 0.95 }, 
    visible: { opacity: 1, scale: 1 } 
  },
  "zoom-out": { 
    hidden: { opacity: 0, scale: 1.05 }, 
    visible: { opacity: 1, scale: 1 } 
  },
  "slide-blur-up": { 
    hidden: (d: number) => ({ opacity: 0, y: d, filter: "blur(10px)" }), 
    visible: { opacity: 1, y: 0, filter: "blur(0px)" } 
  },
  "slide-blur-down": { 
    hidden: (d: number) => ({ opacity: 0, y: -d, filter: "blur(10px)" }), 
    visible: { opacity: 1, y: 0, filter: "blur(0px)" } 
  },
  "flip-up": { 
    hidden: (d: number) => ({ opacity: 0, y: d, rotateX: -20 }), 
    visible: { opacity: 1, y: 0, rotateX: 0 } 
  },
  "flip-down": { 
    hidden: (d: number) => ({ opacity: 0, y: -d, rotateX: 20 }), 
    visible: { opacity: 1, y: 0, rotateX: 0 } 
  },
  "reveal-text": { 
    hidden: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }, 
    visible: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } 
  },
  "skew-up": { 
    hidden: (d: number) => ({ opacity: 0, y: d, skewY: 5, transformOrigin: "top left" }), 
    visible: { opacity: 1, y: 0, skewY: 0 } 
  },
  "skew-down": { 
    hidden: (d: number) => ({ opacity: 0, y: -d, skewY: -5, transformOrigin: "bottom right" }), 
    visible: { opacity: 1, y: 0, skewY: 0 } 
  },
};

export const MiracleReveal = ({
  children,
  animation = "fade-up",
  duration = 0.6,
  delay = 0,
  className = "",
  once = true,
  threshold = 0.1,
  distance = 50,
}: MiracleRevealProps) => {
  const { breakpoint, isDesktop, isTablet, isMobile } = useMediaQuery();
  const [mounted, setMounted] = useState(false);

  // Handle hydration to prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Resolve the correct animation based on responsive priority.
   * Logic: Specific Breakpoint -> Cascade Down -> Category Fallback -> Default.
   */
  const getActiveAnimation = (): RevealAnimation => {
    // 1. If a simple string is provided, use it directly
    if (typeof animation === "string") return animation;

    // 2. Return fallback during SSR
    if (!mounted) return animation.default || animation.mobile || "fade-up";

    // 3. Tailwind-style Cascade Logic
    // Defined from largest to smallest to find the current active level
    const bpOrder: Breakpoint[] = ["2xl", "xl", "lg", "md", "sm", "default"];
    const currentIndex = bpOrder.indexOf(breakpoint);

    // Search from current breakpoint downwards (inheritance)
    for (let i = currentIndex; i < bpOrder.length; i++) {
      const key = bpOrder[i];
      const val = animation[key as keyof ResponsiveAnimation];
      if (val) return val;
    }

    // 4. Secondary Fallback using category flags
    if (isDesktop && animation.desktop) return animation.desktop;
    if (isTablet && animation.tablet) return animation.tablet;
    if (isMobile && animation.mobile) return animation.mobile;

    // 5. Final fallback
    return animation.default || animation.mobile || "fade-up";
  };

  const activeAnim = getActiveAnimation();

  return (
    <div className={className}>
      <motion.div
        key={mounted ? activeAnim : "ssr"}
        custom={distance}
        initial="hidden"
        whileInView="visible"
        viewport={{ 
          once, 
          amount: threshold,
          margin: "0px 0px -20px 0px" 
        }}
        variants={revealVariants[activeAnim] || revealVariants["fade-up"]}
        transition={{
          duration,
          delay,
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