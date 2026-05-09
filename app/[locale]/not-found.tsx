"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import MiracleButton from "@/components/miracle/Button"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { LuHouse, LuArrowLeft } from "react-icons/lu"
import Container from "@/components/Container"
import LiquidEther from "@/components/react-bits/LiquidEther"

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
  )
}