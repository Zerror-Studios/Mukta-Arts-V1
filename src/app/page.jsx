import { preload } from "react-dom";
import Hero from "@/components/home/Hero";
import VideoSection from "@/components/home/VideoSection";
import FilmsSection from "@/components/home/FilmsSection";
import { createPageMetadata } from "@/lib/seo";
import Elder from "@/components/home/Elder";
import SpiralScene from "@/components/home/SpiralScene";
import CardsShowcase from "@/components/home/CardsShowcase";
import StackedCards from "@/components/home/StackedCards";
import OldCamera from "@/components/home/OldCamera";
import { MODEL_URL, MODEL_ENV_URL } from "@/lib/homeIntro";
import FilmReel from "@/components/home/FilmReel";

const HomePage = () => {
  // Start fetching the hero model and its lighting with the HTML, not after the scripts load: the
  // intro waits for them
  preload(MODEL_URL, { as: "fetch", crossOrigin: "anonymous" });
  preload(MODEL_ENV_URL, { as: "fetch", crossOrigin: "anonymous" });

  return (
    <>
      <Hero />
      <VideoSection />
      <SpiralScene />
      <Elder />
      <OldCamera />
      {/* <FilmReel/> */}
      <CardsShowcase />


    </>
  );
};

export default HomePage;

export async function generateMetadata(_props, parent) {
  return createPageMetadata("/", await parent);
}
