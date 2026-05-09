"use client"

import React from "react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import MiracleButton from "@/components/miracle/Button"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { LuHouse, LuArrowLeft } from "react-icons/lu"
import Container from "@/components/Container"
import LiquidEther from "@/components/react-bits/LiquidEther"
import clsx from "clsx"

export default function NotFound() {
  const t = useTranslations("pages.404")

  return (
    <div
      className="relative h-screen w-full overflow-hidden -mt-25 lg:-mt-30 pt-17">
      <LiquidEther
        colors={["#2563EB", "#22D3EE", "#8B5CF6"]}
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
    
      <Container className="flex items-center justify-center h-full absolute inset-0 z-20">
        <MiracleReveal animation="zoom-in" delay={0.1}>
          <div className="text-center">
            <h1 className="text-8xl md:text-gxl lg:text-[10rem] font-black text-primary mb-6 md:mb-8">
              404
            </h1>
            <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl">
              {t("title")}
            </h2>
            <p className="mx-auto max-w-lg text-sm sm:text-base text-secondary mt-1">
              {t("description")}
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <MiracleButton
                variant="secondary"
                startIcon={<LuArrowLeft />}
                onClick={() => window.history.back()}
              >
                {t("backButton")}
              </MiracleButton>

              <Link href="/">
                <MiracleButton startIcon={<LuHouse />}>
                  {t("homeButton")}
                </MiracleButton>
              </Link>
            </div>
          </div>
        </MiracleReveal>
      </Container>
    </div>
    // <Container className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden">
    //   <div className="absolute -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
    //   <div className="absolute top-1/4 left-1/4 -z-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />

    //   <div className="text-center">
    //     <MiracleReveal animation="zoom-in" delay={0.1}>
    //       <h1 className="text-9xl font-black tracking-tighter text-primary/10 md:text-[12rem]">
    //         404
    //       </h1>
    //     </MiracleReveal>

    //     <div className="relative -mt-16 md:-mt-24">
    //       <MiracleReveal animation="fade-up" delay={0.3}>
          //   <h2 className="text-2xl font-bold text-primary md:text-4xl">
          //     {t("title")}
          //   </h2>
          //   <p className="mx-auto mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
          //     {t("description")}
          //   </p>
          // </MiracleReveal>

    //       <MiracleReveal animation="fade-up" delay={0.5}>
            // <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            //   <MiracleButton
            //     variant="secondary"
            //     startIcon={<LuArrowLeft />}
            //     onClick={() => window.history.back()}
            //   >
            //     {t("backButton")}
            //   </MiracleButton>

            //   <Link href="/">
            //     <MiracleButton startIcon={<LuHouse />}>
            //       {t("homeButton")}
            //     </MiracleButton>
            //   </Link>
            // </div>
    //       </MiracleReveal>
    //     </div>
    //   </div>

    //   <MiracleReveal animation="fade-up" delay={0.7} className="mt-20 hidden md:block">
        // <div className="rounded-xl border border-primary/5 bg-secondary/50 p-4 font-mono text-xs text-neutral-500 backdrop-blur-sm">
        //   <p>{"{"}</p>
        //   <p className="ml-4 italic">"status": 404,</p>
        //   <p className="ml-4 italic">"message": "{t("debugMessage")}",</p>
        //   <p className="ml-4 italic">"location": "unknown_space"</p>
        //   <p>{"}"}</p>
        // </div>
    //   </MiracleReveal>
    // </Container>
  )
}