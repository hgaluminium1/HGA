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
        imageAlt: "HG Aluminium plant operations in Gujarat",
        eyebrow: "HG Aluminium Smelters · Kadi, Gujarat",
        title: "Aluminium for demanding programmes",
        subtitle:
          "Extrusion profiles, homogenised billets and remelt ingots — chemistry control, mill certificates, and delivery you can plan around.",
      },
      {
        imageSrc: "https://picsum.photos/seed/hg-molten-pour/1600/901",
        imageAlt: "Molten aluminium pour on the casting floor",
        eyebrow: "Extrusion · Billets · Remelt",
        title: "From melt to market-ready alloy",
        subtitle:
          "Integrated casting and press capability for architectural, industrial, solar and foundry customers.",
      },
      {
        imageSrc: "https://picsum.photos/seed/hg-ingot-line/1600/902",
        imageAlt: "Finished aluminium lines ready for dispatch",
        eyebrow: "Traceable every lot",
        title: "Specs your auditors can trust",
        subtitle:
          "Documented release criteria and certificates that travel with every consignment.",
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
    title: "Cast. Homogenise. Extrude.",
    body: "We cast, homogenise and extrude aluminium for architectural, industrial, solar and foundry programmes from our Kadi / Mahesana campus — reliable chemistry, dimensional control and lot-level certificates.",
    highlightWords: ["cast", "homogenise", "extrude", "aluminium"],
    stats: [
      { target: 3, suffix: "", label: "Core product families" },
      { target: 8, suffix: "+", label: "Industry segments" },
      { target: 1, suffix: "", label: "Integrated Gujarat campus" },
      { target: 100, suffix: "%", label: "Lots with release docs" },
    ],
  },
  products: {
    eyebrow: "Our Products",
    title: "Present catalogue lines",
    description:
      "Extrusion profiles, homogenised billets and remelt alloys from our Kadi plant — published and ready for enquiry.",
    items: [],
  },
  mission: {
    imageSrc: "https://picsum.photos/seed/hg-city-glass/1600/900",
    imageAlt:
      "Team looking out over the city skyline through an office window",
    statement:
      "To be the aluminium partner programmes trust — for chemistry, certificates and on-time delivery.",
  },
  ctaBanner: {
    title: "Have a die, alloy or tonnage in mind? Tell us your programme.",
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
          "Their remelt lots meet spec every time, which keeps our foundry line running without surprises.",
      },
      {
        initials: "KC",
        name: "Kishore Chettiar",
        role: "Supply Chain Lead, Nordic Auto Forge",
        quote:
          "Responsive team, clear certificates — exactly what we need from an aluminium partner.",
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
    title: "Organisations we serve",
    description:
      "Approved name tiles from customer records. Brand logos appear only with explicit permission.",
    logos: [
      "Cosmos Construction",
      "Technocraft Industries",
      "Waaree Energies",
      "I-Form Aluminium",
      "Eins Technik",
      "Grasim Industries",
      "Knest Manufacturers",
      "SB Scaffolding",
    ],
  },
  jointVentures: {
    eyebrow: "Plant capability",
    title: "One campus — melt to profile",
    imageSrc: "https://picsum.photos/seed/hg-handshake-deal/1600/900",
    imageAlt: "HG Aluminium manufacturing floor and press line",
    items: [
      {
        title: "Casting & remelt",
        subtitle: "Chemistry control to programme grade",
        icon: "factory",
      },
      {
        title: "Extrusion press",
        subtitle: "Profiles for solar, structure & OEM",
        icon: "handshake",
      },
      {
        title: "Quality release",
        subtitle: "Mill certificates with every lot",
        icon: "leaf",
      },
    ],
  },
  careers: {
    eyebrow: "Careers & Life at HG",
    title: "Built by people who care about the craft",
    body: "Our people keep the melt, press and quality loops honest. We invest in a safe plant culture, competitive compensation, and real room to grow.",
    ctaLabel: "View openings",
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
        question: "What does HG Aluminium produce?",
        answer:
          "Extrusion profiles, homogenised billets and remelt ingots / alloys from our Kadi / Mahesana campus in Gujarat — with chemistry control and mill certificates on released lots.",
      },
      {
        question: "Where is the plant located?",
        answer:
          "Our manufacturing campus is at Laxmipura Nandasan, Taluka Kadi (Mahesana district), Gujarat — melting, casting and extrusion under one roof.",
      },
      {
        question: "How do I enquire about a grade or die?",
        answer:
          "Use Inquire Now / Contact with alloy, section, tonnage and delivery window. Procurement and technical teams respond with feasibility and lead-time guidance.",
      },
      {
        question: "Do you supply mill certificates?",
        answer:
          "Yes. Documented release criteria and certificates travel with every consignment so your quality and audit teams can verify chemistry and dimensions.",
      },
      {
        question: "Which markets do you serve?",
        answer:
          "Architectural and infrastructure extrusions, solar mounting and frames, industrial sections, cable / conductor-related demand, and foundry remelt programmes — see Markets we serve for the full map.",
      },
      {
        question: "Are upcoming products available to order?",
        answer:
          "Upcoming lines are marked Coming soon. You can register interest on the product page; allocation opens when the line is published in the present catalogue.",
      },
    ],
  },
};
