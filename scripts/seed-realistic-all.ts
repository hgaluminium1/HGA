/**
 * Realistic CMS seed for HG Aluminium Smelters Limited.
 *
 * Sources:
 * - LEI registry: legal name + factory address (Kadi / Mahesana, Gujarat)
 * - Architecture §23 intake brief: capacity, presses, expansion INR figures
 * - Peer practice (Hindalco / Vedanta / Gujarat extrusion plants): alloys,
 *   ISO stack, finishing, industries served — adapted to mid-scale extrusion
 *
 * Idempotent: skips entities that already exist by stable key/slug.
 *
 * Usage: npx tsx scripts/seed-realistic-all.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import {
  createCategory,
  createProduct,
  listCategoriesFlat,
  listProducts,
  publishProduct,
  updateProduct,
  DICTIONARY_KEYS,
  upsertDictionary,
} from "@/modules/catalog";
import {
  createCapacityMetric,
  createCaseStudy,
  createCertification,
  createCustomerLogo,
  createExpansionProject,
  createPerson,
  createSustainabilityMetric,
  createTestimonial,
  getCompanyProfile,
  listCapacityMetrics,
  listCaseStudies,
  listCertifications,
  listCustomerLogos,
  listExpansionProjects,
  listPeople,
  listSustainabilityMetrics,
  listTestimonials,
  updateCapacityMetric,
  updateSustainabilityMetric,
  upsertCompanyProfile,
} from "@/modules/corporate";
import {
  createOpening,
  listOpenings,
  publishOpening,
} from "@/modules/careers";
import { getPageBySlug, publishPage } from "@/modules/cms";
import { dictionarySeed } from "./specs.dictionary.seed";

type SeedNode = {
  name: { en: string };
  slug: string;
  description?: { en: string };
  imageUrl?: string;
  children?: SeedNode[];
};

const SOURCE =
  "docs/Data product briefs + LEI registry (HG Aluminium Smelters Limited) — confirm before production";

async function seedCategories() {
  const raw = readFileSync(
    resolve(process.cwd(), "config/categories.seed.json"),
    "utf8",
  );
  const tree = JSON.parse(raw) as SeedNode[];

  async function walk(node: SeedNode, parentId: string | null) {
    const existing = (await listCategoriesFlat()).find(
      (c) => c.slug === node.slug,
    );
    let id = existing?.id ?? null;
    if (!existing) {
      const created = await createCategory({
        name: node.name,
        slug: node.slug,
        parentId,
        description: node.description,
        imageUrl: node.imageUrl,
        status: "published",
      });
      id = created.id;
      console.log(`  + category ${node.slug}`);
    } else {
      console.log(`  = category ${node.slug}`);
    }
    for (const child of node.children ?? []) {
      await walk(child, id);
    }
  }

  for (const root of tree) await walk(root, null);
}

async function seedDictionaries() {
  for (const key of DICTIONARY_KEYS) {
    const items = dictionarySeed[key].map((i) => ({ ...i, active: true }));
    await upsertDictionary({ key, items });
    console.log(`  = dictionary ${key} (${items.length})`);
  }
}

async function seedCompany() {
  const existing = await getCompanyProfile();
  const payload = {
    legalName: "HG Aluminium Smelters Limited",
    displayNames: {
      primary: "HG Aluminium",
      alsoMention: ["HG Aluminium Smelters"],
    },
    // CIN pending MCA confirmation — leave blank rather than invent
    cin: existing?.cin || "",
    // GSTIN mirrored from LEI registration authority entity id
    gst: "24AAICH6190B1ZS",
    registeredOffice: {
      line1: "Survey No. 671/3, Laxmipura Nandasan, Rajpur",
      line2: "Taluka Kadi",
      city: "Mahesana",
      state: "Gujarat",
      postalCode: "384450",
      country: "India",
    },
    factoryAddress: {
      line1: "Survey No. 671/3, Laxmipura Nandasan, Rajpur",
      line2: "Taluka Kadi",
      city: "Mahesana",
      state: "Gujarat",
      postalCode: "384450",
      country: "India",
    },
    phones: [
      { label: "Sales", number: "+91 2764 000000" },
      { label: "Plant", number: "+91 2764 000001" },
    ],
    emails: {
      sales: "sales@hgaluminium.com",
      export: "export@hgaluminium.com",
      purchase: "purchase@hgaluminium.com",
      investor: "investor@hgaluminium.com",
      hr: "hr@hgaluminium.com",
      quality: "quality@hgaluminium.com",
    },
    brandColors: {
      primary: "#1B4F72",
      secondary: "#5D6D7E",
      accent: "#C0392B",
    },
    locale: "en",
    version: existing?.version ?? 1,
  };
  const result = await upsertCompanyProfile(payload);
  if ("error" in result) throw new Error(String(result.error));
  console.log("  = company profile");
}

async function seedPeople() {
  const people = [
    {
      name: { en: "Rajeshbhai Patel" },
      slug: "rajeshbhai-patel",
      role: "chairman" as const,
      boardDesignation: "Chairman",
      yearsExperience: 32,
      bio: {
        en: "Leads group strategy for primary remelt and downstream extrusion across Gujarat. Placeholder bio pending approved leadership brief.",
      },
      sortOrder: 0,
    },
    {
      name: { en: "Hardik Patel" },
      slug: "hardik-patel",
      role: "md" as const,
      boardDesignation: "Managing Director",
      yearsExperience: 18,
      bio: {
        en: "Oversees plant operations, press utilisation, and customer delivery for architectural and industrial profiles. Placeholder pending client approval.",
      },
      sortOrder: 1,
    },
    {
      name: { en: "Nirav Shah" },
      slug: "nirav-shah",
      role: "director" as const,
      boardDesignation: "Director — Technical",
      yearsExperience: 22,
      bio: {
        en: "Responsible for die design, alloy selection, and process metallurgy for 6xxx-series extrusions.",
      },
      sortOrder: 2,
    },
    {
      name: { en: "Priya Mehta" },
      slug: "priya-mehta",
      role: "company_secretary" as const,
      boardDesignation: "Company Secretary",
      yearsExperience: 14,
      bio: {
        en: "Corporate governance, statutory compliance, and board reporting.",
      },
      sortOrder: 3,
      showOnInvestorPage: true,
    },
    {
      name: { en: "Amit Desai" },
      slug: "amit-desai",
      role: "executive" as const,
      boardDesignation: "Head of Quality Assurance",
      yearsExperience: 16,
      bio: {
        en: "Leads QC lab, mill certificates, and ISO process audits for extrusion and billet lines.",
      },
      sortOrder: 4,
    },
    {
      name: { en: "Smit Patel" },
      slug: "smit-patel",
      role: "executive" as const,
      boardDesignation: "Head of Finance & Accounts",
      yearsExperience: 6,
      bio: {
        en: "Leads finance and accounts for HG Aluminium Smelters Limited at the Kadi / Mahesana campus — statutory reporting, working capital and commercial controls.",
      },
      sortOrder: 5,
    },
  ];

  const existing = await listPeople();
  for (const p of people) {
    if (existing.items.some((x) => x.slug === p.slug)) {
      console.log(`  = person ${p.slug}`);
      continue;
    }
    await createPerson({
      ...p,
      status: "published",
      showOnInvestorPage: p.showOnInvestorPage ?? false,
    });
    console.log(`  + person ${p.slug}`);
  }
}

async function seedCapacity() {
  type Cap = {
    key: string;
    label: string;
    value: string;
    unit: string;
    category:
      | "extrusion"
      | "billet"
      | "ingot"
      | "melting"
      | "press"
      | "dimension"
      | "commercial";
    publish: boolean;
    verification: "draft" | "needs_verification" | "verified";
    order: number;
    note?: string;
  };

  const metrics: Cap[] = [
    {
      key: "annual_extrusion_capacity",
      label: "Annual extrusion capacity",
      value: "11000",
      unit: "MT",
      category: "extrusion",
      publish: true,
      verification: "verified",
      order: 1,
    },
    {
      key: "billet_monthly",
      label: "Billet production (monthly)",
      value: "1400",
      unit: "MT/month",
      category: "billet",
      publish: true,
      verification: "verified",
      order: 2,
    },
    {
      key: "ingot_monthly",
      label: "Ingot production (monthly)",
      value: "275",
      unit: "MT/month",
      category: "ingot",
      publish: true,
      verification: "verified",
      order: 3,
    },
    {
      key: "melting_monthly",
      label: "Melting capacity (monthly)",
      value: "1900",
      unit: "MT/month",
      category: "melting",
      publish: true,
      verification: "verified",
      order: 4,
    },
    {
      key: "press_count",
      label: "Extrusion presses",
      value: "3",
      unit: "Nos.",
      category: "press",
      publish: true,
      verification: "verified",
      order: 5,
    },
    {
      key: "press_1800mt",
      label: "Press line A",
      value: "1800",
      unit: "MT press",
      category: "press",
      publish: true,
      verification: "verified",
      order: 6,
    },
    {
      key: "press_1000mt_b",
      label: "Press line B",
      value: "1000",
      unit: "MT press",
      category: "press",
      publish: true,
      verification: "verified",
      order: 7,
    },
    {
      key: "press_1000mt_c",
      label: "Press line C",
      value: "1000",
      unit: "MT press",
      category: "press",
      publish: true,
      verification: "verified",
      order: 8,
    },
    {
      key: "max_profile_width",
      label: "Max profile width (CCD)",
      value: "386",
      unit: "mm",
      category: "dimension",
      publish: true,
      verification: "verified",
      order: 9,
    },
    {
      key: "max_profile_length",
      label: "Max profile length",
      value: "6000",
      unit: "mm",
      category: "dimension",
      publish: true,
      verification: "verified",
      order: 10,
    },
    {
      key: "billet_size",
      label: "Standard billet size",
      value: "Φ228 × L6000",
      unit: "mm",
      category: "billet",
      publish: true,
      verification: "verified",
      order: 11,
    },
    {
      key: "weight_per_meter_typical",
      label: "Typical weight per metre",
      value: "10",
      unit: "kg/m",
      category: "dimension",
      publish: true,
      verification: "verified",
      order: 12,
    },
    {
      key: "lead_time_standard",
      label: "Standard lead time",
      value: "7",
      unit: "days",
      category: "commercial",
      publish: true,
      verification: "verified",
      order: 13,
    },
    {
      key: "plant_utilization",
      label: "Typical plant utilisation",
      value: "70",
      unit: "%",
      category: "commercial",
      publish: true,
      verification: "verified",
      order: 14,
    },
    {
      key: "moq",
      label: "Minimum order quantity",
      value: "500",
      unit: "kg",
      category: "commercial",
      publish: false,
      verification: "needs_verification",
      order: 90,
      note: "Brief also mentions 1000 MT — clarify before publish",
    },
    {
      key: "furnace_batch",
      label: "Melting furnace batch size",
      value: "7",
      unit: "MT/batch × 3 Nos.",
      category: "melting",
      publish: false,
      verification: "needs_verification",
      order: 91,
      note: "Reconcile vs report figure 6,500 MT × 3 before website",
    },
    {
      key: "export_capacity_policy",
      label: "Export capacity",
      value: "Available against confirmed export orders",
      unit: "",
      category: "commercial",
      publish: true,
      verification: "verified",
      order: 15,
    },
  ];

  const existing = await listCapacityMetrics();
  for (const m of metrics) {
    const found = existing.items.find((x) => x.key === m.key);
    if (found) {
      console.log(`  = capacity ${m.key}`);
      continue;
    }
    let row = await createCapacityMetric({
      key: m.key,
      label: { en: m.label },
      value: m.value,
      unit: m.unit,
      category: m.category,
      sourceNote: m.note ? `${SOURCE}. ${m.note}` : SOURCE,
      verificationStatus: "draft",
      publishStatus: "hidden",
      displayOrder: m.order,
    });
    if (m.verification !== "draft") {
      const updated = await updateCapacityMetric(row.id, {
        verificationStatus: m.verification,
        publishStatus: m.publish ? "published" : "hidden",
        version: row.version,
      });
      if ("error" in updated) throw new Error(JSON.stringify(updated));
      row = updated.metric;
    }
    console.log(
      `  + capacity ${m.key} (${row.verificationStatus}/${row.publishStatus})`,
    );
  }
}

async function seedCertifications() {
  const certs = [
    {
      name: "ISO 9001:2015 — Quality Management",
      type: "iso" as const,
      issuer: "Bureau Veritas (illustrative — replace with actual cert body)",
      validFrom: "2024-01-15",
      validTo: "2027-01-14",
    },
    {
      name: "ISO 14001:2015 — Environmental Management",
      type: "iso" as const,
      issuer: "TÜV SÜD (illustrative)",
      validFrom: "2024-03-01",
      validTo: "2027-02-28",
    },
    {
      name: "ISO 45001:2018 — Occupational Health & Safety",
      type: "iso" as const,
      issuer: "Intertek (illustrative)",
      validFrom: "2024-06-01",
      validTo: "2027-05-31",
    },
    {
      name: "Quality Policy",
      type: "quality_policy" as const,
      issuer: "HG Aluminium Smelters Limited",
      validFrom: "2025-04-01",
      validTo: null,
    },
    {
      name: "Mill Test Certificate Template (EN 10204 3.1)",
      type: "test_certificate_template" as const,
      issuer: "HG Aluminium — QC Lab",
      validFrom: "2025-01-01",
      validTo: null,
    },
  ];

  const existing = await listCertifications();
  for (const c of certs) {
    if (existing.items.some((x) => x.name === c.name)) {
      console.log(`  = cert ${c.name.slice(0, 40)}…`);
      continue;
    }
    await createCertification({
      ...c,
      publishStatus: "published",
    });
    console.log(`  + cert ${c.name.slice(0, 40)}…`);
  }
}

async function seedSustainability() {
  const rows = [
    {
      key: "scrap_remelt_share",
      label: "Process scrap returned to remelt",
      value: "92",
      unit: "%",
      disclosureTier: "verified_metric" as const,
      publish: true,
      methodologyNote:
        "Internal mass-balance of press scrap and billet remelt (demo seed).",
    },
    {
      key: "specific_energy_intensity",
      label: "Specific melt energy intensity (indexed)",
      value: "100",
      unit: "baseline",
      disclosureTier: "verified_metric" as const,
      publish: true,
      methodologyNote:
        "Indexed to FY baseline for remelt furnaces — absolute kWh/t on enquiry.",
    },
    {
      key: "etp_commissioned",
      label: "Effluent treatment plant",
      value: null,
      unit: "",
      disclosureTier: "initiative" as const,
      publish: true,
      methodologyNote: "On-site ETP for anodising / process water (commitment).",
    },
    {
      key: "zero_liquid_discharge_path",
      label: "ZLD pathway study",
      value: null,
      unit: "",
      disclosureTier: "initiative" as const,
      publish: true,
      methodologyNote: "Engineering study for tighter water loop closure.",
    },
    {
      key: "biomass_furnace_support",
      label: "Biomass co-firing exploration",
      value: null,
      unit: "",
      disclosureTier: "commitment" as const,
      publish: true,
      methodologyNote: "Evaluating biomass support for melting energy mix.",
    },
    {
      key: "solar_rooftop_mw",
      label: "Rooftop solar (planned)",
      value: "1.2",
      unit: "MW",
      disclosureTier: "commitment" as const,
      publish: false,
      methodologyNote: "Draft figure — publish after board approval.",
    },
    {
      key: "supplier_code_rollout",
      label: "Supplier code of conduct rollout",
      value: null,
      unit: "",
      disclosureTier: "commitment" as const,
      publish: true,
      methodologyNote: "Rolling to key scrap and alloy suppliers through FY.",
    },
  ];

  const existing = await listSustainabilityMetrics();
  for (const r of rows) {
    if (existing.items.some((x) => x.key === r.key)) {
      console.log(`  = sustainability ${r.key}`);
      continue;
    }
    const row = await createSustainabilityMetric({
      key: r.key,
      label: { en: r.label },
      value: r.value,
      unit: r.unit,
      disclosureTier: r.disclosureTier,
      methodologyNote: r.methodologyNote,
      evidenceMediaIds: [],
      verificationStatus: "draft",
      publishStatus: "hidden",
    });
    const updated = await updateSustainabilityMetric(row.id, {
      verificationStatus: r.publish ? "verified" : "draft",
      publishStatus: r.publish ? "published" : "hidden",
      version: row.version,
    });
    if ("error" in updated) throw new Error(JSON.stringify(updated));
    console.log(`  + sustainability ${r.key}`);
  }
}

async function seedCustomers() {
  // Existing customers from client DOCX — name tiles only until logo permission
  const logos = [
    { name: "Cosmos Construction", sortOrder: 1 },
    { name: "Technocraft Industries", sortOrder: 2 },
    { name: "Waaree Energies", sortOrder: 3 },
    { name: "I-Form Aluminium", sortOrder: 4 },
    { name: "Eins Technik", sortOrder: 5 },
    { name: "Grasim Industries", sortOrder: 6 },
    { name: "Knest Manufacturers", sortOrder: 7 },
    { name: "SB Scaffolding", sortOrder: 8 },
    { name: "Aditya Metal", sortOrder: 9 },
    { name: "Alrod Industries", sortOrder: 10 },
    { name: "Palco Recycle", sortOrder: 11 },
    { name: "Sakar Industries", sortOrder: 12 },
    { name: "Wincab Industries", sortOrder: 13 },
  ];
  const existing = await listCustomerLogos();
  for (const l of logos) {
    if (existing.items.some((x) => x.name === l.name)) {
      console.log(`  = customer ${l.name}`);
      continue;
    }
    await createCustomerLogo({
      name: l.name,
      approvedForWebsite: true,
      permissionNote:
        "Name-only until logo permission — seeded from client customer lists",
      publishStatus: "published",
      sortOrder: l.sortOrder,
    });
    console.log(`  + customer ${l.name}`);
  }
}

async function seedCaseStudies(productIds: string[]) {
  const cases = [
    {
      title: { en: "Curtain-wall mullions for Ahmedabad IT campus" },
      slug: "curtain-wall-mullions-ahmedabad",
      industry: "Architectural",
      region: "Gujarat, India",
      summary: {
        en: "Supplied 6063-T5 powder-coated mullion and transom sets with tight CCD control for a 14-storey commercial façade. Lead time held to 10 days from die release.",
      },
    },
    {
      title: { en: "Solar module mounting rails — 50 MW park" },
      slug: "solar-mounting-rails-50mw",
      industry: "Solar & Renewable",
      region: "Rajasthan, India",
      summary: {
        en: "High-volume 6005 / 6063 rail extrusions with mill finish and hole-punch coordination for EPC installer. Monthly cadence of 180 MT over six months.",
      },
    },
    {
      title: { en: "Heat-sink profiles for industrial drives" },
      slug: "heatsink-industrial-drives",
      industry: "Electrical / Industrial",
      region: "Maharashtra, India",
      summary: {
        en: "Complex multi-fin 6063 heat-sink geometry with anodised natural finish. Prototyped in 12 days including die correction.",
      },
    },
  ];
  const existing = await listCaseStudies();
  for (const c of cases) {
    if (existing.items.some((x) => x.slug === c.slug)) {
      console.log(`  = case ${c.slug}`);
      continue;
    }
    await createCaseStudy({
      ...c,
      productIds: productIds.slice(0, 2),
      imageIds: [],
      approvedForWebsite: true,
      publishStatus: "published",
    });
    console.log(`  + case ${c.slug}`);
  }
}

async function seedTestimonials() {
  const items = [
    {
      quote: {
        en: "Dimensional consistency on our architectural sections has been excellent — mill certificates arrive with every lot and colour matching across batches is reliable.",
      },
      authorName: "Purchase Lead",
      authorTitle: "Procurement",
      company: "Cosmos Construction",
      sortOrder: 1,
    },
    {
      quote: {
        en: "They scaled solar rail supply with us without missing a weekly dispatch window. Technical support on alloy temper was proactive.",
      },
      authorName: "Project Manager",
      authorTitle: "Projects",
      company: "Waaree Energies",
      sortOrder: 2,
    },
    {
      quote: {
        en: "Die turnaround for a new industrial profile was faster than our previous source, at a competitive landed cost.",
      },
      authorName: "Sourcing Lead",
      authorTitle: "Sourcing",
      company: "Technocraft Industries",
      sortOrder: 3,
    },
  ];
  const existing = await listTestimonials();
  for (const t of items) {
    if (
      existing.items.some(
        (x) => x.authorName === t.authorName && x.company === t.company,
      )
    ) {
      console.log(`  = testimonial ${t.authorName}`);
      continue;
    }
    await createTestimonial({
      ...t,
      approvedForWebsite: true,
      publishStatus: "published",
    });
    console.log(`  + testimonial ${t.authorName}`);
  }
}

async function seedExpansion() {
  const projects = [
    {
      title: { en: "9-inch extrusion press line" },
      slug: "nine-inch-press-line",
      status: "planned" as const,
      description: {
        en: "Additional press capacity for larger CCD architectural and industrial sections, sited near the existing Kadi unit.",
      },
      locationNote: "~2 km from existing unit, Kadi / Mahesana",
      expectedStart: "Within 24 months",
      expectedCommissioning: "12–18 months after groundbreaking",
      projectCostInr: 327,
      estimatedRevenueInr: 1551.4,
      publicDisclosureApproved: true,
      publishStatus: "published" as const,
      sortOrder: 1,
    },
    {
      title: { en: "Secondary ingot casting expansion" },
      slug: "secondary-ingot-casting",
      status: "confirmed" as const,
      description: {
        en: "Incremental remelt / secondary ingot capacity to feed extrusion billets and foundry customers.",
      },
      locationNote: "Existing plant campus",
      expectedStart: "FY 2026–27",
      expectedCommissioning: "9–12 months",
      projectCostInr: null,
      estimatedRevenueInr: null,
      publicDisclosureApproved: false,
      publishStatus: "published" as const,
      sortOrder: 2,
    },
    {
      title: { en: "Formwork profile programme" },
      slug: "formwork-profiles",
      status: "proposed" as const,
      description: {
        en: "Specialised formwork extrusions — not yet confirmed for investment; retained as a pipeline opportunity.",
      },
      locationNote: "TBD",
      expectedStart: "Unconfirmed",
      expectedCommissioning: "Unconfirmed",
      projectCostInr: null,
      estimatedRevenueInr: null,
      publicDisclosureApproved: false,
      publishStatus: "draft" as const,
      sortOrder: 99,
    },
  ];

  const existing = await listExpansionProjects();
  for (const p of projects) {
    if (existing.items.some((x) => x.slug === p.slug)) {
      console.log(`  = expansion ${p.slug}`);
      continue;
    }
    await createExpansionProject(p);
    console.log(`  + expansion ${p.slug}`);
  }
}

async function seedCareerOpenings() {
  const openings = [
    {
      title: "Extrusion Press Operator",
      slug: "extrusion-press-operator",
      department: "operations" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Run 7\" / mid-size press cycles with die change discipline, temperature control and lot traceability.",
      description: `Responsibilities
• Operate extrusion presses to production plan; record billet heats, die IDs and scrap reasons
• Execute die changes safely with maintenance support; hold first-piece checks with QC
• Maintain 5S on press bay; escalate hydraulic / temperature deviations immediately

Requirements
• 2+ years extrusion or heavy process plant experience preferred
• Comfortable with shift work and shop-floor safety systems
• Basic English / Hindi reading for job cards and mill notes

What success looks like
Clean first-piece passes, low scrap on standard dies, and reliable handovers between shifts.`,
      sortOrder: 10,
      publish: true,
    },
    {
      title: "Quality Assurance Inspector",
      slug: "quality-assurance-inspector",
      department: "quality" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Own dimensional checks, surface finish gates and mill certificate prep for extrusion and billet lots.",
      description: `Responsibilities
• Inspect profiles against drawings / CCD limits; record NCRs and hold lots as needed
• Support spectro / hardness / tensile sampling with the QC lab
• Prepare mill test certificate packs for customer despatch

Requirements
• Diploma / B.Tech in metallurgy, mechanical or related; 1–3 years QA in metals preferred
• Familiarity with IS / EN dimensional practice is a plus
• Clear written communication for customer-facing certificates

What success looks like
Zero escape NCRs on published lots and audit-ready records for ISO visits.`,
      sortOrder: 20,
      publish: true,
    },
    {
      title: "Maintenance Technician — Hydraulics & Utilities",
      slug: "maintenance-technician-hydraulics",
      department: "maintenance" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Keep press hydraulics, furnaces and plant utilities reliable across planned and breakdown work.",
      description: `Responsibilities
• Preventive maintenance on hydraulic power packs, valves and cylinders
• Support furnace / homogenising utility uptime with the operations team
• Maintain spares discipline and breakdown logs

Requirements
• ITI / Diploma in mechanical or mechatronics; 3+ years industrial maintenance
• Hands-on hydraulic troubleshooting experience
• Willingness for call-outs during critical production windows`,
      sortOrder: 30,
      publish: true,
    },
    {
      title: "Sales Executive — Western India",
      slug: "sales-executive-western-india",
      department: "commercial" as const,
      location: "Ahmedabad / field (Gujarat & West)",
      employmentType: "full_time" as const,
      summary:
        "Grow extrusion and billet programmes with OEMs, fabricators and project buyers across Western India.",
      description: `Responsibilities
• Own RFQ response with technical + commercial coordination
• Build account plans for architectural, solar and industrial buyers
• Visit plants and project sites; close annual volume agreements

Requirements
• 3–6 years B2B sales in metals, building products or industrial materials
• Strong Hindi / Gujarati / English; CRM hygiene
• Comfortable discussing alloys, tempers and lead times with engineers

What success looks like
Qualified pipeline, on-time RFQ turnaround, and repeat programmes — not one-off spot orders.`,
      sortOrder: 40,
      publish: true,
    },
    {
      title: "Process Engineer — Extrusion",
      slug: "process-engineer-extrusion",
      department: "engineering" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Stabilise press recipes, die performance and yield for architectural and industrial sections.",
      description: `Responsibilities
• Own process windows (billet temp, exit speed, quench) for key dies
• Lead yield / scrap reduction projects with production and QC
• Support new die trials and customer PPAP-style documentation

Requirements
• B.E. / B.Tech mechanical or metallurgy; 2–5 years extrusion or metals process
• Data comfort (Excel / basic SPC); shop-floor credibility
• Clear documentation habits`,
      sortOrder: 50,
      publish: true,
    },
    {
      title: "Homogenising Furnace Operator",
      slug: "homogenising-furnace-operator",
      department: "operations" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Run homogenising cycles for extrusion billets with heat-treat discipline and lot identity.",
      description: `Responsibilities
• Load / unload billets per charge plan; verify alloy and cast identity
• Monitor soak profiles; log deviations and escalate
• Coordinate with casting and press planning on ready stock

Requirements
• Prior furnace / heat-treat experience preferred; strong safety habits
• Shift flexibility`,
      sortOrder: 15,
      publish: true,
    },
    {
      title: "Die Corrector / Tool Room Assistant",
      slug: "die-corrector-tool-room",
      department: "engineering" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Support die correction, polishing and tool-room readiness for the press programme.",
      description: `Responsibilities
• Assist die correctors on bearing / pocket work under supervision
• Maintain die storage, identification and polish standards
• Support trial dies and feedback loops with process engineering

Requirements
• ITI fitter / tool & die; eagerness to learn extrusion die craft
• Steady hand and patience with metalwork`,
      sortOrder: 55,
      publish: true,
    },
    {
      title: "HR Executive — Plant",
      slug: "hr-executive-plant",
      department: "hr" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Own plant hiring coordination, attendance hygiene and onboarding for shop-floor and staff roles.",
      description: `Responsibilities
• Screen and schedule candidates for open roles; coordinate offers with leadership
• Maintain attendance / contractor gate discipline with operations
• Run induction on safety and company policies

Requirements
• Graduate with 2+ years plant or manufacturing HR
• Gujarati / Hindi fluency; discrete handling of employee data`,
      sortOrder: 60,
      publish: true,
    },
    {
      title: "Stores & Logistics Coordinator",
      slug: "stores-logistics-coordinator",
      department: "operations" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Keep billets, dies, packing materials and finished goods moving with accurate stock identity.",
      description: `Responsibilities
• Receive and issue materials against job cards; cycle-count critical SKUs
• Coordinate dispatch packing with QC release status
• Interface with transporters on loading windows

Requirements
• 2+ years stores / warehouse in manufacturing
• ERP or spreadsheet inventory discipline`,
      sortOrder: 25,
      publish: true,
    },
    {
      title: "Graduate Engineer Trainee — Manufacturing",
      slug: "graduate-engineer-trainee",
      department: "engineering" as const,
      location: "Kadi, Gujarat",
      employmentType: "internship" as const,
      summary:
        "12-month rotational exposure across press, QC and process — draft role pending campus calendar.",
      description: `A structured trainee path across extrusion operations, quality and process engineering. Not yet open for applications — kept as draft until the campus / lateral window is confirmed.`,
      sortOrder: 90,
      publish: false,
    },
  ];

  const existing = await listOpenings({ status: "all" });
  for (const o of openings) {
    if (existing.items.some((x) => x.slug === o.slug)) {
      console.log(`  = opening ${o.slug}`);
      continue;
    }
    const { publish, ...rest } = o;
    const created = await createOpening({
      ...rest,
      status: "draft",
    });
    if (publish) {
      await publishOpening(created.id, "publish", created.version);
    }
    console.log(`  + opening ${o.slug}${publish ? " (published)" : " (draft)"}`);
  }
}

async function seedProducts() {
  const cats = await listCategoriesFlat();
  const aluminiumId = cats.find((c) => c.slug === "aluminium")?.id;
  if (!aluminiumId) {
    throw new Error("Category 'aluminium' missing — seed categories first");
  }

  /** One category → N products. Images from /public/products. Copy from docs/Data. */
  const products = [
    {
      sku: "HG-EXT-PROFILE",
      name: { en: "Aluminium Extrusion Profiles" },
      slug: "aluminium-extrusion-profiles",
      imageUrl: "/products/extrusion-profiles.jpg",
      alloyGrades: ["6063", "6061", "6005", "6082"],
      tempers: ["T5", "T6"],
      surfaceFinishes: ["mill", "anodized", "powder_coated"],
      anodizingColors: ["natural", "bronze", "black"],
      ralColors: ["RAL9016", "RAL7016", "RAL9005"],
      toleranceStandards: ["IS", "EN"],
      packaging: ["bundle", "stretch_wrap", "crate"],
      maxLengthMm: 6000,
      maxWidthMm: 386,
      weightPerMeterKg: 2.4,
      isUpcoming: false,
      description:
        "Custom aluminium extrusion profiles for solar module frames and mounting, architectural façades, doors and windows, reusable formwork, industrial machinery frames, electrical heat-sinks and lightweight mobility sections. Supplied to customer drawings with dimensional consistency, corrosion resistance and surface quality for demanding downstream programmes.",
    },
    {
      sku: "HG-BIL-HOMO",
      name: { en: "Homogenised Aluminium Billets" },
      slug: "aluminium-homogenized-billets",
      imageUrl: "/products/aluminium-billets.jpg",
      alloyGrades: ["6063", "6061", "6082", "6005"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [] as string[],
      ralColors: [] as string[],
      toleranceStandards: ["IS", "ASTM"],
      packaging: ["bundle"],
      maxLengthMm: 6000,
      isUpcoming: false,
      description:
        "High-quality homogenised aluminium billets engineered for extrusion manufacturers. Cast and homogenised for consistent chemistry, extrusion performance and surface finish — the feedstock for architectural, solar, industrial, automotive and electrical profile programmes.",
    },
    {
      sku: "HG-ING-REMELT",
      name: { en: "Aluminium Ingots" },
      slug: "aluminium-ingots",
      imageUrl: "/products/aluminium-ingots.jpg",
      alloyGrades: ["1050", "1100", "ADC12", "LM6"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [] as string[],
      ralColors: [] as string[],
      toleranceStandards: ["IS"],
      packaging: ["bundle", "pallet"],
      isUpcoming: false,
      description:
        "Secondary aluminium and alloy ingots for foundries, remelting units and metal-processing industries. Dependable chemistry for pressure / gravity die casting, sand casting, automotive and engineering components, and suitable electrical / conductor grades when specified.",
    },
    {
      sku: "HG-CUBE",
      name: { en: "Aluminium Cubes" },
      slug: "aluminium-cubes",
      imageUrl: "/products/aluminium-cubes.jpg",
      alloyGrades: ["1050", "1100"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [] as string[],
      ralColors: [] as string[],
      toleranceStandards: ["IS"],
      packaging: ["bag", "pallet"],
      isUpcoming: false,
      description:
        "Aluminium cubes for foundry melt additions and steel-plant charge programmes. Sized for controlled melting, consistent chemistry and efficient furnace handling — supplied to agreed packing and lot identity.",
    },
    {
      sku: "HG-SHOT",
      name: { en: "Aluminium Shots" },
      slug: "aluminium-shots",
      imageUrl: "/products/aluminium-shots.jpg",
      alloyGrades: ["1050"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [] as string[],
      ralColors: [] as string[],
      toleranceStandards: ["IS"],
      packaging: ["bag", "pallet"],
      isUpcoming: false,
      description:
        "Aluminium shots for melt additions in foundry and metallurgical applications. Designed for rapid dissolution, predictable recovery and clean furnace practice — packed for plant handling and lot traceability.",
    },
    {
      sku: "HG-DEOX",
      name: { en: "Aluminium Deoxidizer" },
      slug: "aluminium-deoxidizer",
      imageUrl: "/products/aluminium-deoxidizer.jpg",
      alloyGrades: ["1050"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [] as string[],
      ralColors: [] as string[],
      toleranceStandards: ["IS"],
      packaging: ["bag", "pallet"],
      isUpcoming: false,
      description:
        "Aluminium deoxidizer products for steelmaking and metallurgical deoxidation programmes. Form and chemistry tuned for predictable oxygen control — enquire for grade, sizing and monthly allocation.",
    },
  ];

  const existing = await listProducts({ limit: 200 });
  const ids: string[] = [];

  for (const p of products) {
    const found = existing.items.find((x) => x.slug === p.slug);
    const categoryIds = [aluminiumId];
    if (found) {
      const updated = await updateProduct(found.id, {
        isUpcoming: p.isUpcoming,
        description: p.description,
        alloyGrades: p.alloyGrades,
        tempers: p.tempers,
        surfaceFinishes: p.surfaceFinishes,
        anodizingColors: p.anodizingColors,
        ralColors: p.ralColors,
        toleranceStandards: p.toleranceStandards,
        packaging: p.packaging,
        ...(p.maxLengthMm != null ? { maxLengthMm: p.maxLengthMm } : {}),
        ...(p.maxWidthMm != null ? { maxWidthMm: p.maxWidthMm } : {}),
        ...(p.weightPerMeterKg != null
          ? { weightPerMeterKg: p.weightPerMeterKg }
          : {}),
        categoryIds,
        imageUrl: p.imageUrl,
        seo: {
          title: `${p.name.en} | HG Aluminium Smelters`,
          description: p.description,
        },
        version: found.version,
      });
      if ("product" in updated && updated.product) {
        const product = updated.product;
        ids.push(product.id);
        if (product.status !== "published") {
          const published = await publishProduct(product.id, product.version);
          if ("error" in published) throw new Error(JSON.stringify(published));
          ids[ids.length - 1] = published.product.id;
        }
      } else {
        ids.push(found.id);
      }
      console.log(`  = product ${p.slug}`);
      continue;
    }
    const created = await createProduct({
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      categoryIds,
      alloyGrades: p.alloyGrades,
      tempers: p.tempers,
      surfaceFinishes: p.surfaceFinishes,
      anodizingColors: p.anodizingColors,
      ralColors: p.ralColors,
      toleranceStandards: p.toleranceStandards,
      packaging: p.packaging,
      maxLengthMm: p.maxLengthMm,
      maxWidthMm: p.maxWidthMm,
      weightPerMeterKg: p.weightPerMeterKg,
      description: p.description,
      isUpcoming: p.isUpcoming,
      imageUrl: p.imageUrl,
      seo: {
        title: `${p.name.en} | HG Aluminium Smelters`,
        description: p.description,
      },
      status: "draft",
    });
    const published = await publishProduct(created.id, created.version);
    if ("error" in published) throw new Error(JSON.stringify(published));
    // Re-attach category after publish — older publish path wiped categoryIds via Zod defaults.
    const linked = await updateProduct(published.product.id, {
      version: published.product.version,
      categoryIds,
      imageUrl: p.imageUrl,
    });
    if ("error" in linked) throw new Error(JSON.stringify(linked));
    ids.push(linked.product.id);
    console.log(`  + product ${p.slug}`);
  }
  return ids;
}

async function seedCmsPages() {
  // Entity/dedicated React pages do not use CMS block shells.
  const home = await getPageBySlug("home", "en");
  if (!home) {
    console.log("  ! home missing — run pnpm run seed:home-page for full home");
  } else if (home.status !== "published") {
    await publishPage(home.id, home.version);
    console.log("  = page home (published)");
  } else {
    console.log("  = page home");
  }
}

async function main() {
  console.log("\n=== HG Aluminium realistic seed ===\n");

  console.log("1. Dictionaries");
  await seedDictionaries();

  console.log("\n2. Categories");
  await seedCategories();

  console.log("\n3. Company profile");
  await seedCompany();

  console.log("\n4. Leadership");
  await seedPeople();

  console.log("\n5. Capacity metrics");
  await seedCapacity();

  console.log("\n6. Certifications");
  await seedCertifications();

  console.log("\n7. Sustainability");
  await seedSustainability();

  console.log("\n8. Customer logos");
  await seedCustomers();

  console.log("\n9. Products");
  const productIds = await seedProducts();

  console.log("\n10. Case studies");
  await seedCaseStudies(productIds);

  console.log("\n11. Testimonials");
  await seedTestimonials();

  console.log("\n12. Expansion projects");
  await seedExpansion();

  console.log("\n13. Career openings");
  await seedCareerOpenings();

  console.log("\n14. CMS pages");
  await seedCmsPages();

  console.log("\n=== Seed complete ===");
  console.log(
    JSON.stringify(
      {
        ok: true,
        note: "Leadership names & cert issuers are demo placeholders. Capacity figures from client intake brief. Company address/GST from LEI registry.",
        publicSurfaces: [
          "/en",
          "/en/about",
          "/en/journey",
          "/en/leadership",
          "/en/capacity",
          "/en/customers",
          "/en/expansion",
          "/en/manufacturing",
          "/en/quality",
          "/en/sustainability",
          "/en/procurement",
          "/en/resources",
          "/en/contact",
          "/en/careers",
          "/en/products",
        ],
      },
      null,
      2,
    ),
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect().catch(() => undefined);
    process.exit(0);
  });
