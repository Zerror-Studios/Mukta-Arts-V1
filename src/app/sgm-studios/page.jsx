import HeroSMG from "@/components/smg/HeroSMG";
import SGMIntro from "@/components/smg/SGMIntro";
import SGMShowreel from "@/components/smg/SGMShowreel";
import { createPageMetadata } from "@/lib/seo";

const page = () => {
    return (
        <>
            <HeroSMG />
            <SGMIntro />
            <SGMShowreel />
        </>
    );
};

export default page;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/sgm-studios", await parent);
}
