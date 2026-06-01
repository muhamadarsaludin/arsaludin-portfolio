"use client"

import BlurText from "@/components/react-bits/BlurText"
import LiquidEther from "@/components/react-bits/LiquidEther"
import { cn } from "@/utils/class-name"
import Image from "next/image"

type ProfileHeroProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export default function ProfileHero({ className, ...props }: ProfileHeroProps) {
  return (
    <div
      {...props}
      className={cn(
        "border-primary relative h-50 w-full overflow-hidden rounded-2xl border bg-black md:h-70 lg:h-85 xl:h-100",
        className
      )}
    >
      <div
        style={{ width: "100%", height: "100%", position: "relative" }}
        className="z-1 hidden md:block"
      >
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
      </div>
      <Image
        className="absolute object-contain md:object-cover"
        src="/profile/background-profile.webp"
        alt="Think.Design.Develop"
        fill
        sizes="(max-width: 768px) 100vw, 1280px"
        priority
        fetchPriority="high"
      />
      <BlurText
        text="Think . Design . Develop"
        delay={200}
        animateBy="words"
        direction="top"
        className="absolute inset-x-0 bottom-0 z-2 mb-9 justify-center px-6 text-2xl leading-tight font-semibold md:mb-8 md:text-6xl lg:text-[5rem] xl:text-8xl"
        spanClassName="bg-linear-to-b from-neutral-100 to-neutral-950 bg-clip-text text-transparent"
        style={{ wordSpacing: "-1rem" }}
      />
    </div>
  )
}
