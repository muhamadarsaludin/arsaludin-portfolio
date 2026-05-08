"use client";

import { MiracleReveal, RevealAnimation } from "@/components/miracle/Reveal";
import React from "react";

const ALL_ANIMATIONS: RevealAnimation[] = [
  "fade-up", "fade-down", "fade-left", "fade-right",
  "zoom-in", "zoom-out",
  "slide-blur-up", "slide-blur-down",
  "flip-up", "flip-down",
  "reveal-text"
];

const AnimationTestPage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10 font-sans">
      {/* Header Section */}
      <section className="h-[60vh] flex flex-col justify-center items-center text-center">
        <MiracleReveal animation="slide-blur-up" duration={1}>
          <h1 className="text-6xl font-bold mb-4">Miracle Reveal Playground</h1>
        </MiracleReveal>
        <MiracleReveal animation="fade-up" delay={0.3}>
          <p className="text-neutral-400 text-xl">Scroll down to test all animation variants</p>
        </MiracleReveal>
      </section>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {ALL_ANIMATIONS.map((anim, index) => (
          <MiracleReveal 
            key={anim} 
            animation={anim} 
            delay={(index % 3) * 0.1} // Stagger effect sederhana
            className="h-full"
          >
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl h-64 flex flex-col justify-center items-center group hover:border-blue-500 transition-colors">
              <span className="text-blue-500 font-mono text-sm mb-2">variant:</span>
              <h3 className="text-2xl font-semibold capitalize">{anim.replace(/-/g, ' ')}</h3>
              <p className="text-neutral-500 mt-4 text-center text-sm">
                This card uses the "{anim}" animation variant.
              </p>
            </div>
          </MiracleReveal>
        ))}
      </div>

      {/* Custom Distance Test */}
      <section className="mt-40 mb-20 text-center">
        <MiracleReveal animation="fade-up" distance={200} duration={1.5}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-20 rounded-3xl">
            <h2 className="text-4xl font-bold">Dramatically Far Distance Test</h2>
            <p className="mt-2 text-blue-100">Testing distance={200} for longer travel</p>
          </div>
        </MiracleReveal>
      </section>

      {/* Footer Simulation */}
      <footer className="h-[40vh] flex items-center justify-center border-t border-neutral-800 mt-20">
        <MiracleReveal animation="reveal-text">
          <p className="text-neutral-600">© 2026 Miracle Design System</p>
        </MiracleReveal>
      </footer>
    </div>
  );
};

export default AnimationTestPage;