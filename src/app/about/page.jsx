import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/about.json";
import AboutHero from "@/components/about/AboutHero";
import MissionVision from "@/components/about/MissionVision";
import TeamMembers from "@/components/about/TeamMembers";
import InvestorRelations from "@/components/about/InvestorRelations";
import CareerMilestones from "@/components/subhash-ghai/CareerMilestones";
import { getInvestorRelations } from "@/sanity/lib/queries";

// Rendered on every request so Investor Relations edits in the studio show on the next reload
export const dynamic = "force-dynamic";

// Hero, intro and stats, Board of Directors, Milestones & Films, Investor Relations.
// Every section is light, so nothing blue sits against the blue footer.
const AboutPage = async () => {
  const { categories, page } = await getInvestorRelations();

  return (
    <>
      <JsonLd data={pageSchema} />
      <AboutHero />
      <MissionVision />
      <TeamMembers />
      <CareerMilestones />
      <InvestorRelations
        categories={categories}
        contact={page?.contact}
        unclaimedDividend={page?.unclaimedDividend}
      />
    </>
  );
};

export default AboutPage;

export const metadata = buildMetadata(PAGES.about);
