/**
 * Extracts initials from a user's full name for profile placeholders.
 * Smartly handles single-word, multi-word, and long names.
 * @param name - The full name of the user (e.g., "Muhamad Arsaludin").
 * @returns A string containing 1 to 2 uppercase initials.
 * @example
 * getInitials("Muhamad") // returns "M"
 * getInitials("Muhamad Arsaludin") // returns "MA"
 * getInitials("Muhamad Arsaludin Nawawi") // returns "MN" (First and Last)
 * getInitials("A B C D E") // returns "AB" (First and Second for long names)
 * * @logic
 * - 1 Word: First letter of that word.
 * - 2-3 Words: First letter of first word + First letter of last word.
 * - 4+ Words: First letter of first word + First letter of second word.
 */
export const getInitials = (name: string) => {
  if (!name) return ""
  const words = name.trim().split(/\s+/)
  let initials = ""

  if (words.length === 1) {
    initials = words[0]?.[0] ?? ""
  } else if (words.length <= 3) {
    initials = (words[0]?.[0] ?? "") + (words[words.length - 1]?.[0] ?? "")
  } else {
    initials = (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")
  }
  return initials.toUpperCase()
}
