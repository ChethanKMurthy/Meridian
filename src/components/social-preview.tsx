import { ExternalLink } from "lucide-react";
import type { PlatformPresence } from "@/lib/db/schema";
import { socialUrl, platformLabel, postThumbs, avatarUrl } from "@/lib/social";
import { formatCount } from "@/lib/format";

// Real brand marks via Simple Icons (served as SVG images, brand-colored).
const BRAND: Record<PlatformPresence["platform"], { slug: string; color: string; bg: string }> = {
  instagram: { slug: "instagram", color: "E4405F", bg: "linear-gradient(135deg,#fce4ec,#f3e5ff)" },
  youtube: { slug: "youtube", color: "FF0000", bg: "linear-gradient(135deg,#ffe9e9,#fff0f0)" },
  x: { slug: "x", color: "0F1419", bg: "linear-gradient(135deg,#eef1f5,#f6f8fb)" },
};

function BrandMark({ platform, size = 14 }: { platform: PlatformPresence["platform"]; size?: number }) {
  const b = BRAND[platform];
  return (
    <img
      src={`https://cdn.simpleicons.org/${b.slug}/${b.color}`}
      width={size}
      height={size}
      alt={platformLabel(platform)}
      style={{ width: size, height: size }}
    />
  );
}

/** Full profile preview card for one platform: header, stats, recent posts, link. */
export function SocialCard({ creatorId, p }: { creatorId: string; p: PlatformPresence }) {
  const url = socialUrl(p.platform, p.handle);
  const thumbs = postThumbs(`${creatorId}-${p.platform}`);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 p-4" style={{ background: BRAND[p.platform].bg }}>
        <img
          src={avatarUrl(`${creatorId}-${p.platform}`)}
          alt=""
          className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <BrandMark platform={p.platform} size={15} />
            <span className="truncate text-[13.5px] font-semibold">{p.handle}</span>
          </div>
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

      <div className="grid grid-cols-3 divide-x divide-edge border-y border-edge text-center">
        {[
          ["Followers", formatCount(p.followers)],
          ["Avg views", formatCount(p.avgViews)],
          ["Engagement", `${p.engagementRate}%`],
        ].map(([k, v]) => (
          <div key={k} className="px-2 py-2.5">
            <div className="font-mono text-[14px] font-semibold">{v}</div>
            <div className="text-[10.5px] text-faint">{k}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1 p-1">
        {thumbs.map((src, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden">
            <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </a>
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

/** Compact preview for the console: primary platform header + thumbnail strip + link. */
export function SocialPreviewMini({
  creatorId,
  name,
  platforms,
}: {
  creatorId: string;
  name: string;
  platforms: PlatformPresence[];
}) {
  const primary = [...platforms].sort((a, b) => b.followers - a.followers)[0];
  if (!primary) return null;
  const url = socialUrl(primary.platform, primary.handle);
  const thumbs = postThumbs(`${creatorId}-${primary.platform}`, 4);

  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-white">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <img src={avatarUrl(`${creatorId}-${primary.platform}`)} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-edge" />
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
      <div className="grid grid-cols-4 gap-0.5">
        {thumbs.map((src, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden">
            <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </a>
        ))}
      </div>
    </div>
  );
}
