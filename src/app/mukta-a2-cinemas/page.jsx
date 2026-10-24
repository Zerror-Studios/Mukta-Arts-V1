import HeroSecMa2 from "@/components/m-a2-cinemas/HeroSecMa2";
import WWStats from "@/components/whistling-woods/WWStatsOLD";
import PropertiesSection from "@/components/m-a2-cinemas/PropertiesSection";
import Stater from "@/components/whistling-woods/Stater";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/mukta-a2-cinemas.json";

const page = () => {
    return (
        <>
            <JsonLd data={pageSchema} />
            <HeroSecMa2 />
            {/* <WWStats /> */}
            <Stater />
            <PropertiesSection />
            {/* <WWMilestones /> */}
            {/* <WWAcademicPrograms />
            <PartnersSection />
            <WWlast /> */}
        </>
    );
};

export default page;

export const metadata = buildMetadata(PAGES.muktaA2Cinemas);
