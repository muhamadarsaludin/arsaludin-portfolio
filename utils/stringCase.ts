export function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
}