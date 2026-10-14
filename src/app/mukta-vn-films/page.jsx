import PartnersSection from "@/components/whistling-woods/PartnersSection";
import WWHERO from "@/components/whistling-woods/WWHERO";
import WWlast from "@/components/whistling-woods/WWlast";
import WWStats from "@/components/whistling-woods/WWStatsOLD";
import WWMilestones from "@/components/whistling-woods/WWMilestones";
import WWAcademicPrograms from "@/components/whistling-woods/WWAcademicPrograms";
import MNFILMS from "@/components/m-vn-films/MNFILMS";
import { createPageMetadata } from "@/lib/seo";

const page = () => {
    return (
        <>
            <MNFILMS />
            <WWStats />
            <WWMilestones />

            <div className="bg-[#f7f8f9]  text-black" >
                <div className="max-w-[90%]  pt-20 h-full flex flex-col mx-auto">

                    <div className="w-full h-fit ">
                        {/* Top Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start mb-16 shrink-0">
                            <h4 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight w-full md:w-1/2 leading-tight">
                                Academic Programs
                                <br />& Partnerships
                            </h4>
                            <p className="w-full md:w-[40%] text-base md:text-lg text-gray-600 mt-6 md:mt-0 leading-relaxed font-medium">
                                Industry-led programs and global partnerships equipping creative professionals with skills, knowledge, and opportunities to thrive in today's media landscape.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
            <WWAcademicPrograms />
            <PartnersSection />
            <WWlast />
        </>
    );
};

export default page;

export async function generateMetadata(_props, parent) {
    return createPageMetadata("/mukta-vn-films", await parent);
}
