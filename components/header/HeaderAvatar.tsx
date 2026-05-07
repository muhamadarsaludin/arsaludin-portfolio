"use client"

import MiracleTooltip from "../miracle/Tooltip"
import { deleteAccount, signOut } from "@/features/auth/services/auth"
import { LuLogOut, LuTriangleAlert, LuUserRound, LuUserRoundX } from "react-icons/lu"
import { useTranslations } from "next-intl"
import { useAuth } from "@/providers/AuthProvider"
import MiracleBadge from "../miracle/Badge"
import MiracleButton from "../miracle/Button"
import { useState } from "react"
import UserAvatar from "@/features/auth/components/UserAvatar"
import MiracleModal from "../miracle/Modal"
import { useQueryClient } from "@tanstack/react-query"

export default function HeaderAvatar() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  
  const { profile, isLoading } = useAuth()
  const t = useTranslations("components.header")

  if (isLoading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-300" />
  }

  if (!profile) return null

  const handleSignOut = async () => {
    await signOut()
  }

  const handleDeleteAccount = async () => {
    setIsPending(true)
    try {
      await deleteAccount(profile.id)
      queryClient.clear()
      window.location.replace("/")
    } catch (error) {
      console.error(error)
      setIsPending(false)
    }
  }

  return (
    <>
      <MiracleTooltip
        defaultPosition="bottom-end"
        hoverContent
        trigger={
          <UserAvatar user={profile}/>
        }
      >
        <div className="flex cursor-pointer flex-col gap-1">
          <div className="border-primary border-b text-sm font-medium mb-2">
            <MiracleBadge className="mb-0.5" startIcon={<LuUserRound />} color="blue" size="sm">
              <span className="capitalize">{profile.role}</span>
            </MiracleBadge>
            <h3 className="text-primary-inv font-semibold text-base">{profile.full_name}</h3>
            <p className="text-secondary-inv mt-0.5 text-xs">{profile.email}</p>
          </div>
          <MiracleButton onClick={handleSignOut} startIcon={<LuLogOut />} aria-label={t("cta.signOut")} variant="secondary" size="sm">
            {t("cta.signOut")}
          </MiracleButton>
          <MiracleButton onClick={()=> setIsOpen(true)} startIcon={<LuUserRoundX />} aria-label={t("cta.deleteAccount")} status="danger" size="sm">
            {t("cta.deleteAccount")}
          </MiracleButton>
        </div>
      </MiracleTooltip>
      
      <MiracleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("deleteAccount.title")}
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center text-center gap-2 py-2">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600">
              <LuTriangleAlert size={32}/>
            </div>
            <h4 className="font-bold text-lg">{t("deleteAccount.confirmTitle")}</h4>
            <p className="text-sm text-secondary-inv">
              {t("deleteAccount.confirmDescription")}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <MiracleButton
              onClick={handleDeleteAccount}
              status="danger"
              loading={isPending}
              disabled={isPending}
              className="w-full"
            >
              {t("deleteAccount.confirmAction")}
            </MiracleButton>
            <MiracleButton
              onClick={() => setIsOpen(false)}
              variant="secondary"
              disabled={isPending}
              className="w-full"
            >
              {t("deleteAccount.cancelAction")}
            </MiracleButton>
          </div>
        </div>
      </MiracleModal>
    </>
  )
}
