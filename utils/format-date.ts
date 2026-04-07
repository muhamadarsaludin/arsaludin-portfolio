type FormatDateParams = {
  date: Date | number | string
  locale: string
  dateStyle?: "full" | "long" | "medium" | "short"
}

/**
 * Formats a Date object, timestamp, or ISO string into a localized date string.
 * Leverages the browser's native `Intl.DateTimeFormat` for a zero-bundle-size solution.
 *
 * @param options - The configuration object for formatting.
 * @param options.date - The date to format (accepts Date object, timestamp number, or ISO string).
 * @param options.locale - The BCP 47 language tag (e.g., 'en-US', 'id-ID').
 * @param options.dateStyle - The date formatting style to use:
 * - 'full': Wednesday, April 8, 2026
 * - 'long': April 8, 2026
 * - 'medium': Apr 8, 2026
 * - 'short': 4/8/26
 * @returns A localized and formatted date string.
 *
 * @example
 * formatDate({ date: new Date(), locale: 'en-US' }) 
 * // Output: "April 8, 2026"
 */
export const formatDate = ({
  date,
  locale,
  dateStyle = "long"
}: FormatDateParams): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, { dateStyle }).format(dateObj);
};