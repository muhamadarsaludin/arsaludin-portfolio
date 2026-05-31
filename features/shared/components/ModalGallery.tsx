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
  LuMinus
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
    setSelectedIndex(initialIndex)
    setZoomScale(1)
    if (!isOpen) {
      thumbnailRefs.current = []
    }
  }, [initialIndex, isOpen])

  // ⌨️ Clean Navigation Keyboard Event Listeners
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
      // Note: Escape key handling is now completely offloaded to MiracleModal
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, handleNext, handlePrev])

  // 🛡️ Safety Gate: Only prevent rendering if data is genuinely corrupted or empty
  if (!images.length || !currentImage) return null

  return (
    <MiracleModal
      isOpen={isOpen} // 👈 Pass the open gate cleanly to let internal states handle animations
      onClose={onClose}
      size="full"
      title={title}
      className="max-h-[85vh] h-full"
      noContentPadding
    >
      <div className="flex h-full w-full flex-col md:flex-row overflow-hidden bg-primary rounded-b-3xl"> 
        
        {/* --- LEFT SIDE: VIEWPORT & AUTOSCROLL THUMBNAILS --- */}
        <div className="w-full h-full flex flex-col overflow-hidden">
          
          {/* Main Image Preview Window */}
          <div className="flex-1 flex w-full p-5 md:p-6 overflow-hidden relative group/preview">
            <div className="h-full w-full flex items-center justify-center overflow-hidden bg-secondary rounded-2xl">
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full p-0.5 bg-neutral-low text-primary border border-primary opacity-0 group-hover/preview:opacity-100 transition-all duration-300 ease-in-out">
              <button 
                onClick={() => setZoomScale(prev => Math.max(prev - 0.5, 1))} 
                className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full cursor-zoom-out transition-colors duration-300"
              >
                <LuMinus size={16} />
              </button>
              <span className="text-[10px] font-mono min-w-8.75 text-center">{Math.round(zoomScale * 100)}%</span>
              <button 
                onClick={() => setZoomScale(prev => Math.min(prev + 0.5, 3))} 
                className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full cursor-zoom-in transition-colors duration-300"
              >
                <LuPlus size={16} />
              </button>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 ease-in-out">
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
                  className="cursor-pointer z-20 rounded-full p-2 border border-primary bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all duration-300"
                >
                  <LuChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                  className="cursor-pointer z-20 rounded-full p-2 border border-primary bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all duration-300"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Thumbnail Navigation Carousel */}
          {images.length > 1 && (
            <div className="shrink-0 border-t border-primary flex items-center px-5 md:px-6 py-2 bg-card">
              <div 
                ref={scrollContainerRef} 
                className="scrollbar-hide snap-x snap-mandatory flex items-center gap-2 overflow-x-auto min-h-12 md:min-h-20 w-full [&::-webkit-scrollbar]:hidden"
              >
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    ref={(el) => { thumbnailRefs.current[idx] = el }}
                    onClick={() => { setZoomScale(1); setSelectedIndex(idx); }}
                    className={cn(
                      "relative snap-start aspect-3/2 shrink-0 rounded-md overflow-hidden transition-all cursor-pointer",
                      selectedIndex === idx 
                        ? "border-2 border-blue h-12 md:h-20" 
                        : "border border-primary h-10 md:h-18 opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image src={img.image_url} alt={`Thumbnail ${idx}`} fill className="object-cover" sizes="150px" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: DETAILED METADATA PANEL --- */}
        {(metaTitle || startDate || location) && (
          <div className="w-full md:w-75 h-fit md:h-full border-t md:border-t-0 md:border-l border-primary p-5 md:p-6 flex flex-col bg-primary shrink-0">
            <h3 className="md:text-lg font-semibold leading-tight text-primary mb-3 md:mb-6">
              {metaTitle || currentImage.alt}
            </h3>

            <div className="flex flex-row md:flex-col gap-2 md:gap-4 justify-between items-center md:items-start border-y border-primary py-3 md:py-6">
              {(startDate || endDate) && (
                <div className="flex items-start gap-3">
                  <div className="hidden md:block p-2 rounded-lg bg-neutral-low text-secondary">
                    <LuCalendar size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-tight text-secondary">{t("timelineLabel")}</span>
                    <span className="text-sm font-medium">{startDate} {endDate ? `- ${endDate}` : ""}</span>
                  </div>
                </div>
              )}
              
              {location && (
                <div className="flex items-start gap-3">
                  <div className="hidden md:block p-2 rounded-lg bg-neutral-low text-secondary">
                    <LuMapPin size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-tight text-secondary">{t("locationLabel")}</span>
                    <span className="text-sm font-medium">{location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Counter & Tip Info */}
            <div className="mt-auto pt-3 md:pt-6 flex flex-col gap-3 md:gap-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary font-medium">
                  {t("imageCounter", { current: selectedIndex + 1, total: images.length })}
                </span>
                <div className={cn(
                  "h-1 w-4 rounded-full transition-colors duration-300",
                  zoomScale > 1 ? "bg-blue-500" : "bg-neutral-med"
                )} />
              </div>

              <p className="text-xs italic bg-secondary text-secondary p-3 rounded-lg border border-dashed border-primary leading-relaxed">
                {t("tipLabel")}: {t("tip")}
              </p>
            </div>
          </div>
        )}
      </div>
    </MiracleModal>
  )
}