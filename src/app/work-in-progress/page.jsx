import WorkHero from "@/components/workinprogress/WorkHero"
import WorkCarousel from "@/components/workinprogress/WorkCarousel"
import WorkVideo from "@/components/workinprogress/WorkVideo"
import BehindTheScenes from "@/components/workinprogress/BehindTheScenes"
import { noindexMetadata } from "@/lib/seo/metadata";

const page = () => {
    return (
        <main>
            <WorkHero />
            {/* <WorkCarousel /> */}
            {/* <WorkVideo /> */}
            {/* <BehindTheScenes /> */}
        </main>
    )
}

export default page

export const metadata = noindexMetadata("Our Films");

