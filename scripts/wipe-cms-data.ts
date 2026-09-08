/**
 * Wipe all CMS / catalog / corporate / jobs content (keeps AdminUser).
 * Usage: npx tsx scripts/wipe-cms-data.ts
 */
import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import { dbConnect } from "@/lib/db/connect";
import { Page } from "../src/modules/cms/repositories/mongo/page.model";
import { Redirect } from "../src/modules/cms/repositories/mongo/redirect.model";
import { PreviewToken } from "../src/modules/cms/repositories/mongo/preview-token.model";
import { Product } from "../src/modules/catalog/repositories/mongo/product.model";
import { Category } from "../src/modules/catalog/repositories/mongo/category.model";
import { Dictionary } from "../src/modules/catalog/repositories/mongo/dictionary.model";
import { Media } from "../src/modules/media/repositories/mongo/media.model";
import { CompanyProfile } from "../src/modules/corporate/repositories/mongo/company-profile.model";
import { Person } from "../src/modules/corporate/repositories/mongo/person.model";
import { CapacityMetric } from "../src/modules/corporate/repositories/mongo/capacity-metric.model";
import { Certification } from "../src/modules/corporate/repositories/mongo/certification.model";
import { SustainabilityMetric } from "../src/modules/corporate/repositories/mongo/sustainability-metric.model";
import { CustomerLogo } from "../src/modules/corporate/repositories/mongo/customer-logo.model";
import { CaseStudy } from "../src/modules/corporate/repositories/mongo/case-study.model";
import { Testimonial } from "../src/modules/corporate/repositories/mongo/testimonial.model";
import { ExpansionProject } from "../src/modules/corporate/repositories/mongo/expansion-project.model";
import { JobRun } from "../src/modules/jobs/repositories/mongo/job-run.model";
import { NavMenu } from "../src/modules/navigation/repositories/mongo/nav-menu.model";

async function main() {
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");

  const targets: Array<
    [string, { deleteMany: (f: object) => Promise<{ deletedCount?: number }> }]
  > = [
    ["pages", Page],
    ["redirects", Redirect],
    ["previewTokens", PreviewToken],
    ["products", Product],
    ["categories", Category],
    ["dictionaries", Dictionary],
    ["media", Media],
    ["company", CompanyProfile],
    ["people", Person],
    ["capacity", CapacityMetric],
    ["certifications", Certification],
    ["sustainability", SustainabilityMetric],
    ["customerLogos", CustomerLogo],
    ["caseStudies", CaseStudy],
    ["testimonials", Testimonial],
    ["expansion", ExpansionProject],
    ["jobRuns", JobRun],
    ["navMenus", NavMenu],
  ];

  for (const [name, model] of targets) {
    const res = await model.deleteMany({});
    console.log(`  wiped ${name}: ${res.deletedCount ?? 0}`);
  }
  console.log("Done (AdminUser preserved).");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
