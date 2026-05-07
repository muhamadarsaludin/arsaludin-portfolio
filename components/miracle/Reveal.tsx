"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export type RevealAnimation =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "slide-blur-up"
  | "slide-blur-down"
  | "flip-up"
  | "flip-down"
  | "skew-left"
  | "skew-right"
  | "scale-in-bottom"
  | "reveal-text";

interface RevealProps {
  children: React.ReactNode;
  /** The type of animation to be applied from the available list */
  animation?: RevealAnimation;
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Delay before the animation starts in seconds (default: 0) */
  delay?: number;
  /** Additional CSS classes (crucial for 'h-full' in Grid layouts) */
  className?: string;
  /** Whether the animation should only run once */
  once?: boolean;
  /** The percentage of the element's visibility (0 to 1) to trigger the animation */
  threshold?: number;
  /** The sliding distance for the animation in pixels (default: 50) */
  distance?: number;
}

const revealVariants: Record<RevealAnimation, Variants> = {
  "fade-up": {
    hidden: (d: number) => ({ opacity: 0, y: d }),
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: (d: number) => ({ opacity: 0, y: -d }),
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: (d: number) => ({ opacity: 0, x: d }),
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: (d: number) => ({ opacity: 0, x: -d }),
    visible: { opacity: 1, x: 0 },
  },
  "zoom-in": {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  "zoom-out": {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1 },
  },
  "slide-blur-up": {
    hidden: (d: number) => ({ opacity: 0, y: d, filter: "blur(12px)" }),
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "slide-blur-down": {
    hidden: (d: number) => ({ opacity: 0, y: -d, filter: "blur(12px)" }),
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "flip-up": {
    hidden: (d: number) => ({ opacity: 0, y: d, rotateX: -25 }),
    visible: { opacity: 1, y: 0, rotateX: 0 },
  },
  "flip-down": {
    hidden: (d: number) => ({ opacity: 0, y: -d, rotateX: 25 }),
    visible: { opacity: 1, y: 0, rotateX: 0 },
  },
  "skew-left": {
    hidden: (d: number) => ({ opacity: 0, x: d, skewX: 10 }),
    visible: { opacity: 1, x: 0, skewX: 0 },
  },
  "skew-right": {
    hidden: (d: number) => ({ opacity: 0, x: -d, skewX: -10 }),
    visible: { opacity: 1, x: 0, skewX: 0 },
  },
  "scale-in-bottom": {
    hidden: { opacity: 0, scaleY: 0, originY: 1 },
    visible: { opacity: 1, scaleY: 1, originY: 1 },
  },
  "reveal-text": {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    visible: { clipPath: "inset(0% 0% 0% 0%)" },
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
}: RevealProps) => {
  return (
    <motion.div
      custom={distance}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={revealVariants[animation]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={animation.includes("flip") ? { perspective: 1000 } : {}}
    >
      {children}
    </motion.div>
  );
};