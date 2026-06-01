"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import MiracleModal from "./Modal"
import { LuPlus, LuMinus, LuChevronLeft, LuChevronRight, LuMaximize2 } from "react-icons/lu"
import { cn } from "@/utils/class-name"

interface ImageItem {
  image_url: string
  alt?: string
}

interface MiracleImagePreviewProps {
  images: ImageItem[]
  className?: string
  wrapperClassName?: string
  imageClassName?: string
  sizes?: string
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
          "group border-primary bg-secondary relative block h-auto w-full cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md",
          className
        )}
      >
        <Image
          src={img.image_url}
          alt={img.alt || "Preview Image"}
          fill
          sizes={sizes}
          className={cn(
            "relative! h-auto! w-full transition-transform duration-500 group-hover:scale-110",
            imageClassName
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
          <div className="rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-xl backdrop-blur-md">
            <LuMaximize2 size={20} />
          </div>
        </div>
      </div>
    ))
  }

  return (
    <>
      {hasMultipleImages ? <div className={wrapperClassName}>{renderItems()}</div> : renderItems()}

      <MiracleModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setZoomScale(1)
        }}
        size="full"
        title={displayTitle}
        className="h-full max-h-[85vh]"
        noContentPadding
      >
        <div className="bg-primary flex h-full w-full flex-col overflow-hidden rounded-b-3xl">
          <div className="group/preview relative flex w-full flex-1 overflow-hidden p-5 md:p-6">
            <div className="bg-secondary relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
              <div
                className={cn(
                  "relative flex h-full w-full items-center justify-center",
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

            <div className="bg-neutral-low text-primary border-primary absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border p-0.5 opacity-0 transition-all duration-300 ease-in-out group-hover/preview:opacity-100">
              <button
                onClick={() => setZoomScale((prev) => Math.max(prev - 0.5, 1))}
                className="cursor-zoom-out rounded-full p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <LuMinus size={16} />
              </button>
              <span className="min-w-8.75 text-center font-mono text-[10px]">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(prev + 0.5, 3))}
                className="cursor-zoom-in rounded-full p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <LuPlus size={16} />
              </button>
            </div>

            {hasMultipleImages && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2 opacity-0 transition-all duration-300 ease-in-out group-hover/preview:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  className="border-primary pointer-events-auto z-20 cursor-pointer rounded-full border bg-neutral-200 p-2 transition-all duration-300 ease-in-out hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <LuChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="border-primary pointer-events-auto z-20 cursor-pointer rounded-full border bg-neutral-200 p-2 transition-all duration-300 ease-in-out hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {hasMultipleImages && (
            <div className="border-primary flex shrink-0 items-center border-t px-5 py-2 md:px-6">
              <div className="scrollbar-hide flex min-h-12 w-full snap-x snap-mandatory items-center justify-center gap-2 overflow-x-auto md:min-h-20">
                {images.map((img, idx) => (
                  <button
                    key={idx}
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
      </MiracleModal>
    </>
  )
}
