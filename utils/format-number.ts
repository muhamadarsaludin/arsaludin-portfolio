/**
 * Formats a number into a compact string representation (e.g., 1K, 1.5M).
 * Used primarily for engagement metrics like reactions and comments.
 *
 * @param value - The numerical value to be formatted.
 * @returns A string representing the compact version of the number.
 *
 * @example
 * formatCompactNumber(999) // "999"
 * formatCompactNumber(1500) // "1.5K"
 * formatCompactNumber(1000000) // "1M"
 */
export const formatCompactNumber = (value: number): string => {
  if (value < 1000) return value.toString()

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value)
}

/**
 * Handles nullish or zero counts specifically for UI display.
 *
 * @param count - The number of interactions (reactions, comments, etc.).
 * @returns Returns "0" if count is null, undefined, or <= 0, otherwise returns formatted string.
 */
export const formatCount = (count: number | undefined | null): string => {
  if (!count || count <= 0) return "0"
  return formatCompactNumber(count)
}
