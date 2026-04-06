/**
 * Creates a localized date formatter with a customizable display style.
 * Leverages the browser's native Intl.DateTimeFormat for zero-bundle-size localization.
 * @param options - Formatting configuration.
 * @param options.locale - The BCP 47 language tag (e.g., 'id-ID' or 'en-US').
 * @param options.dateStyle - The formatting style to use ('full', 'long', 'medium', 'short').
 * @default 'long'
 * @returns A pre-configured Intl.DateTimeFormat instance.
 * @example
 * // Default (long): "6 April 2026"
 * dateFormatter({ locale: 'id-ID' }).format(new Date()) 
 * * // Short style: "06/04/26"
 * dateFormatter({ locale: 'id-ID', dateStyle: 'short' }).format(new Date()) 
 */
const dateFormatter = ({
  locale, 
  dateStyle = "long"
}: {
  locale: string
  dateStyle?: "full" | "long" | "medium" | "short"
}) => new Intl.DateTimeFormat(locale, { dateStyle })

export { dateFormatter }