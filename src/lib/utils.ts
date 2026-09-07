import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCalories(n: number): string {
  return Math.round(n).toLocaleString();
}

export function formatMacro(n: number): string {
  return Math.round(n).toString();
}
