import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

/**
 * Standard industry helper to safely merge Tailwind CSS classes 
 * without style specification collisions.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}