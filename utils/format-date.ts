type FormatDateParams = {
  date: Date | number | string
  locale: string
  dateStyle?: "full" | "long" | "medium" | "short"
  options?: Intl.DateTimeFormatOptions
}

/**
 * Formats a date into a localized string using the native Intl.DateTimeFormat API.
 * This zero-bundle-size solution supports predefined styles or custom granular options.
 *
 * @param {FormatDateParams} params - The formatting configuration object.
 * @returns {string} A localized and formatted date string.
 *
 * @example
 * // Standard usage: "April 9, 2026"
 * formatDate({ date: '2026-04-09', locale: 'en-US', dateStyle: 'long' });
 *
 * @example
 * // Custom Month-Year usage: "Apr 2026"
 * formatDate({
 * date: '2026-04-09',
 * locale: 'en-US' | 'en',
 * options: { month: 'short', year: 'numeric' }
 * });
 */
export const formatDate = ({ 
  date, 
  locale, 
  dateStyle = "long", 
  options 
}: FormatDateParams): string => {
  let dateObj: Date

  if (date instanceof Date) {
    dateObj = date
  } else {
    let dateString = String(date)
    if (typeof date === "string" && date.includes("-")) {
      const parts = date.split("-")
      if (parts.length === 3 && parts[0].length !== 4) {
        dateString = `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    }
    dateObj = new Date(dateString)
  }

  if (isNaN(dateObj.getTime())) {
    console.warn(`Invalid date provided to formatDate: ${date}`)
    return "N/A"
  }

  const finalOptions: Intl.DateTimeFormatOptions = options || { dateStyle }
  
  return new Intl.DateTimeFormat(locale, finalOptions).format(dateObj)
}
