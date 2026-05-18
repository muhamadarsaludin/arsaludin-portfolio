"use client"

import React, { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardStatus, CardType, CardPriority, CardEntity } from '@/features/cards/types/cards.types'
import MiracleModal from '@/components/miracle/Modal'
import MiracleButton from '@/components/miracle/Button'
import MiracleTextField from '@/components/miracle/TextField'
import MiracleTextArea from '@/components/miracle/TextArea'
import MiracleRadio from '@/components/miracle/Radio' 
import { useTranslations } from 'next-intl'
import { useCardsMutation } from '@/features/cards/hooks/useCardMutation'
import { useAuth } from '@/providers/AuthProvider'
import clsx from 'clsx'
import { CARD_PRIORITIES, CARD_STATUS, CARD_TYPES } from '../constants/card.constants'
import MiracleBadge from '@/components/miracle/Badge'
import { LuTriangleAlert } from 'react-icons/lu'
import MiracleBanner from '@/components/miracle/Banner'

type CardFormModalProps = {
  isOpen: boolean
  onClose: () => void
  initialData?: Card | null
  defaultStatus: CardStatus
}

export default function CardFormModal({ 
  isOpen, 
  onClose, 
  initialData, 
  defaultStatus 
}: CardFormModalProps) {
  const t = useTranslations("components.card.form")
  const td = useTranslations("data.roadmap")
  const { profile } = useAuth()
  const isAdmin = profile?.role === "admin"
  
  const { createCard, updateCard, isPending } = useCardsMutation()

  // 1. Define Schema
  const cardSchema = useMemo(() => z.object({
    title: z.string()
      .trim()
      .min(1, t("validation.title.required"))
      .min(5, t("validation.title.min"))
      .max(100, t("validation.title.max")),
    description: z.string()
      .trim()
      .optional()
      .or(z.literal("")),
    type: z.enum(CARD_TYPES),
    priority: z.enum(CARD_PRIORITIES),
    status: z.enum(CARD_STATUS)
  }), [t])

  type CardFormValues = z.infer<typeof cardSchema>

  // 2. Setup React Hook Form
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "feature",
      priority: "medium",
      status: defaultStatus
    }
  })

  // 3. Reset logic (Edit vs Create)
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          description: initialData.description ?? "",
          type: initialData.type,
          priority: initialData.priority,
          status: initialData.status
        })
      } else {
        reset({
          title: "",
          description: "",
          type: "feature",
          priority: "medium",
          status: defaultStatus
        })
      }
    }
  }, [initialData, isOpen, reset, defaultStatus])

  // 4. Submit handler
  const onSubmit = (values: CardFormValues) => {
    const payload = values as Pick<CardEntity, 'title' | 'description' | 'status' | 'type' | 'priority'>
    if (initialData) {
      updateCard(
        { cardId: initialData.id, payload }, 
        { onSuccess: () => onClose() }
      )
    } else {
      createCard(payload, { onSuccess: () => onClose() })
    }
  }

  return (
    <MiracleModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t("title.edit") : t("title.create")}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <MiracleTextField
              {...field}
              label={t("label.title") || "Title"}
              placeholder={t("placeholder.title")}
              error={errors.title?.message}
              fullWidth
              required
              onClear={() => field.onChange('')}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <MiracleTextArea
              {...field}
              label={t("label.description") || "Description"}
              placeholder={t("placeholder.description")}
              error={errors.description?.message}
              rows={5}
              fullWidth
              onClear={() => field.onChange('')}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-8">
          {/* Type Selection */}
          <div className="flex flex-col gap-3">
            {/* Style label disamakan dengan TextField */}
            <p className={clsx("text-sm font-medium select-none text-primary")}>
              {t("label.type") || "Type"}
              <span className="text-red ml-1">*</span>
            </p>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  {CARD_TYPES.map((val) => (
                    <MiracleRadio
                      key={val}
                      value={val}
                      checked={field.value === val}
                      onChange={() => field.onChange(val)}
                    >
                      {td(`types.${val}`)}
                    </MiracleRadio>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Priority Selection */}
          <div className="flex flex-col gap-3">
            <p className={clsx("text-sm font-medium select-none text-primary")}>
              {t("label.priority") || "Priority"}
              <span className="text-red ml-1">*</span>
            </p>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  {CARD_PRIORITIES.map((val) => (
                    <MiracleRadio
                      key={val}
                      value={val}
                      checked={field.value === val}
                      onChange={() => field.onChange(val)}
                    >
                      {td(`priorities.${val}`)}
                    </MiracleRadio>
                  ))}
                </div>
              )}
            />
          </div>
        </div>

        {/* Status Selection - Proteksi Admin */}
        <div className={clsx("flex flex-col gap-3 pt-6 border-t border-primary")}>
          {!isAdmin && (
            <MiracleBanner color="yellow" variant="secondary" startIcon={<LuTriangleAlert />}>
              {t("alert")}
            </MiracleBanner>
          )}
          <p className={clsx(
            "text-sm font-medium select-none",
            !isAdmin ? "text-secondary" : "text-primary"
          )}>
            Status
            <span className="text-red ml-1">*</span>
          </p>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className={clsx("flex flex-wrap gap-x-6 gap-y-3", !isAdmin && "opacity-60")}>
                {CARD_STATUS.map((val) => (
                  <MiracleRadio
                    key={val}
                    value={val}
                    checked={field.value === val}
                    disabled={!isAdmin}
                    onChange={() => isAdmin && field.onChange(val)}
                  >
                    {td(`status.${val}`)}
                  </MiracleRadio>
                ))}
              </div>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <MiracleButton variant="secondary" onClick={onClose} type="button" disabled={isPending}>
            {t("button.cancel")}
          </MiracleButton>
          <MiracleButton type="submit" loading={isPending} disabled={isPending}>
            {initialData ? t("button.update") : t("button.create")}
          </MiracleButton>
        </div>
      </form>
    </MiracleModal>
  )
}