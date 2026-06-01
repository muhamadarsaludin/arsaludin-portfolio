"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import MiracleModal from "./Modal"
import { 
  LuPlus, 
  LuMinus, 
  LuChevronLeft, 
  LuChevronRight, 
  LuMaximize2 
} from "react-icons/lu"
import { cn } from "@/utils/class-name"

interface ImageItem {
  image_url: string;
  alt?: string;
}

interface MiracleImagePreviewProps {
  images: ImageItem[];
  className?: string;        
  wrapperClassName?: string; 
  imageClassName?: string;   
  sizes?: string;            
}

export default function MiracleImagePreview({
  images,
  className,
  wrapperClassName,
  imageClassName = "object-cover",
  sizes = "(max-width: 768px) 100vw, 1350px",
}: MiracleImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoomScale, setZoomScale] = useState(1)

  const hasMultipleImages = images?.length > 1

  const handleNext = useCallback(() => {
    if (!hasMultipleImages) return
    setZoomScale(1)
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }, [images.length, hasMultipleImages])

  const handlePrev = useCallback(() => {
    if (!hasMultipleImages) return
    setZoomScale(1)
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length, hasMultipleImages])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !hasMultipleImages) return
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, hasMultipleImages, handleNext, handlePrev])

  if (!images || images.length === 0) return null

  const currentImage = images[selectedIndex]
  const displayTitle = currentImage?.alt || "Preview Image"

  const renderItems = () => {
    return images.map((img, index) => (
      <div
        key={index}
        onClick={() => {
          setSelectedIndex(index)
          setIsOpen(true)
        }}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-xl border border-primary bg-secondary shadow-sm transition-all hover:shadow-md w-full h-auto block",
          className
        )}
      >
        <Image
          src={img.image_url}
          alt={img.alt || "Preview Image"}
          fill
          sizes={sizes}
          className={cn("relative! h-auto! w-full transition-transform duration-500 group-hover:scale-110", imageClassName)}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
          <div className="rounded-full bg-white/10 p-3 backdrop-blur-md border border-white/20 text-white shadow-xl">
            <LuMaximize2 size={20} />
          </div>
        </div>
      </div>
    ))
  }

  return (
    <>
      {hasMultipleImages ? (
        <div className={wrapperClassName}>{renderItems()}</div>
      ) : (
        renderItems()
      )}

      <MiracleModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setZoomScale(1)
        }}
        size="full"
        title={displayTitle}
        className="max-h-[85vh] h-full"
        noContentPadding
      >
        <div className="flex h-full w-full flex-col overflow-hidden bg-primary rounded-b-3xl">
          <div className="flex-1 flex w-full p-5 md:p-6 overflow-hidden relative group/preview">
            <div className="h-full w-full flex items-center justify-center overflow-hidden bg-secondary rounded-2xl relative">
              <div
                className={cn(
                  "relative h-full w-full flex items-center justify-center",
                  zoomScale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                )}
                style={{ transform: `scale(${zoomScale})` }}
              >
                <Image
                  src={currentImage.image_url}
                  alt={displayTitle}
                  fill
                  className="object-contain"
                  sizes={sizes}
                  priority
                />
              </div>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full p-0.5 bg-neutral-low text-primary border border-primary opacity-0 group-hover/preview:opacity-100 transition-all duration-300 ease-in-out">
              <button
                onClick={() => setZoomScale((prev) => Math.max(prev - 0.5, 1))}
                className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full cursor-zoom-out transition-colors ease-in-out duration-300"
              >
                <LuMinus size={16} />
              </button>
              <span className="text-[10px] font-mono min-w-8.75 text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(prev + 0.5, 3))}
                className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full cursor-zoom-in transition-colors ease-in-out duration-300"
              >
                <LuPlus size={16} />
              </button>
            </div>

            {hasMultipleImages && (
              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 ease-in-out pointer-events-none">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev() }}
                  className="cursor-pointer pointer-events-auto z-20 rounded-full p-2 border border-primary bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all ease-in-out duration-300"
                >
                  <LuChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext() }}
                  className="cursor-pointer pointer-events-auto z-20 rounded-full p-2 border border-primary bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all ease-in-out duration-300"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {hasMultipleImages && (
            <div className="shrink-0 border-t border-primary flex items-center px-5 md:px-6 py-2">
              <div className="scrollbar-hide snap-x snap-mandatory flex items-center gap-2 overflow-x-auto min-h-12 md:min-h-20 w-full justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setZoomScale(1)
                      setSelectedIndex(idx)
                    }}
                    className={cn(
                      "relative snap-start aspect-3/2 shrink-0 rounded-md overflow-hidden transition-all cursor-pointer",
                      selectedIndex === idx
                        ? "border-2 border-blue h-12 md:h-20"
                        : "border border-primary h-10 md:h-18 opacity-50 hover:opacity-100"
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
      </MiracleModal>
    </>
  )
}