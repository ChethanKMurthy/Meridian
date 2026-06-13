import { ExternalLink } from "lucide-react";
import type { PlatformPresence } from "@/lib/db/schema";
import { socialUrl, platformLabel, avatarUrl } from "@/lib/social";
import { formatCount } from "@/lib/format";

const BRAND: Record<PlatformPresence["platform"], { slug: string; color: string; bg: string }> = {
  instagram: { slug: "instagram", color: "E4405F", bg: "linear-gradient(135deg,#fce4ec,#f3e5ff)" },
  youtube: { slug: "youtube", color: "FF0000", bg: "linear-gradient(135deg,#ffe9e9,#fff0f0)" },
  x: { slug: "x", color: "0F1419", bg: "linear-gradient(135deg,#eef1f5,#f6f8fb)" },
};

function BrandMark({ platform, size = 14 }: { platform: PlatformPresence["platform"]; size?: number }) {
  const b = BRAND[platform];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${b.slug}/${b.color}`}
      width={size}
      height={size}
      alt={platformLabel(platform)}
      style={{ width: size, height: size }}
    />
  );
}

function Avatar({ p, size }: { p: PlatformPresence; size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl(p.platform, p.handle)}
      alt={p.handle}
      width={size}
      height={size}
      className="rounded-full object-cover ring-2 ring-white"
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}

/** Full profile preview card for one real platform: avatar, handle, stats, open link. */
export function SocialCard({ p }: { p: PlatformPresence }) {
  const url = socialUrl(p.platform, p.handle);
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 p-4" style={{ background: BRAND[p.platform].bg }}>
        <Avatar p={p} size={44} />
        <div className="min-w-0 flex-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline"
          >
            <BrandMark platform={p.platform} size={15} />
            <span className="truncate text-[13.5px] font-semibold">{p.handle}</span>
          </a>
          <div className="text-[11.5px] text-muted">{platformLabel(p.platform)}</div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium shadow-[var(--shadow-sm)] transition-colors hover:text-accent"
        >
          Open <ExternalLink size={12} />
        </a>
      </div>

      <div className="grid grid-cols-3 divide-x divide-edge border-t border-edge text-center">
        {[
          ["Followers", formatCount(p.followers)],
          ["Avg views", formatCount(p.avgViews)],
          ["Engagement", `${p.engagementRate}%`],
        ].map(([k, v]) => (
          <div key={k} className="px-2 py-3">
            <div className="font-mono text-[15px] font-semibold">{v}</div>
            <div className="text-[10.5px] text-faint">{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact brand link chips for inline use (e.g. a table cell). */
export function SocialLinks({ platforms }: { platforms: PlatformPresence[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {platforms.map((p) => (
        <a
          key={p.platform}
          href={socialUrl(p.platform, p.handle)}
          target="_blank"
          rel="noopener noreferrer"
          title={`${platformLabel(p.platform)} · ${p.handle}`}
          className="grid h-7 w-7 place-items-center rounded-lg border border-edge bg-white transition-colors hover:border-edge-strong"
        >
          <BrandMark platform={p.platform} size={13} />
        </a>
      ))}
    </div>
  );
}

/** Compact real-profile preview for the console: avatar, handle link, followers, open. */
export function SocialPreviewMini({
  name,
  platforms,
}: {
  name: string;
  platforms: PlatformPresence[];
}) {
  const primary = [...platforms].sort((a, b) => b.followers - a.followers)[0];
  if (!primary) return null;
  const url = socialUrl(primary.platform, primary.handle);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-edge bg-white px-3 py-2.5">
      <Avatar p={primary} size={38} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-semibold">{name}</div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-muted hover:text-foreground"
        >
          <BrandMark platform={primary.platform} size={12} /> {primary.handle}
        </a>
      </div>
      <span className="font-mono text-[11.5px] text-faint">{formatCount(primary.followers)}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-7 w-7 place-items-center rounded-lg border border-edge text-muted transition-colors hover:text-accent"
        aria-label={`Open ${name} on ${platformLabel(primary.platform)}`}
      >
        <ExternalLink size={13} />
      </a>
    </div>
  );
}
