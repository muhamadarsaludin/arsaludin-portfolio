/**
 * Converts a date string into a human-readable "time ago" format.
 * Provides short, localized labels for different time intervals.
 * @param date - The ISO date string or valid date format to compare.
 * @param locale - The language code ('id' or 'en') for the labels.
 * @returns A string representing the relative time (e.g., "5mnt", "2y", "baru saja").
 * @example
 * timeAgo("2023-10-01T12:00:00Z", "id") // returns "2thn"
 * timeAgo(new Date().toISOString(), "en") // returns "now"
 * @performance
 * Uses simple math divisors for high performance. For more complex
 * relative time needs, consider the native Intl.RelativeTimeFormat API.
 */
export const timeAgo = ({ date, locale }: { date: string; locale: string }) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

  const labels: Record<string, any> = {
    id: { y: "thn", mo: "bln", d: "hr", h: "jam", m: "mnt", now: "baru saja" },
    en: { y: "y", mo: "mo", d: "d", h: "h", m: "m", now: "now" },
  }

  const l = labels[locale] || labels.en

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + l.y
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + l.mo
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + l.d
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + l.h
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + l.m

  return l.now
}
