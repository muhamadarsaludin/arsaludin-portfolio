"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/features/profile/types/profiles.types"
import { getProfile } from "@/features/profile/services/profiles"

type AuthContextType = {
  user: User | null
  profile: Profile | null
  isSignedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User | null
}) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(initialUser)
  const [profile, setProfile] = useState<Profile | null>(
    initialUser
      ? ({
          id: initialUser.id,
          full_name: initialUser.user_metadata?.full_name || "",
          email: initialUser.email || "",
          avatar_url: initialUser.user_metadata?.avatar_url || "",
          role: "user",
        } as Profile)
      : null
  )

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      try {
        const data = await getProfile({ id: userId })
        if (data) setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    if (initialUser) {
      fetchProfile(initialUser.id)
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isSignedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
