"use client"

import type { RevealAnimation } from "@/components/miracle/Reveal"
import { MiracleReveal } from "@/components/miracle/Reveal"
import React from "react"

const ALL_ANIMATIONS: RevealAnimation[] = [
  "fade-up",
  "fade-down",
  "fade-left",
  "fade-right",
  "zoom-in",
  "zoom-out",
  "slide-blur-up",
  "slide-blur-down",
  "flip-up",
  "flip-down",
  "reveal-text",
]

const AnimationTestPage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 p-10 font-sans text-white">
      {/* Header Section */}
      <section className="flex h-[60vh] flex-col items-center justify-center text-center">
        <MiracleReveal animation="slide-blur-up" duration={1}>
          <h1 className="mb-4 text-6xl font-bold">Miracle Reveal Playground</h1>
        </MiracleReveal>
        <MiracleReveal animation="fade-up" delay={0.3}>
          <p className="text-xl text-neutral-400">Scroll down to test all animation variants</p>
        </MiracleReveal>
      </section>

      {/* Grid Section */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {ALL_ANIMATIONS.map((anim, index) => (
          <MiracleReveal
            key={anim}
            animation={anim}
            delay={(index % 3) * 0.1} // Stagger effect sederhana
            className="h-full"
          >
            <div className="group flex h-64 flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 p-8 transition-colors hover:border-blue-500">
              <span className="mb-2 font-mono text-sm text-blue-500">variant:</span>
              <h3 className="text-2xl font-semibold capitalize">{anim.replace(/-/g, " ")}</h3>
              <p className="mt-4 text-center text-sm text-neutral-500">
                This card uses the animation variant.
              </p>
            </div>
          </MiracleReveal>
        ))}
      </div>

      {/* Custom Distance Test */}
      <section className="mt-40 mb-20 text-center">
        <MiracleReveal animation="fade-up" distance={200} duration={1.5}>
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-20">
            <h2 className="text-4xl font-bold">Dramatically Far Distance Test</h2>
            <p className="mt-2 text-blue-100">Testing distance={200} for longer travel</p>
          </div>
        </MiracleReveal>
      </section>

      {/* Footer Simulation */}
      <footer className="mt-20 flex h-[40vh] items-center justify-center border-t border-neutral-800">
        <MiracleReveal animation="reveal-text">
          <p className="text-neutral-600">© 2026 Miracle Design System</p>
        </MiracleReveal>
      </footer>
    </div>
  )
}

export default AnimationTestPage
