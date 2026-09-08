import { redirect } from "next/navigation";

export default function LegacyLandingHeroRedirect() {
  redirect("/admin/pages/home/hero");
}
