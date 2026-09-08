type HeroSlide = {
  imageSrc: string;
  imageAlt: string;
  imagePublicId?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  video?: {
    src: string;
    publicId?: string;
    posterSrc?: string;
    posterPublicId?: string;
    label?: string;
  } | null;
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

/** Realistic HG Aluminium mock — extrusion / billets / remelt (Gujarat). */
export const homeContentEn: HomeContent = {
  hero: {
    slides: [
      {
        imageSrc: "https://picsum.photos/seed/hg-plant-wide-v2/1600/900",
        imageAlt: "HG Aluminium Smelters plant campus in Kadi, Gujarat",
        eyebrow: "HG Aluminium Smelters · Kadi, Gujarat",
        title: "Aluminium programmes you can plan around",
        subtitle:
          "Extrusion profiles, homogenised billets and remelt ingots — chemistry control, mill certificates, and dispatch cadence that matches your line.",
        primaryCta: { label: "Inquire Now", href: "contact" },
        video: {
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          posterSrc: "https://picsum.photos/seed/hg-video-poster-v2/960/540",
          label: "Watch our story",
        },
      },
      {
        imageSrc: "https://picsum.photos/seed/hg-molten-pour-v2/1600/900",
        imageAlt: "Molten aluminium pour on the casting floor",
        eyebrow: "Extrusion · Billets · Remelt",
        title: "From melt to market-ready alloy",
        subtitle:
          "Integrated casting and press capability for architectural, industrial, solar and foundry customers across India.",
        primaryCta: { label: "Inquire Now", href: "contact" },
        video: null,
      },
      {
        imageSrc: "https://picsum.photos/seed/hg-ingot-line-v2/1600/900",
        imageAlt: "Finished aluminium billets staged for dispatch",
        eyebrow: "Traceable every lot",
        title: "Specs your auditors can trust",
        subtitle:
          "Documented release criteria and certificates that travel with every consignment — chemistry, dimensions, and lot ID.",
        primaryCta: { label: "View catalogue", href: "products" },
        video: null,
      },
    ],
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
    imageSrc: "https://picsum.photos/seed/hg-mission-plant-v2/1600/900",
    imageAlt: "Sunset light across the HG Aluminium plant roof line",
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
      {
        initials: "PV",
        name: "Pratik Vora",
        role: "Projects, Horizon Solar Structures",
        quote:
          "Frame and rail sections arrive cut-to-length with packing that survives site handling.",
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
      "Horizon Solar",
      "Meridian Engineering",
      "Apex Cast Works",
      "Velocity Auto",
    ],
  },
  jointVentures: {
    eyebrow: "Plant capability",
    title: "One campus — melt to profile",
    imageSrc: "https://picsum.photos/seed/hg-press-floor-v2/1600/900",
    imageAlt: "Extrusion press floor at HG Aluminium",
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
    eyebrow: "Careers & life at HG",
    title: "Built by people who care about the craft",
    body: "Our people keep the melt, press and quality loops honest. We invest in a safe plant culture, competitive compensation, and real room to grow.",
    ctaLabel: "View openings",
    ctaHref: "careers",
    images: [
      {
        src: "https://picsum.photos/seed/hg-engineer-point-v2/900/600",
        alt: "Engineer in a hard hat reviewing the plant floor",
      },
      {
        src: "https://picsum.photos/seed/hg-team-lineup-v2/700/525",
        alt: "Production team in safety uniforms at the plant",
      },
      {
        src: "https://picsum.photos/seed/hg-qc-lab-v2/700/525",
        alt: "Quality technician checking a billet sample",
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
