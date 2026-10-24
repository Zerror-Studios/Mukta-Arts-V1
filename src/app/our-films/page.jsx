import FilmsComponent from "@/components/our-film/FilmsComponent";
import OFHero from "@/components/our-film/OFHero";
import CustomNum from "@/components/whistling-woods/CustomNum";
import WWStats from "@/components/whistling-woods/WWStatsOLD";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/our-films.json";

const page = () => {
    return (
        <>
            <JsonLd data={pageSchema} />
            <OFHero />
            {/* <WWStats /> */}
            <CustomNum />
            <FilmsComponent />
        </>
    );
};

export default page;

export const metadata = buildMetadata(PAGES.ourFilms);
