import { notFound } from "next/navigation";
import FilmHero from "@/components/our-film/FilmHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { getFilm } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

// Rendered on every request so edits in the studio show on the next reload
export const dynamic = "force-dynamic";

const page = async ({ params }) => {
    const { slug } = await params;
    const film = await getFilm(slug);
    if (!film) notFound();

    return (
        <main>
            <FilmHero
                title={film.title}
                year={film.year}
                description={film.description || ""}
                image={urlFor(film.poster).width(1200).height(1500).fit("crop").url()}
            />
        </main>
    );
};

export default page;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const film = await getFilm(slug);
    if (!film) return {};

    const title = `${film.title} (${film.year}) | Mukta Arts Films`;
    const description =
        film.description?.replace(/\s+/g, " ").trim().slice(0, 160) ||
        `${film.title}, released in ${film.year}, from the house of Mukta Arts and Subhash Ghai.`;

    const metadata = buildMetadata({ path: `/our-films/${slug}`, title, description, ogTitle: title, ogDescription: description });
    // Share the film's own poster rather than the site-wide card
    const poster = urlFor(film.poster).width(1200).height(630).fit("crop").url();
    metadata.openGraph.images = [{ url: poster, width: 1200, height: 630, alt: film.title }];
    metadata.twitter.images = [poster];
    return metadata;
}
