import { redirect } from "next/navigation";

export default function LegacyLandingRedirect() {
  redirect("/admin/pages/home");
}
