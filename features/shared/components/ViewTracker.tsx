"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

type ViewTrackerProps = {
  id: string
  rpcName: string
  rpcParamKey: "project_id" | "article_id"
}

export default function ViewTracker({ id, rpcName, rpcParamKey }: ViewTrackerProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    
    const trigger = async () => {
      const { error } = await supabase.rpc(rpcName, {
        [rpcParamKey]: id
      })

      if (error) {
        console.error(`[ViewTracker] Error calling RPC "${rpcName}":`, error.message)
      }
    }

    trigger()
  }, [id, rpcName, rpcParamKey])
  return null
}