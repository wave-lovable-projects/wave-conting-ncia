import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Check if a value matches a comma-separated multi-value filter */
export function matchesFilter(value: string | undefined | null, filter: string | undefined): boolean {
  if (!filter) return true;
  if (!value) return false;
  return filter.split(',').includes(value);
}
