import PartnersSection from "@/components/whistling-woods/PartnersSection";
import WWHERO from "@/components/whistling-woods/WWHERO";
import WWlast from "@/components/whistling-woods/WWlast";
import WWStats from "@/components/whistling-woods/WWStatsOLD";
import WWMilestones from "@/components/whistling-woods/WWMilestones";
import WWQuotes from "@/components/whistling-woods/WWQuotes";
import WWSchools from "@/components/whistling-woods/WWSchools";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/whistling-woods.json";

const page = () => {
    return (
        <>
            <JsonLd data={pageSchema} />
            <WWHERO />
            {/* WWI intro and its six stats */}
            <WWStats />
            <WWQuotes />
            
            <WWSchools />
            {/* Industry quotes, in place of the old academic programs section */}
            {/* Student photos first, then where the alumni work (content doc order) */}
            <WWlast />
            <WWMilestones />
            <PartnersSection />
        </>
    );
};

export default page;

export const metadata = buildMetadata(PAGES.whistlingWoods);
