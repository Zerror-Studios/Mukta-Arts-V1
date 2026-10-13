import HeroSecMa2 from "@/components/m-a2-cinemas/HeroSecMa2";
import WWStats from "@/components/whistling-woods/WWStats";
import PropertiesSection from "@/components/m-a2-cinemas/PropertiesSection";
import Stater from "@/components/whistling-woods/Stater";

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