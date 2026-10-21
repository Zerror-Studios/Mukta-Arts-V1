import HeroSMG from "@/components/smg/HeroSMG";
import SGMIntro from "@/components/smg/SGMIntro";
import SGMShowreel from "@/components/smg/SGMShowreel";
import WWAcademicPrograms from "@/components/whistling-woods/WWAcademicPrograms";
import { createPageMetadata } from "@/lib/seo";

const page = () => {
    return (
        <>
            <HeroSMG />
            <SGMIntro />
            {/* <SGMShowreel /> */}
            <WWAcademicPrograms/>
        </>
    );
};

export default page;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/sgm-studios", await parent);
}
