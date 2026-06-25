import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getOwnerContact(owner: {
  phone?: string;
  email?: string | null;
  contact?: string;
}): string {
  if (owner.contact && owner.contact !== "—") return owner.contact;
  if (owner.phone && !owner.phone.startsWith("google_")) return owner.phone;
  if (owner.email) return owner.email;
  return "—";
}

export function isGoogleOwner(owner: {
  authProvider?: string | null;
  email?: string | null;
  phone?: string;
}): boolean {
  return (
    owner.authProvider === "google" ||
    Boolean(owner.email && !owner.phone?.trim())
  );
}
