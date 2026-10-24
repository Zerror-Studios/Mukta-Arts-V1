import HeroSG from "@/components/subhash-ghai/HeroSG";
import StorySG from "@/components/subhash-ghai/StorySG";
import CareerMilestones from "@/components/subhash-ghai/CareerMilestones";
import FilmsSection from "@/components/home/FilmsSection";
import AwardsSG from "@/components/subhash-ghai/AwardsSG";
import FilmLegacy from "@/components/about/FilmLegacy";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/subhash-ghai.json";

const page = () => {
    return (
        <>
            <JsonLd data={pageSchema} />
            <HeroSG />
            <StorySG />
            {/* <CareerMilestones /> */}
            <FilmLegacy />
            {/* <FilmsSection /> */}
            <AwardsSG />
        </>
    );
};

export default page;

export const metadata = buildMetadata(PAGES.subhashGhai);
