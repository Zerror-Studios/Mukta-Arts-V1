import SubmitScriptPage from "@/components/submit-script/SubmitScriptPage";
import LocationInfo from "@/components/submit-script/LocationInfo";
import { createPageMetadata } from "@/lib/seo";

const page = () => {
    return (
        <>
            {/* Large files go through Vercel Blob when a store is connected, otherwise straight to the API route */}
            <SubmitScriptPage blobUploads={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
            <LocationInfo />
        </>
    );
};

export default page;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/submit-script", await parent);
}
