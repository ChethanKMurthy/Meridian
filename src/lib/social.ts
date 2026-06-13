import type { PlatformPresence } from "./db/schema";

// Build a public profile URL from a stored handle (handles are stored with a
// leading "@", e.g. "@beerbiceps").
export function socialUrl(platform: PlatformPresence["platform"], handle: string): string {
  const clean = handle.replace(/^@/, "").trim();
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "youtube":
      return `https://youtube.com/@${clean}`;
    case "x":
      return `https://x.com/${clean}`;
  }
}

export function platformLabel(platform: PlatformPresence["platform"]): string {
  return platform === "x" ? "X" : platform === "youtube" ? "YouTube" : "Instagram";
}

// Real profile avatar via unavatar.io, which resolves a creator's actual social
// avatar from their handle (and falls back to a generated avatar if missing).
export function avatarUrl(platform: PlatformPresence["platform"], handle: string): string {
  const clean = handle.replace(/^@/, "").trim();
  const provider = platform === "youtube" ? "youtube" : platform === "x" ? "twitter" : "instagram";
  return `https://unavatar.io/${provider}/${encodeURIComponent(clean)}?fallback=https://cdn.simpleicons.org/${provider === "twitter" ? "x" : provider}`;
}
