import MNFILMS from "@/components/m-vn-films/MNFILMS";
import { createPageMetadata } from "@/lib/seo";

// Mukta VN Films, its own page under The Ecosystem: hero and highlights
const page = () => {
    return <MNFILMS />;
};

export default page;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/mukta-vn-films", await parent);
}
