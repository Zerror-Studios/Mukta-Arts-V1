import PartnersSection from "@/components/whistling-woods/PartnersSection";
import WWHERO from "@/components/whistling-woods/WWHERO";
import WWlast from "@/components/whistling-woods/WWlast";

import WWMilestones from "@/components/whistling-woods/WWMilestones";
import WWAcademicPrograms from "@/components/whistling-woods/WWAcademicPrograms";
import WWSchools from "@/components/whistling-woods/WWSchools";
import Stater from "@/components/whistling-woods/Stater";

const page = () => {
    return (
        <>
            <WWHERO />
            {/* <WWStats /> */}
            <Stater />
            <WWMilestones />
            <WWSchools />
            <WWAcademicPrograms />
            <PartnersSection />
            <WWlast />
        </>
    );
};

export default page;