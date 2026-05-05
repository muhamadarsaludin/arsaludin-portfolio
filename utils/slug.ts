/**
 * Transforms a string into a URL-friendly slug.
 * It converts text to lowercase, removes special characters, 
 * and replaces spaces with dashes.
 * 
 * @param text - The raw string to be slugified.
 * @returns A cleaned, URL-safe string.
 * 
 * @example
 * slugify("Hello World!!!") // Output: "hello-world"
 * slugify("Fitur Baru: Login User") // Output: "fitur-baru-login-user"
 * slugify("  Extra   Spaces  ") // Output: "extra-spaces"
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Generates a unique slug by appending a short random alphanumeric ID.
 * Useful for preventing collisions in the database.
 * 
 * @param text - The base string (usually a title).
 * @param length - Length of the random suffix (default is 5).
 * @returns A unique slug string.
 * 
 * @example
 * generateUniqueSlug("My Card") // Output: "my-card-x8j2k"
 * generateUniqueSlug("Task", 3) // Output: "task-a1b"
 */
export const generateUniqueSlug = (text: string, length: number = 5): string => {
  const baseSlug = slugify(text)
  const randomId = Math.random().toString(36).substring(2, 2 + length)
  return `${baseSlug}-${randomId}`
};