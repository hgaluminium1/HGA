import { Container } from "@/components/atoms/container";
import { CountUp } from "@/components/atoms/count-up";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import type { HomeContent } from "@/features/public-home/content/home.en";

type CapabilitySectionProps = {
  content: HomeContent["capability"];
};

function highlightBody(body: string, words: string[]) {
  if (words.length === 0) return body;
  const escaped = words.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = body.split(pattern);
  const wordSet = new Set(words.map((w) => w.toLowerCase()));
  return parts.map((part, i) =>
    wordSet.has(part.toLowerCase()) ? (
      <span
        key={`${part}-${i}`}
        className="border-b-2 border-brand-red font-bold text-white"
      >
        {part}
      </span>
    ) : (
      <span key={`${part}-${i}`}>{part}</span>
    ),
  );
}

export function CapabilitySection({ content }: CapabilitySectionProps) {
  return (
    <section
      data-block="capability"
      id="about"
      className="relative overflow-hidden bg-[linear-gradient(145deg,var(--brand-blue-darker)_0%,var(--ink)_48%,var(--brand-blue-dark)_100%)] py-[clamp(3rem,6vw,6.5rem)] text-white"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.04)_0_2px,transparent_2px_14px)] min-[900px]:block"
        aria-hidden
      />
      <Container className="relative z-[1] grid gap-10 min-[900px]:grid-cols-[1.15fr_1fr] min-[900px]:items-center min-[900px]:gap-12">
        <Reveal>
          <Eyebrow light>{content.eyebrow}</Eyebrow>
          <h2 className="font-display mt-3 text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] font-semibold leading-[1.12] text-balance">
            {content.title}
          </h2>
          <p className="text-on-dark-muted mt-4 max-w-[58ch] text-[clamp(0.95rem,0.9rem+0.25vw,1.125rem)] leading-relaxed">
            {highlightBody(content.body, content.highlightWords)}
          </p>
        </Reveal>

        <Reveal stagger>
          <div className="grid grid-cols-2 gap-3 min-[520px]:gap-4 min-[900px]:grid-cols-2">
            {content.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-md)] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-[6px] min-[520px]:px-5 min-[520px]:py-5"
              >
                <div className="font-display flex items-baseline gap-0.5 text-[clamp(1.45rem,1.1rem+1.8vw,2.25rem)] font-bold text-white">
                  <CountUp target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-on-dark-muted mt-1.5 text-[clamp(0.75rem,0.7rem+0.2vw,0.85rem)] leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
