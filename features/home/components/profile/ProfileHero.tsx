"use client"

import BlurText from '@/components/react-bits/BlurText'
import { useAnimateOnInView } from '@/hooks/useAnimateOnInView'
import LiquidEther from '@/components/react-bits/LiquidEther'
import Image from "next/image"

type ProfileHeroProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export default function ProfileHero({className, ...props}: ProfileHeroProps) {
  return (
    <div 
      {...props}
      className="w-full h-50 md:h-70 lg:h-85 xl:h-100 rounded-2xl relative border border-gray-950/10 dark:border-white/10 bg-black overflow-hidden"
    >
      <div style={{ width: '100%', height: "100%", position: 'relative' }} className="z-1 hidden md:block">
        <LiquidEther
          colors={['#2563EB', '#22D3EE', '#8B5CF6']}
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
      />
      <BlurText
        text="Think . Design . Develop"
        delay={200}
        animateBy="words"
        direction="top"
        className="text-2xl md:text-6xl lg:text-[5rem] xl:text-8xl font-semibold mb-9 md:mb-8 absolute z-2 bottom-0 inset-x-0 justify-center leading-tight px-6"
        spanClassName="bg-linear-to-b from-neutral-100 to-neutral-950 bg-clip-text text-transparent"
        style={{ wordSpacing: "-1rem" }}
      />
    </div>
  )
}
