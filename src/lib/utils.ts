import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateMicrochipId(id: string): boolean {
  const cleaned = id.replace(/\s/g, "");
  return /^\d{9,15}$/.test(cleaned);
}

export function formatMicrochipId(id: string): string {
  return id.replace(/\s/g, "").trim();
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
