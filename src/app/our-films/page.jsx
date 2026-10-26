import FilmsComponent from "@/components/our-film/FilmsComponent";
import OFHero from "@/components/our-film/OFHero";
import CustomNum from "@/components/whistling-woods/CustomNum";
import WWStats from "@/components/whistling-woods/WWStatsOLD";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, PAGES } from "@/lib/seo/metadata";
import pageSchema from "@/lib/seo/schema/our-films.json";
import { getFilms } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

// Rendered on every request so films added or edited in the studio show on the next reload
export const dynamic = "force-dynamic";

const page = async () => {
    const films = (await getFilms()).map((film) => ({
        slug: film.slug,
        title: film.title,
        year: film.year,
        // 4:5 like the grid card, cropped around the hotspot set in the studio
        image: urlFor(film.poster).width(900).height(1125).fit("crop").url(),
    }));

    return (
        <>
            <JsonLd data={pageSchema} />
            <OFHero />
            {/* <WWStats /> */}
            <CustomNum />
            <FilmsComponent films={films} />
        </>
    );
};

export default page;

export const metadata = buildMetadata(PAGES.ourFilms);
