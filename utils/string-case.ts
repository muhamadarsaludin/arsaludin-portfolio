/**
 * Converts a string to snake_case.
 * Primarily used for database column names or backend keys.
 * @param str - The string to transform (e.g., "User Profile Name").
 * @returns A lowercased string separated by underscores (e.g., "user_profile_name").
 * @example
 * toSnakeCase("Full Name") // returns "full_name"
 */
export function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "")
}

/**
 * Converts a string to kebab-case.
 * Useful for URL slugs, CSS class names, or component file names.
 * @param str - The string to transform (e.g., "UserProfile").
 * @returns A lowercased string separated by hyphens (e.g., "user-profile").
 * @example
 * toKebabCase("UserProfile") // returns "user-profile"
 * toKebabCase("hello world") // returns "hello-world"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^\w\-]/g, "")
}
