import Hero from "@/components/home/Hero";
import VideoSection from "@/components/home/VideoSection";
import FilmsSection from "@/components/home/FilmsSection";
import { createPageMetadata } from "@/lib/seo";
import Elder from "@/components/home/Elder";
import SpiralScene from "@/components/home/SpiralScene";
import CardsShowcase from "@/components/home/CardsShowcase";
import StackedCards from "@/components/home/StackedCards";
import OldCamera from "@/components/home/OldCamera";

const HomePage = () => {
  return (
    <>
      <Hero />
      <VideoSection />

      <SpiralScene />

      <Elder />

      <OldCamera />

      <CardsShowcase />


    </>
  );
};

export default HomePage;

export async function generateMetadata(_props, parent) {
  return createPageMetadata("/", await parent);
}
