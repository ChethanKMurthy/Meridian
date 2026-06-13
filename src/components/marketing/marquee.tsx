const WORDS = ["VitalFuel", "GlowTheory", "PulseAudio", "PaisaPlan", "Striderz", "ZenBrew"];

export function Marquee() {
  const items = [...WORDS, ...WORDS];
  return (
    <section className="border-y border-edge bg-white py-10">
      <p className="mb-7 text-center text-[12.5px] font-medium text-faint">
        Modelling growth for category-defining brands
      </p>
      <div className="marquee-mask relative w-full overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-16 pr-16">
          {items.map((w, i) => (
            <span
              key={i}
              className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-muted/55 md:text-3xl"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
