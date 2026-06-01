/**
 * Normalizes query parameters into a sanitized string array.
 * Handles single strings, arrays, or comma-separated values.
 * 
 * @param param - Raw input from URL search params.
 * @returns Array of trimmed, non-empty strings, or undefined.
 */
export const normalizeArrayParam = (
  param: string | string[] | undefined
): string[] | undefined => {
  if (!param) return undefined

  const arr = Array.isArray(param) ? param : param.split(",")
  const filtered = arr
    .map((item) => item.trim())
    .filter(Boolean)

  return filtered.length > 0 ? filtered : undefined
}