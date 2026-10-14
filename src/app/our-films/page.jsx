import FilmsComponent from "@/components/our-film/FilmsComponent";
import OFHero from "@/components/our-film/OFHero";
import CustomNum from "@/components/whistling-woods/CustomNum";
import WWStats from "@/components/whistling-woods/WWStatsOLD";
import { createPageMetadata } from "@/lib/seo";

const page = () => {
    return (
        <>
            <OFHero />
            {/* <WWStats /> */}
            <CustomNum />
            <FilmsComponent />
        </>
    );
};

export default page;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/our-films", await parent);
}
