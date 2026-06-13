import type { PlatformPresence } from "./db/schema";

// Build a public profile URL from a stored handle. Handles are seeded like
// "@arjun_fit" (instagram) or "ArjunMehta" (youtube channel name).
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

// Deterministic placeholder thumbnails for a creator's recent posts. Seeded by
// creator id + index so they stay stable across renders.
export function postThumbs(seed: string, count = 3): string[] {
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seed}-post-${i}/300/300`);
}

export function avatarUrl(seed: string): string {
  return `https://picsum.photos/seed/${seed}-avatar/200/200`;
}
