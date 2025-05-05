import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class values into a single className string using clsx and tailwind-merge.
 * This is useful for conditionally applying classes and merging tailwind classes efficiently.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
