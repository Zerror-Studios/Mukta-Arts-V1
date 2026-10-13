import HeroSG from "@/components/subhash-ghai/HeroSG";
import StorySG from "@/components/subhash-ghai/StorySG";
import CareerMilestones from "@/components/subhash-ghai/CareerMilestones";
import FilmsSection from "@/components/home/FilmsSection";
import AwardsSG from "@/components/subhash-ghai/AwardsSG";
import FilmLegacy from "@/components/about/FilmLegacy";

const page = () => {
    return (
        <>
            <HeroSG />
            <StorySG />
            {/* <CareerMilestones /> */}
            <FilmLegacy />
            {/* <FilmsSection /> */}
            <AwardsSG />
        </>
    );
};

export default page;