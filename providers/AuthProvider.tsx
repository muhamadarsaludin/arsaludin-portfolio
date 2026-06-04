"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/features/profile/types/profiles.types"
import { supabase } from "@/lib/supabase/client"
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
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    async function getInitialSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("[AuthProvider] Failed to get initial session:", error)
      } finally {
        setIsAuthLoading(false)
      }
    }

    getInitialSession()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null

      if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAuthLoading(false)
        return
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(currentUser)
        setIsAuthLoading(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const { data: tanstackProfile, isLoading: isProfileLoading } = useProfile({
    userId: user?.id ?? null,
  })

  const fallbackProfile: Profile | null = user
    ? {
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        avatar_url: user.user_metadata?.avatar_url || null,
        role: "user",
      }
    : null

  const finalProfile = tanstackProfile || fallbackProfile
  const globalLoading = isAuthLoading || (isProfileLoading && !!user && !tanstackProfile)

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
