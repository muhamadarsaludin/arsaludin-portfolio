export const timeAgo = (date: string, locale: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  
  const labels: Record<string, any> = {
    id: { y: "thn", mo: "bln", d: "hr", h: "jam", m: "mnt", now: "baru saja" },
    en: { y: "y", mo: "mo", d: "d", h: "h", m: "m", now: "now" },
  }

  const l = labels[locale] || labels.en 
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + l.y
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + l.mo
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + l.d
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + l.h
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + l.m
  
  return l.now
}
