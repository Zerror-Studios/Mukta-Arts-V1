import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/about.json";
import AboutHero from "@/components/about/AboutHero";
import MissionVision from "@/components/about/MissionVision";
import TeamMembers from "@/components/about/TeamMembers";
import InvestorRelations from "@/components/about/InvestorRelations";
import CareerMilestones from "@/components/subhash-ghai/CareerMilestones";

// Hero, intro and stats, Board of Directors, Milestones & Films, Investor Relations.
// Every section is light, so nothing blue sits against the blue footer.
const AboutPage = () => {
  return (
    <>
      <JsonLd data={pageSchema} />
      <AboutHero />
      <MissionVision />
      <TeamMembers />
      <CareerMilestones />
      <InvestorRelations />
    </>
  );
};

export default AboutPage;

export const metadata = buildMetadata(PAGES.about);
