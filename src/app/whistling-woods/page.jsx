import PartnersSection from "@/components/whistling-woods/PartnersSection";
import WWHERO from "@/components/whistling-woods/WWHERO";
import WWlast from "@/components/whistling-woods/WWlast";
import WWStats from "@/components/whistling-woods/WWStats";
import WWMilestones from "@/components/whistling-woods/WWMilestones";
import WWAcademicPrograms from "@/components/whistling-woods/WWAcademicPrograms";
import WWSchools from "@/components/whistling-woods/WWSchools";

const page = () => {
    return (
        <>
            <WWHERO />
            <WWStats />
            <WWMilestones />
            <WWSchools />
            <WWAcademicPrograms />
            <PartnersSection />
            <WWlast />
        </>
    );
};

export default page;