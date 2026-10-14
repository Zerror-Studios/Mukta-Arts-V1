import HeroSecMa2 from "@/components/m-a2-cinemas/HeroSecMa2";
import WWStats from "@/components/whistling-woods/WWStatsOLD";
import PropertiesSection from "@/components/m-a2-cinemas/PropertiesSection";
import Stater from "@/components/whistling-woods/Stater";
import { createPageMetadata } from "@/lib/seo";

const page = () => {
    return (
        <>
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

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/mukta-a2-cinemas", await parent);
}
