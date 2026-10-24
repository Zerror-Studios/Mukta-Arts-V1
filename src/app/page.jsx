import { preload } from "react-dom";
import Hero from "@/components/home/Hero";
import VideoSection from "@/components/home/VideoSection";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/home.json";
import Elder from "@/components/home/Elder";
import SpiralScene from "@/components/home/SpiralScene";
import CardsShowcase from "@/components/home/CardsShowcase";
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
      <JsonLd data={pageSchema} />
      <Hero />
      <VideoSection />
      <SpiralScene />
      <Elder />
      <OldCamera />
      <FilmReel />

      <CardsShowcase />


    </>
  );
};

export default HomePage;

export const metadata = buildMetadata(PAGES.home);
