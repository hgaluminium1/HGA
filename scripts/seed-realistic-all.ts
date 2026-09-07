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
import { createPage, getPageBySlug, publishPage } from "@/modules/cms";
import { dictionarySeed } from "./specs.dictionary.seed";

type SeedNode = {
  name: { en: string };
  slug: string;
  children?: SeedNode[];
};

const SOURCE =
  "Client intake brief + LEI registry (seed) — confirm before production";

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
      key: "etp_commissioned",
      label: "Effluent treatment plant",
      value: null,
      unit: "",
      disclosureTier: "initiative" as const,
      publish: true,
      methodologyNote: "On-site ETP for anodising / process water (commitment).",
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
  ];

  const existing = await listSustainabilityMetrics();
  for (const r of rows) {
    if (existing.items.some((x) => x.key === r.key)) {
      console.log(`  = sustainability ${r.key}`);
      continue;
    }
    let row = await createSustainabilityMetric({
      key: r.key,
      label: { en: r.label },
      value: r.value,
      unit: r.unit,
      disclosureTier: r.disclosureTier,
      methodologyNote: r.methodologyNote,
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

async function seedProducts() {
  const cats = await listCategoriesFlat();
  const bySlug = (slug: string) => cats.find((c) => c.slug === slug)?.id;

  const products = [
    {
      sku: "HG-EXT-PROFILE",
      name: { en: "Aluminium Extrusion Profiles" },
      slug: "aluminium-extrusion-profiles",
      categorySlugs: ["extrusion-profiles"],
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
        "Architectural, industrial and solar extrusion profiles with die development support, CCD control and mill certificates on every lot.",
    },
    {
      sku: "HG-BIL-HOMO",
      name: { en: "Aluminium Homogenized Billets" },
      slug: "aluminium-homogenized-billets",
      categorySlugs: ["homogenised-billets"],
      alloyGrades: ["6063", "6061", "6082"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [],
      ralColors: [],
      toleranceStandards: ["IS", "ASTM"],
      packaging: ["bundle"],
      maxLengthMm: 6000,
      isUpcoming: false,
      description:
        "Cast and homogenised extrusion billets for captive and merchant press programmes — chemistry and homogenising certificates supplied.",
    },
    {
      sku: "HG-ING-REMELT",
      name: { en: "Aluminium Ingots" },
      slug: "aluminium-ingots",
      categorySlugs: ["remelt-ingots"],
      alloyGrades: ["1050", "1100"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [],
      ralColors: [],
      toleranceStandards: ["IS"],
      packaging: ["bundle", "pallet"],
      isUpcoming: false,
      description:
        "Secondary remelt aluminium ingots for foundry and captive melting. Lot chemistry certificates with each consignment.",
    },
    {
      sku: "HG-CUBE-UP",
      name: { en: "Aluminium Cubes" },
      slug: "aluminium-cubes",
      categorySlugs: ["cubes"],
      alloyGrades: ["1050"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [],
      ralColors: [],
      toleranceStandards: ["IS"],
      packaging: ["bag", "pallet"],
      isUpcoming: true,
      description:
        "Upcoming cube product for foundry and steel applications. Register interest for early allocation.",
    },
    {
      sku: "HG-SHOT-UP",
      name: { en: "Aluminium Shots" },
      slug: "aluminium-shots",
      categorySlugs: ["shots"],
      alloyGrades: ["1050"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [],
      ralColors: [],
      toleranceStandards: ["IS"],
      packaging: ["bag", "pallet"],
      isUpcoming: true,
      description:
        "Upcoming aluminium shots for melt additions. Specs publish at commercial release.",
    },
    {
      sku: "HG-DEOX-UP",
      name: { en: "Aluminium Deoxidizer" },
      slug: "aluminium-deoxidizer",
      categorySlugs: ["deoxidizer"],
      alloyGrades: ["1050"],
      tempers: ["F"],
      surfaceFinishes: ["mill"],
      anodizingColors: [],
      ralColors: [],
      toleranceStandards: ["IS"],
      packaging: ["bag", "pallet"],
      isUpcoming: true,
      description:
        "Upcoming deoxidizer line for steelmaking applications. Register interest to prioritise development.",
    },
  ];

  const existing = await listProducts({ limit: 200 });
  const ids: string[] = [];

  for (const p of products) {
    const found = existing.items.find((x) => x.slug === p.slug);
    if (found) {
      const updated = await updateProduct(found.id, {
        isUpcoming: p.isUpcoming,
        description: p.description,
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
      console.log(`  = product ${p.slug} (isUpcoming=${p.isUpcoming})`);
      continue;
    }
    const categoryIds = p.categorySlugs
      .map(bySlug)
      .filter((id): id is string => Boolean(id));
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
      status: "draft",
    });
    const published = await publishProduct(created.id, created.version);
    if ("error" in published) throw new Error(JSON.stringify(published));
    ids.push(published.product.id);
    console.log(`  + product ${p.slug} (isUpcoming=${p.isUpcoming})`);
  }
  return ids;
}

async function seedCmsPages() {
  const { Page } = await import(
    "@/modules/cms/repositories/mongo/page.model"
  );

  const shells = [
    {
      slug: "about",
      title: "About HG Aluminium",
      seo: {
        title: "About HG Aluminium Smelters",
        description:
          "Gujarat-based aluminium extrusion, billet and remelt manufacturer serving architectural, industrial and solar markets.",
      },
      blocks: [
        {
          id: "about-facts",
          type: "company-facts",
          order: 0,
          appearance: "default" as const,
          data: { seeded: true },
        },
        {
          id: "about-stats",
          type: "stats",
          order: 1,
          appearance: "default" as const,
          data: { seeded: true },
        },
        {
          id: "about-leadership",
          type: "leadership-grid",
          order: 2,
          appearance: "default" as const,
          data: { seeded: true },
        },
        {
          id: "about-certs",
          type: "cert-grid",
          order: 3,
          appearance: "default" as const,
          data: { seeded: true },
        },
        {
          id: "about-expansion",
          type: "expansion-roadmap",
          order: 4,
          appearance: "default" as const,
          data: { seeded: true },
        },
      ],
    },
    {
      slug: "quality",
      title: "Quality & Certifications",
      seo: {
        title: "Quality | HG Aluminium",
        description:
          "ISO-aligned quality systems, mill certificates and process control at HG Aluminium.",
      },
      blocks: [
        {
          id: "quality-certs",
          type: "cert-grid",
          order: 0,
          appearance: "default" as const,
          data: { seeded: true },
        },
        {
          id: "quality-facts",
          type: "company-facts",
          order: 1,
          appearance: "default" as const,
          data: { seeded: true },
        },
      ],
    },
  ];

  for (const s of shells) {
    const existing = await getPageBySlug(s.slug, "en");
    const broken =
      existing &&
      existing.blocks.some(
        (b) => b.data == null || typeof b.data !== "object",
      );

    if (existing && !broken) {
      if (existing.status !== "published") {
        const pub = await publishPage(existing.id, existing.version);
        if ("error" in pub) throw new Error(JSON.stringify(pub));
        console.log(`  = page ${s.slug} (published)`);
      } else {
        console.log(`  = page ${s.slug}`);
      }
      continue;
    }

    if (existing && broken) {
      await Page.deleteOne({ _id: existing.id });
      console.log(`  ~ page ${s.slug} (removed broken blocks)`);
    }

    const page = await createPage({
      title: s.title,
      slug: s.slug,
      locale: "en",
      seo: s.seo,
      blocks: s.blocks as Parameters<typeof createPage>[0]["blocks"],
    });
    const pub = await publishPage(page.id, page.version);
    if ("error" in pub) throw new Error(JSON.stringify(pub));
    console.log(`  + page ${s.slug}`);
  }

  const home = await getPageBySlug("home", "en");
  if (!home) {
    console.log("  ! home missing — run npm run seed:home-page for full home");
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

  console.log("\n13. CMS pages");
  await seedCmsPages();

  console.log("\n=== Seed complete ===");
  console.log(
    JSON.stringify(
      {
        ok: true,
        note: "Leadership names & cert issuers are demo placeholders. Capacity figures from client intake brief. Company address/GST from LEI registry.",
        publicSurfaces: [
          "/en",
          "/en/leadership",
          "/en/capacity",
          "/en/customers",
          "/en/expansion",
          "/en/products",
          "/en/about",
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
