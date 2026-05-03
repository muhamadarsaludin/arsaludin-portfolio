import { formatDate } from "./format-date";

/**
 * Formats a date into a concise relative time string.
 * - Under 1 minute: {seconds}dtk / {seconds}s
 * - Under 1 hour: {minutes}mnt / {minutes}m
 * - Under 24 hours: {hours}jam / {hours}h
 * - Up to 7 days: {days}h / {days}d
 * - Beyond 7 days: Returns localized short date via formatDate()
 *
 * @param {Object} params - The parameters for time conversion.
 * @param {string} params.date - The ISO date string to be converted.
 * @param {string} params.locale - The language code ('id' or 'en').
 * @returns {string} The formatted relative time or absolute short date.
 */
export const timeAgo = ({ date, locale }: { date: string; locale: string }): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

  const labels: Record<string, { s: string; m: string; h: string; d: string }> = {
    id: { s: "dtk", m: "mnt", h: "jam", d: "h" },
    en: { s: "s", m: "m", h: "h", d: "d" },
  }

  const l = labels[locale] || labels.en

  // Seconds (< 1 min)
  if (seconds < 60) return `${seconds}${l.s}`

  // Minutes (< 1 hour)
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}${l.m}`

  // Hours (< 24 hours)
  const hours = Math.floor(seconds / 3600)
  if (hours < 24) return `${hours}${l.h}`

  // Days (1 to 7 days)
  const days = Math.floor(seconds / 86400)
  if (days <= 7) return `${days}${l.d}`

  return formatDate({ 
    date, 
    locale, 
    dateStyle: "medium" 
  })
}
