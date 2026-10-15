import PartnersSection from "@/components/whistling-woods/PartnersSection";
import WWHERO from "@/components/whistling-woods/WWHERO";
import WWlast from "@/components/whistling-woods/WWlast";
import WWStats from "@/components/whistling-woods/WWStatsOLD";
import WWMilestones from "@/components/whistling-woods/WWMilestones";
import WWAcademicPrograms from "@/components/whistling-woods/WWAcademicPrograms";
import WWSchools from "@/components/whistling-woods/WWSchools";
import { createPageMetadata } from "@/lib/seo";

const page = () => {
    return (
        <>
            <WWHERO />
            {/* WWI intro and its six stats */}
            <WWStats />
            <WWMilestones />
            <WWSchools />
            <WWAcademicPrograms />
            {/* Student photos first, then where the alumni work (content doc order) */}
            <WWlast />
            <PartnersSection />
        </>
    );
};

export default page;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/whistling-woods", await parent);
}
