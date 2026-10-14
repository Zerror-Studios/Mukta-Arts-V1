import WorkHero from "@/components/workinprogress/WorkHero"
import WorkCarousel from "@/components/workinprogress/WorkCarousel"
import WorkVideo from "@/components/workinprogress/WorkVideo"
import BehindTheScenes from "@/components/workinprogress/BehindTheScenes"
import { createPageMetadata } from "@/lib/seo"

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

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/work-in-progress", await parent)
}

