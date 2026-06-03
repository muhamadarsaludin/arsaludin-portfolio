"use client"

import { useTranslations } from "next-intl"
import MiracleButton from "@/components/miracle/Button"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { LuHouse, LuArrowLeft } from "react-icons/lu"
import Container from "@/components/Container"
import LiquidEther from "@/components/react-bits/LiquidEther"

export default function NotFound() {
  const t = useTranslations("pages.404")

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div className="relative -mt-25 h-screen w-full overflow-hidden pt-17 lg:-mt-30">
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

      <Container className="absolute inset-0 z-20 flex h-full items-center justify-center">
        <MiracleReveal animation="zoom-in" delay={0.1}>
          <div className="text-center">
            <h1 className="md:text-gxl text-primary mb-6 text-8xl font-black md:mb-8 lg:text-[10rem]">
              404
            </h1>
            <h2 className="text-xl font-semibold md:text-2xl lg:text-3xl">{t("title")}</h2>
            <p className="text-secondary mx-auto mt-1 max-w-lg text-sm sm:text-base">
              {t("description")}
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <MiracleButton
                variant="secondary"
                startIcon={<LuArrowLeft />}
                onClick={() => handleBack()}
              >
                {t("backButton")}
              </MiracleButton>
              <MiracleButton href="/" startIcon={<LuHouse />}>
                {t("homeButton")}
              </MiracleButton>
            </div>
          </div>
        </MiracleReveal>
      </Container>
    </div>
  )
}
