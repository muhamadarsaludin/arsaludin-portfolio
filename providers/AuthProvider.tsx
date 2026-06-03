"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from "react"
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

  const profileRef = useRef<Profile | null>(null)
  useEffect(() => {
    profileRef.current = profile
  }, [profile])

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

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null

      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        return
      }

      if (event === "TOKEN_REFRESHED" && !currentUser) {
        return
      }

      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && currentUser) {
        setUser(currentUser)

        const currentLocalProfile = profileRef.current
        if (!currentLocalProfile || currentLocalProfile.id !== currentUser.id) {
          const profileData = await getProfile({ id: currentUser.id })
          if (profileData) {
            setProfile(profileData)
          }
        }
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const { data: tanstackProfile, isLoading: isProfileLoading } = useProfile({
    userId: user?.id ?? null,
    initialProfileData: profile,
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
