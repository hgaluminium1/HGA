type HeroSlide = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

type HomeStat = {
  target: number;
  suffix: string;
  label: string;
};

type HomeProduct = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  wide?: boolean;
};

type HomeTestimonial = {
  initials: string;
  name: string;
  role: string;
  quote: string;
};

type HomeFaq = {
  question: string;
  answer: string;
};

export type HomeContent = {
  hero: {
    slides: HeroSlide[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string };
    videoSrc: string;
    videoPoster: string;
  };
  capability: {
    eyebrow: string;
    title: string;
    body: string;
    highlightWords: string[];
    stats: HomeStat[];
  };
  products: {
    eyebrow: string;
    title: string;
    description: string;
    items: HomeProduct[];
  };
  mission: {
    imageSrc: string;
    imageAlt: string;
    statement: string;
  };
  ctaBanner: {
    title: string;
    ctaLabel: string;
    ctaHref: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: HomeTestimonial[];
  };
  customers: {
    eyebrow: string;
    title: string;
    description: string;
    logos: string[];
  };
  jointVentures: {
    eyebrow: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    items: { title: string; subtitle: string; icon: "handshake" | "factory" | "leaf" }[];
  };
  careers: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    images: { src: string; alt: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: HomeFaq[];
  };
};

export const homeContentEn: HomeContent = {
  hero: {
    slides: [
      {
        imageSrc: "https://picsum.photos/seed/hg-plant-wide/1600/900",
        imageAlt: "Aerial view of an aluminium smelting plant floor",
        eyebrow: "Est. 1998 · Faridabad, Haryana",
        title: "India's Largest Aluminium & Zinc Recycling Enterprise",
        subtitle:
          "From scrap to spec-grade alloy — let us provide the support your production line deserves.",
      },
      {
        imageSrc: "https://picsum.photos/seed/hg-molten-pour/1600/901",
        imageAlt: "Molten aluminium being poured in the foundry",
        eyebrow: "620,000+ MT capacity",
        title: "Molten metal, on-spec, on schedule",
        subtitle:
          "Liquid alloy supply that keeps casting lines hot — fewer remelts, tighter control.",
      },
      {
        imageSrc: "https://picsum.photos/seed/hg-ingot-line/1600/902",
        imageAlt: "Rows of finished aluminium ingots ready for dispatch",
        eyebrow: "Traceable every batch",
        title: "Certified output your auditors trust",
        subtitle:
          "Ingots and billets with documentation that travels with every consignment.",
      },
    ],
    primaryCta: { label: "Inquire Now", href: "contact" },
    secondaryCta: { label: "Watch Our Story" },
    videoSrc:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoPoster: "https://picsum.photos/seed/hg-video-poster/960/540",
  },
  capability: {
    eyebrow: "HG Aluminium Smelters Ltd.",
    title: "The Heat Is On",
    body: "HG Group is India's largest producer of recycled Aluminium and Zinc die-casting alloys, with a combined annual capacity of over 620,000 MT. Since inception, the company has sustained fast-paced growth by pairing modern smelting technology with continuous process improvement.",
    highlightWords: ["Aluminium", "Zinc"],
    stats: [
      { target: 620, suffix: "K+", label: "MT Annual Capacity" },
      { target: 4, suffix: "", label: "Manufacturing Plants" },
      { target: 25, suffix: "+", label: "Years of Operation" },
      { target: 150, suffix: "+", label: "OEM Partners Served" },
    ],
  },
  products: {
    eyebrow: "Our Products",
    title: "From molten metal to market-ready alloy",
    description:
      "Five product lines, one continuous loop — every batch tracked from scrap intake to certified output.",
    items: [
      {
        title: "Aluminium Alloy (Liquid)",
        href: "products/ingots-alloys",
        imageSrc: "https://picsum.photos/seed/hg-liquid-alloy/700/560",
        imageAlt: "Molten aluminium alloy being poured",
      },
      {
        title: "Aluminium Alloy (Solid Ingot)",
        href: "products/ingots-alloys",
        imageSrc: "https://picsum.photos/seed/hg-solid-ingot/700/561",
        imageAlt: "Stacked solid aluminium alloy ingots",
      },
      {
        title: "Aluminium Billets",
        href: "products/billets",
        imageSrc: "https://picsum.photos/seed/hg-billets/700/562",
        imageAlt: "Cylindrical aluminium billets",
      },
      {
        title: "Zinc Alloy (Solid Ingots)",
        href: "products",
        imageSrc: "https://picsum.photos/seed/hg-zinc-ingots/700/563",
        imageAlt: "Worker inspecting solid zinc alloy ingots",
      },
      {
        title: "Stainless Steel Recycling",
        href: "products",
        imageSrc: "https://picsum.photos/seed/hg-steel-scrap/1400/500",
        imageAlt: "Sorted stainless steel scrap ready for recycling",
        wide: true,
      },
    ],
  },
  mission: {
    imageSrc: "https://picsum.photos/seed/hg-city-glass/1600/900",
    imageAlt:
      "Team looking out over the city skyline through an office window",
    statement:
      "To be Asia's most trusted name in metal recycling, delivering sustainable value to every stakeholder we serve.",
  },
  ctaBanner: {
    title: "Scrap your expenses, not your goals — we'll help you get there.",
    ctaLabel: "Inquire Now",
    ctaHref: "contact",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What our partners say",
    items: [
      {
        initials: "AS",
        name: "Ankur Singh",
        role: "Procurement Head, Velocity Auto Components",
        quote:
          "Consistent alloy quality and reliable turnaround for our production lines, batch after batch.",
      },
      {
        initials: "BN",
        name: "Bhaliya Nitin",
        role: "Plant Manager, Apex Cast Works",
        quote:
          "Their zinc ingots meet spec every single time, which keeps our line running without surprises.",
      },
      {
        initials: "KC",
        name: "Kishore Chettiar",
        role: "Supply Chain Lead, Nordic Auto Forge",
        quote:
          "Responsive team, transparent sourcing — exactly what we need from a recycling partner.",
      },
      {
        initials: "RM",
        name: "Riya Mehta",
        role: "Quality Lead, Meridian Engineering",
        quote:
          "Documentation and traceability on every consignment make our audits painless.",
      },
    ],
  },
  customers: {
    eyebrow: "Our Customers",
    title: "Trusted across India's engineering supply chain",
    description:
      "Our client lineup reads like a who's-who of the automotive and engineering industries. We've earned repeat business by staying fully compliant on every front our partners care about — quality, capacity, and delivery.",
    logos: [
      "Velocity Motors",
      "Apex Auto",
      "Nordic Forge",
      "Meridian Eng.",
      "Orbit Motors",
      "Cascade Alloys",
    ],
  },
  jointVentures: {
    eyebrow: "Joint Ventures",
    title: "HG Aluminium Smelters Ltd.",
    imageSrc: "https://picsum.photos/seed/hg-handshake-deal/1600/900",
    imageAlt: "Two business partners shaking hands over a signed agreement",
    items: [
      {
        title: "HG–Meridian Alloys",
        subtitle: "Precision die-casting alloys",
        icon: "handshake",
      },
      {
        title: "HG–Cascade Metals",
        subtitle: "Secondary smelting technology",
        icon: "factory",
      },
      {
        title: "HG–Vantage Recycling",
        subtitle: "Closed-loop scrap recovery",
        icon: "leaf",
      },
    ],
  },
  careers: {
    eyebrow: "Careers & Life at HG",
    title: "Built by people who care about the craft",
    body: "Our people are our core asset and the reason behind HG's growth. We invest in a safe, dynamic work environment, competitive compensation, and real opportunities to learn.",
    ctaLabel: "Apply Now",
    ctaHref: "careers",
    images: [
      {
        src: "https://picsum.photos/seed/hg-engineer-point/700/650",
        alt: "Engineer in a hard hat reviewing the plant floor",
      },
      {
        src: "https://picsum.photos/seed/hg-team-lineup/1100/650",
        alt: "Production team lined up in safety uniforms at the plant",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        question: "Which is the largest metal recycling company in India?",
        answer:
          "HG Aluminium Smelters Ltd. is one of India's largest producers of recycled aluminium and zinc die-casting alloys, operating multiple plants across North India.",
      },
      {
        question: "What is scrap metal recycling?",
        answer:
          "Scrap metal recycling is the process of collecting discarded or leftover metal, sorting it by grade, and reprocessing it into raw material that can be used again in manufacturing — instead of extracting virgin ore.",
      },
      {
        question: "How does aluminium recycling work?",
        answer:
          "Collected scrap is sorted, cleaned, and melted in a furnace. The molten metal is alloyed to the required specification, then cast into ingots, billets, or supplied directly in liquid form to a casting partner.",
      },
      {
        question: "What kind of scrap metal is worth money?",
        answer:
          "Non-ferrous metals such as aluminium, zinc, copper, and brass typically fetch higher value than ferrous scrap, with pricing driven by purity, grade, and current commodity rates.",
      },
      {
        question: "What can be done with recycled aluminium?",
        answer:
          "Recycled aluminium is used across the automotive, construction, packaging, and consumer-durables industries — commonly recast into die-casting alloy for engine and transmission components.",
      },
      {
        question: "How is recycling cost determined in India?",
        answer:
          "Cost depends on scrap grade, processing complexity, transportation, and prevailing commodity benchmarks. Buyback rates are typically quoted per kilogram and revised frequently.",
      },
      {
        question: "What is the scope of the recycling industry in India?",
        answer:
          "India's metal recycling sector continues to expand alongside automotive and infrastructure growth, supported by rising demand for lower-carbon, secondary-sourced metal.",
      },
    ],
  },
};
