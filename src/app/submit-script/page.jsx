import SubmitScriptPage from "@/components/submit-script/SubmitScriptPage";
import LocationInfo from "@/components/submit-script/LocationInfo";
import { createPageMetadata } from "@/lib/seo";

const page = () => {
    return (
        <>
            <SubmitScriptPage />
            <LocationInfo />
        </>
    );
};

export default page;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/submit-script", await parent);
}
