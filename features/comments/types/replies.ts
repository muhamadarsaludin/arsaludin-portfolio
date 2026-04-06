import { Cursor } from "@/features/shared/types"

export type GetRepliesParams = {
  parentId: string
  cursor?: Cursor
  pageSize?: number
}