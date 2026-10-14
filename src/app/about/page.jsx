import { createPageMetadata } from "@/lib/seo";
import AboutHero from "@/components/about/AboutHero";
import MissionVision from "@/components/about/MissionVision";
import AboutEcosystem from "@/components/about/AboutEcosystem";
import BoardOfDirectors from "@/components/about/BoardOfDirectors";
import TeamMembers from "@/components/about/TeamMembers";
import InvestorRelations from "@/components/about/InvestorRelations";
import FilmLegacy from "@/components/about/FilmLegacy";
import FilmsSection from "@/components/home/FilmsSection";
import CareerMilestones from "@/components/subhash-ghai/CareerMilestones";

const AboutPage = () => {
  return (
    <>
      <AboutHero />
      <MissionVision />
      {/* <FilmLegacy /> */}
      <CareerMilestones />
      {/* <AboutEcosystem /> */}
      {/* <BoardOfDirectors /> */}
      <TeamMembers />
      {/* <InvestorRelations /> */}
    </>
  );
};

export default AboutPage;

export async function generateMetadata(_props, parent) {
  return createPageMetadata("/about", await parent);
}
