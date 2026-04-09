"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useProfile } from "@/features/profile/hooks/useProfile"

type AuthContextType = {
  user: User | null
  profile: any
  isLoading: boolean
  isSignedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Global Authentication Provider.
 * Synchronizes Supabase Auth sessions with detailed Profile data from the database.
 * @param children - The React component tree that requires access to Auth state.
 * @param initialUser - The User object fetched from the Server Component (Layout) to prevent hydration flickers.
 */
export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User | null
}) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(initialUser)

  const { data: profile, isLoading: isProfileLoading } = useProfile({ userId: user?.id ?? null })

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
