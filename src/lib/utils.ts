import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format view count to a readable string
 *
 * Examples:
 * - 0 -> "0"
 * - 5 -> "5"
 * - 100 -> "100"
 * - 1500 -> "1.5k"
 * - 15000 -> "15k"
 * - 150000 -> "150k"
 * - 1500000 -> "1.5M"
 *
 * @param count - The view count to format
 * @returns Formatted string
 */
export function formatViewCount(count: number): string {
  if (count === 0) return '0'

  if (count < 1000) return count.toString()

  const suffixes = ['', 'k', 'M', 'B', 'T']
  const suffixNum = Math.floor(Math.floor(count).toString().length / 3)

  const shortValue = parseFloat(
    (suffixNum !== 0 ? count / Math.pow(1000, suffixNum) : count).toPrecision(3)
  )

  const shortNumber =
    shortValue % 1 !== 0 ? shortValue.toFixed(1) : shortValue.toString()

  return shortNumber + suffixes[suffixNum]
}
