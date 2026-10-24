import SubmitScriptPage from "@/components/submit-script/SubmitScriptPage";
import LocationInfo from "@/components/submit-script/LocationInfo";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/submit-script.json";

const page = () => {
    return (
        <>
            <JsonLd data={pageSchema} />
            {/* Large files go through Vercel Blob when a store is connected, otherwise straight to the API route */}
            <SubmitScriptPage blobUploads={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
            <LocationInfo />
        </>
    );
};

export default page;

export const metadata = buildMetadata(PAGES.submitScript);
