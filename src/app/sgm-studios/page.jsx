import HeroSMG from "@/components/smg/HeroSMG";
import SGMIntro from "@/components/smg/SGMIntro";
import WWAcademicPrograms from "@/components/whistling-woods/WWAcademicPrograms";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/sgm-studios.json";

const SGMStudiosPage = () => {
    return (
        <>
            <JsonLd data={pageSchema} />
            <HeroSMG />
            <SGMIntro />
            <WWAcademicPrograms />
        </>
    );
};

export default SGMStudiosPage;

export const metadata = buildMetadata(PAGES.sgmStudios);
