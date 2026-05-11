import readingTime from 'reading-time';

/**
 * Cleans MDX content by removing "noise" such as imports, exports, 
 * JSX/HTML tags, props, and code blocks to provide a more accurate word count.
 * @param {string} content - The raw MDX or Markdown string to be processed.
 * @returns {import('reading-time').ReadTimeResults} An object containing the calculation results.
 */
export function getMdxReadingTime(content: string) {
  if (!content) return { minutes: 0 };
  
  const cleanText = content
    .replace(/import.*from.*;/g, '')         // Remove import statements
    .replace(/export const[\s\S]*?};/g, '')  // FIX: Replaced /gs with [\s\S] to match newlines
    .replace(/<[^>]*>/g, '')                 // Remove JSX/HTML tags and their props
    .replace(/\{[\s\S]*?\}/g, '')            // FIX: Match curly braces across multiple lines
    .replace(/```[\s\S]*?```/g, '');         // Remove code blocks

  return readingTime(cleanText);
}

/**
 * Formats a duration in minutes into a human-readable string based on the provided locale.
 * Supports "1h 20m" format for English and "1j 20m" for Indonesian.
 * @param {number} minutes - The duration in minutes to be formatted.
 * @param {string} [locale='en'] - The locale string ('en' | 'id'). Defaults to 'en'.
 * @returns {string} The formatted time string (e.g., "15m", "1h", or "2h 30m").
 */
export function formatReadingTime(minutes: number, locale: string = 'en'): string {
  const mins = Math.ceil(minutes);
  
  const labels: Record<string, { hour: string; min: string }> = {
    en: { hour: 'h', min: 'm' },
    id: { hour: 'j', min: 'm' }
  };

  const currentLabel = labels[locale] || labels.en;

  if (mins < 60) {
    return `${mins}${currentLabel.min}`;
  }

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (remainingMins === 0) {
    return `${hours}${currentLabel.hour}`;
  }
  
  return `${hours}${currentLabel.hour} ${remainingMins}${currentLabel.min}`;
}