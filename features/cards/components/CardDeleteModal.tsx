"use client"

import React from "react"
import type { Card } from "@/features/cards/types/cards.types"
import { useTranslations } from "next-intl"
import { LuTrash2 } from "react-icons/lu"
import MiracleButton from "@/components/miracle/Button"
import MiracleModal from "@/components/miracle/Modal"

type CardDeleteModalProps = {
  isOpen: boolean
  onClose: () => void
  card: Card
  isDeleting: boolean
  isSignedIn: boolean
  onDelete: () => void
}

export default function CardDeleteModal({
  isOpen,
  onClose,
  card,
  isDeleting,
  isSignedIn,
  onDelete
}: CardDeleteModalProps) {
  const t = useTranslations("components.card.item")

  return (
    <MiracleModal isOpen={isOpen} onClose={onClose} status="error" title={t("modal.delete.title")} size="sm">
      <div className="flex flex-col gap-6 py-2">
        <p className="text-sm text-secondary leading-relaxed">
          {t("modal.delete.description")}
        </p>
        
        {/* Card Data Shadow Preview */}
        <div className="p-4 bg-red-500/5 border border-dashed border-red-500/30 rounded-xl">
          <h4 className="text-primary font-semibold mb-1 line-clamp-1">{card.title}</h4>
          <div className="text-xs text-secondary line-clamp-2">{card.description}</div>
        </div>
        
        {/* Actions Button */}
        <div className="flex justify-end gap-3">
          <MiracleButton variant="secondary" onClick={onClose} disabled={isDeleting}>
            {t("modal.delete.cancel")}
          </MiracleButton>
          <MiracleButton 
            status="danger" 
            loading={isDeleting} 
            disabled={isDeleting || !isSignedIn} 
            onClick={onDelete} 
            startIcon={<LuTrash2 />}
          >
            {t("modal.delete.confirm")}
          </MiracleButton>
        </div>
      </div>
    </MiracleModal>
  )
}