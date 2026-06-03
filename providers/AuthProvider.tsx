"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/features/profile/types/profiles.types"
import { supabase } from "@/lib/supabase/client"
import { getProfile } from "@/features/profile/services/profiles"
import { useProfile } from "@/features/profile/hooks/useProfile"

type AuthContextType = {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isSignedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    async function initializeAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          const profileData = await getProfile({ id: currentUser.id })
          if (profileData) {
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error("[AuthProvider Init Error]:", error)
      } finally {
        setIsAuthLoading(false)
      }
    }

    initializeAuth()

    // 🔐 LISTENER SUPABASE DENGAN PROTEKSI CO-PILOT ANTI-GLITCH PINDAH TAB
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null

      // 1. Jika user bener-bener pencet tombol Sign Out secara sah
      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        return
      }

      // 2. Jika ada event SIGNED_IN atau token otomatis di-refresh di background saat balik tab
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && currentUser) {
        setUser(currentUser)

        // Proteksi penting: Jangan nembak API lagi kalau datanya udah ada di state lokal
        if (!profile || profile.id !== currentUser.id) {
          const profileData = await getProfile({ id: currentUser.id })
          if (profileData) {
            setProfile(profileData)
          }
        }
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [profile]) // Tambahkan profile ke dependency array agar pengecekan !profile selalu akurat

  // 🚀 TanStack Query dipanggil lagi sebagai pengelola data utama
  const { data: tanstackProfile, isLoading: isProfileLoading } = useProfile({
    userId: user?.id ?? null,
    initialProfileData: profile, // Ambil pancingan awal biar 0ms render
  })

  const fallbackProfile = user
    ? {
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        avatar_url: user.user_metadata?.avatar_url || null,
        role: user.app_metadata?.role || user.user_metadata?.role || "user",
      }
    : null

  // Double guard fallback data agar jika salah satu sedang transisi, UI tidak blank kosong
  const finalProfile = tanstackProfile || profile || fallbackProfile
  const globalLoading = isAuthLoading || (isProfileLoading && !tanstackProfile)

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: finalProfile as Profile | null,
        isLoading: globalLoading,
        isSignedIn: !globalLoading && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
