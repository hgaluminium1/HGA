import { Container } from "@/components/atoms/container";
import { CountUp } from "@/components/atoms/count-up";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import type { HomeContent } from "@/features/public-home/content/home.en";

type CapabilitySectionProps = {
  content: HomeContent["capability"];
};

function highlightBody(body: string, words: string[]) {
  if (words.length === 0) return body;

  const escaped = words.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = body.split(pattern);
  const wordSet = new Set(words);

  return parts.map((part, i) =>
    wordSet.has(part) ? (
      <span
        key={`${part}-${i}`}
        className="border-b-2 border-gold font-bold text-white"
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
    <Section
      data-block="capability"
      id="about"
      className="clip-capability relative overflow-hidden bg-[linear-gradient(135deg,var(--violet-800),var(--ink))] py-[clamp(4rem,7vw,7rem)] text-white"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[45%] bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.035)_0_2px,transparent_2px_14px)]"
        aria-hidden
      />
      <Container className="relative z-[1] grid gap-8 min-[900px]:grid-cols-[1.1fr_1fr] min-[900px]:items-center">
        <Reveal>
          <Eyebrow light>{content.eyebrow}</Eyebrow>
          <h2 className="text-fs-h2 mt-2.5">{content.title}</h2>
          <p className="text-fs-lead text-on-dark-muted mt-4 max-w-[60ch]">
            {highlightBody(content.body, content.highlightWords)}
          </p>
        </Reveal>

        <Reveal stagger>
          <div className="mt-[clamp(2.5rem,5vw,3.5rem)] grid grid-cols-2 gap-5 min-[700px]:grid-cols-4 min-[900px]:mt-0">
            {content.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-md)] border border-white/15 bg-white/10 px-5 py-5 backdrop-blur-[6px]"
              >
                <div className="font-display flex items-baseline gap-0.5 text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-white">
                  <CountUp target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-on-dark-muted mt-1.5 text-[0.82rem]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
