import HeroSMG from "@/components/smg/HeroSMG";
import SGMIntro from "@/components/smg/SGMIntro";
import WWAcademicPrograms from "@/components/whistling-woods/WWAcademicPrograms";
import { createPageMetadata } from "@/lib/seo";

const SGMStudiosPage = () => {
    return (
        <>
            <HeroSMG />
            <SGMIntro />
            <WWAcademicPrograms />
        </>
    );
};

export default SGMStudiosPage;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/sgm-studios", await parent);
}
