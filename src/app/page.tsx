import { LandingPage } from "@/components/landing-page";
import { fetchLandingTopTeams } from "@/lib/landing/fetch-top-teams";

export default async function Page() {
  const topTeams = await fetchLandingTopTeams();

  return <LandingPage topTeams={topTeams} />;
}
