'use client'

import React from 'react'
import { LuShare2 } from 'react-icons/lu'
// Jika lu punya toast library (seperti sonner atau hot-toast), bisa dipake di sini
// import { toast } from 'sonner' 

interface ProjectShareButtonProps {
  title: string
  description: string
}

export default function ProjectShareButton({ title, description }: ProjectShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: description,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="share project"
      className="cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 focus:outline-none dark:hover:bg-neutral-800"
    >
      <LuShare2 size={20} className="cursor-pointer transition-transform duration-500 ease-in-out" />
    </button>
  )
}