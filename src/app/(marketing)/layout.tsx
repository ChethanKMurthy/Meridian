import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      <SiteNav />
      <main className="w-full max-w-full overflow-x-hidden">{children}</main>
      <SiteFooter />
    </div>
  );
}
