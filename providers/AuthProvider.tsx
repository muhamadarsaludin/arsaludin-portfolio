"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  isSignedIn: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  // 👇 undefined = belum tau (IMPORTANT)
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    // 🔥 ambil session awal (INI YANG KURANG DI CODE KAMU)
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }

    getInitialSession()

    // 🔥 listen perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const isLoading = user === undefined

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isSignedIn: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}