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
