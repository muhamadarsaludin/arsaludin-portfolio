"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/features/profile/types/profiles.types"

import { createClient } from "@/lib/supabase/client"
import { useProfile } from "@/features/profile/hooks/useProfile"
import React from "react"

type AuthContextType = {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isSignedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  const { data: profile, isLoading: isProfileLoading } = useProfile({
    userId: user?.id ?? null,
  })

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: profile ?? null,
        isLoading: isProfileLoading,
        isSignedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
