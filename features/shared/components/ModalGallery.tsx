"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { cn } from "@/utils/class-name"
import { useTranslations } from "use-intl"
import MiracleModal from "@/components/miracle/Modal"
import {
  LuCalendar,
  LuMapPin,
  LuChevronLeft,
  LuChevronRight,
  LuPlus,
  LuMinus,
} from "react-icons/lu"

type GalleryImage = {
  id: string | number
  image_url: string
  alt: string
}

type ModalGalleryProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  images: GalleryImage[]
  initialIndex: number
  metaTitle?: string
  startDate?: string
  endDate?: string
  location?: string
}

export default function ModalGallery({
  isOpen,
  onClose,
  title,
  images = [],
  initialIndex = 0,
  metaTitle,
  startDate,
  endDate,
  location,
}: ModalGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex)
  const [zoomScale, setZoomScale] = useState<number>(1)
  const t = useTranslations("components.experienceCard")

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [prevInitialIndex, setPrevInitialIndex] = useState<number>(initialIndex)
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen)

  if (initialIndex !== prevInitialIndex || isOpen !== prevIsOpen) {
    setPrevInitialIndex(initialIndex)
    setPrevIsOpen(isOpen)
    setSelectedIndex(initialIndex)
    setZoomScale(1)
  }

  const currentImage = images[selectedIndex]

  const handleNext = useCallback(() => {
    if (images.length) {
      setZoomScale(1)
      setSelectedIndex((prev) => (prev + 1) % images.length)
    }
  }, [images.length])

  const handlePrev = useCallback(() => {
    if (images.length) {
      setZoomScale(1)
      setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }, [images.length])

  useEffect(() => {
    if (isOpen && thumbnailRefs.current[selectedIndex]) {
      thumbnailRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [selectedIndex, isOpen])

  useEffect(() => {
    if (!isOpen) {
      thumbnailRefs.current = []
    }
  }, [isOpen])

  // ⌨️ Clean Navigation Keyboard Event Listeners
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, handleNext, handlePrev])

  if (!images.length || !currentImage) return null

  return (
    <MiracleModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title={title}
      className="h-full max-h-[85vh]"
      noContentPadding
    >
      <div className="bg-primary flex h-full w-full flex-col overflow-hidden rounded-b-3xl md:flex-row">
        {/* --- LEFT SIDE: VIEWPORT & AUTOSCROLL THUMBNAILS --- */}
        <div className="flex h-full w-full flex-col overflow-hidden">
          {/* Main Image Preview Window */}
          <div className="group/preview relative flex w-full flex-1 overflow-hidden p-5 md:p-6">
            <div className="bg-secondary flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
              <div
                className="relative h-full w-full transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <Image
                  src={currentImage.image_url}
                  alt={currentImage.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 950px"
                  priority
                />
              </div>
            </div>

            {/* Floating Zoom Controls */}
            <div className="bg-neutral-low text-primary border-primary absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border p-0.5 opacity-0 transition-all duration-300 ease-in-out group-hover/preview:opacity-100">
              <button
                onClick={() => setZoomScale((prev) => Math.max(prev - 0.5, 1))}
                className="cursor-zoom-out rounded-full p-2 transition-colors duration-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <LuMinus size={16} />
              </button>
              <span className="min-w-8.75 text-center font-mono text-[10px]">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(prev + 0.5, 3))}
                className="cursor-zoom-in rounded-full p-2 transition-colors duration-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <LuPlus size={16} />
              </button>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 transition-all duration-300 ease-in-out group-hover/preview:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  className="border-primary z-20 cursor-pointer rounded-full border bg-neutral-200 p-2 transition-all duration-300 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <LuChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="border-primary z-20 cursor-pointer rounded-full border bg-neutral-200 p-2 transition-all duration-300 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Thumbnail Navigation Carousel */}
          {images.length > 1 && (
            <div className="border-primary bg-card flex shrink-0 items-center border-t px-5 py-2 md:px-6">
              <div
                ref={scrollContainerRef}
                className="scrollbar-hide flex min-h-12 w-full snap-x snap-mandatory items-center gap-2 overflow-x-auto md:min-h-20 [&::-webkit-scrollbar]:hidden"
              >
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    ref={(el) => {
                      thumbnailRefs.current[idx] = el
                    }}
                    onClick={() => {
                      setZoomScale(1)
                      setSelectedIndex(idx)
                    }}
                    className={cn(
                      "relative aspect-3/2 shrink-0 cursor-pointer snap-start overflow-hidden rounded-md transition-all",
                      selectedIndex === idx
                        ? "border-blue h-12 border-2 md:h-20"
                        : "border-primary h-10 border opacity-50 hover:opacity-100 md:h-18"
                    )}
                  >
                    <Image
                      src={img.image_url}
                      alt={`Thumbnail ${idx}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: DETAILED METADATA PANEL --- */}
        {(metaTitle || startDate || location) && (
          <div className="border-primary bg-primary flex h-fit w-full shrink-0 flex-col border-t p-5 md:h-full md:w-75 md:border-t-0 md:border-l md:p-6">
            <h3 className="text-primary mb-3 leading-tight font-semibold md:mb-6 md:text-lg">
              {metaTitle || currentImage.alt}
            </h3>

            <div className="border-primary flex flex-row items-center justify-between gap-2 border-y py-3 md:flex-col md:items-start md:gap-4 md:py-6">
              {(startDate || endDate) && (
                <div className="flex items-start gap-3">
                  <div className="bg-neutral-low text-secondary hidden rounded-lg p-2 md:block">
                    <LuCalendar size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-secondary text-[10px] tracking-tight uppercase">
                      {t("timelineLabel")}
                    </span>
                    <span className="text-sm font-medium">
                      {startDate} {endDate ? `- ${endDate}` : ""}
                    </span>
                  </div>
                </div>
              )}

              {location && (
                <div className="flex items-start gap-3">
                  <div className="bg-neutral-low text-secondary hidden rounded-lg p-2 md:block">
                    <LuMapPin size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-secondary text-[10px] tracking-tight uppercase">
                      {t("locationLabel")}
                    </span>
                    <span className="text-sm font-medium">{location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Counter & Tip Info */}
            <div className="mt-auto flex flex-col gap-3 pt-3 md:gap-4 md:pt-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-medium">
                  {t("imageCounter", { current: selectedIndex + 1, total: images.length })}
                </span>
                <div
                  className={cn(
                    "h-1 w-4 rounded-full transition-colors duration-300",
                    zoomScale > 1 ? "bg-blue-500" : "bg-neutral-med"
                  )}
                />
              </div>

              <p className="bg-secondary text-secondary border-primary rounded-lg border border-dashed p-3 text-xs leading-relaxed italic">
                {t("tipLabel")}: {t("tip")}
              </p>
            </div>
          </div>
        )}
      </div>
    </MiracleModal>
  )
}
