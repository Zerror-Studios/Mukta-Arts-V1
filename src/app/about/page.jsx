import { createPageMetadata } from "@/lib/seo";
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
      <AboutHero />
      <MissionVision />
      <TeamMembers />
      <CareerMilestones />
      <InvestorRelations />
    </>
  );
};

export default AboutPage;

export async function generateMetadata(_props, parent) {
  return createPageMetadata("/about", await parent);
}
