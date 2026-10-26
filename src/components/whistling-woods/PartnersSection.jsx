"use client";

import React, { useRef } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

// Trimmed WebP logos (max 400x160); companies without a `logo` fall back to their name
const LOGOS = "/img/alumni-logos/";

export default function AlumniWorkSection() {
    const sectionRef = useRef(null);

    // Heading word by word, then each marquee row rises in, as the section enters
    useScrollReveal(sectionRef);

    // Extracted companies grouped into 3 rows for a dense, visually appealing layout
    const row1 = [
        { id: 1, name: "Disney India", logo: "disney-india.webp" },
        { id: 2, name: "aidem", logo: "aidem.webp" },
        { id: 3, name: "Anurag Kashyap Films", logo: "anurag-kashyap-films.webp" },
        { id: 4, name: "Fountainhead MKTG" },
        // { id: 5, name: "Myntra", logo: "myntra.webp" },
        { id: 6, name: "NDTV Good Times" },
        { id: 7, name: "Seventyseven", logo: "seventyseven.webp" },
        { id: 8, name: "Film Companion", logo: "film-companion.webp" },
        { id: 9, name: "DreamWorks", logo: "dreamworks.webp" },
        { id: 10, name: "LINOPINION gh" },
        { id: 11, name: "NDTV", logo: "ndtv.webp" },
        { id: 12, name: "LinkedIn", logo: "linkedin.webp" },
        { id: 13, name: "Dharma Productions", logo: "dharma-productions.webp" },
        { id: 14, name: "The Digital Street" },
        { id: 15, name: "Balaji Telefilms", logo: "balaji-telefilms.webp" },
        { id: 16, name: "Banijay Asia", logo: "banijay.webp" },
        { id: 17, name: "CAA KWAN" },
    ];

    const row2 = [
        { id: 18, name: "Excel Entertainment", logo: "excel-entertainment.webp" },
        { id: 19, name: "FCB ULKA", logo: "fcb.webp" },
        { id: 20, name: "FICCI", logo: "ficci.webp" },
        { id: 21, name: "DNEG", logo: "dneg.webp" },
        { id: 22, name: "ENCOMPASS" },
        { id: 23, name: "Endemol", logo: "endemol.webp" },
        { id: 24, name: "EPIC", logo: "epic.webp" },
        { id: 25, name: "Genesis Burson-Marsteller" },
        { id: 26, name: "Google", logo: "google.webp" },
        { id: 27, name: "GroupM", logo: "groupm.webp" },
        // { id: 28, name: "Indian Oil", logo: "indian-oil.webp" },
        { id: 29, name: "Industrial Light & Magic", logo: "ilm.webp" },
        { id: 30, name: "Jio Studios", logo: "jio-studios.webp" },
        { id: 31, name: "Wunderman JWT", logo: "wunderman-thompson.webp" },
        { id: 32, name: "Little Red Car", logo: "little-red-car.webp" },
        { id: 33, name: "Jio Digital Life", logo: "jio.webp" },
        { id: 34, name: "MAMI", logo: "mami.webp" },
    ];

    const row3 = [
        { id: 35, name: "Madison" },
        { id: 36, name: "McCann Worldgroup", logo: "mccann-worldgroup.webp" },
        { id: 37, name: "MSLGROUP", logo: "msl.webp" },
        { id: 38, name: "Mukta A2 Cinemas", logo: "mukta-a2-cinemas.webp" },
        { id: 39, name: "Nadiadwala Grandson", logo: "nadiadwala-grandson.webp" },
        { id: 40, name: "Ogilvy", logo: "ogilvy.webp" },
        { id: 41, name: "Prime Focus", logo: "prime-focus.webp" },
        { id: 42, name: "PVR Cinemas", logo: "pvr-inox.webp" },
        { id: 43, name: "Red Chillies Entertainment", logo: "red-chillies.webp" },
        { id: 44, name: "Rediffusion - Y&R", logo: "rediffusion.webp" },
        { id: 45, name: "Republic", logo: "republic.webp" },
        { id: 46, name: "Social Kinnect" },
        { id: 47, name: "OML", logo: "oml.webp" },
        { id: 48, name: "Universal", logo: "universal.webp" },
        { id: 49, name: "Weber Shandwick", logo: "weber-shandwick.webp" },
        { id: 50, name: "Weta Digital", logo: "weta.webp" },
        { id: 51, name: "Yash Raj Films", logo: "yash-raj-films.webp" },
        { id: 52, name: "YouTube", logo: "youtube.webp" },
    ];

    // Helper to render a continuous block of company cards
    const renderCards = (companies, blockKey) =>
        [...companies, ...companies].map((company, index) => (
            <div
                key={`${blockKey}-${company.id}-${index}`}
                className="bg-white border border-gray-200/80 w-[160px] h-[76px] md:w-[220px] md:h-[100px] flex items-center justify-center shrink-0 shadow-sm rounded-lg mx-2 md:mx-3 hover:shadow-md transition-shadow duration-300"
            >
                {company.logo ? (
                    <img
                        src={LOGOS + company.logo}
                        // The second copy only exists for the seamless loop, so screen readers skip it
                        alt={index < companies.length ? `${company.name} logo` : ""}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="max-w-[120px] max-h-[44px] md:max-w-[160px] md:max-h-[60px] object-contain"
                    />
                ) : (
                    <span className="font-bold text-gray-700 text-center text-xs md:text-sm px-2 tracking-wide uppercase">
                        {company.name}
                    </span>
                )}
            </div>
        ));

    return (
        <section
            ref={sectionRef}
            className="w-full h-fit bg-[#f8f9fa] py-16 md:py-24 px-0 flex flex-col items-center justify-center font-sans overflow-hidden"
        >
            <div className="w-full">
                {/* Heading */}
                <h4 data-reveal="words" className="heading text-[32px] md:text-[42px] font-semibold text-center text-[#111] mb-10 md:mb-16 tracking-tight px-6">
                    Where Our Alumni Work
                </h4>

                {/* Marquee Animations */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        @keyframes marquee-reverse {
                            0% { transform: translateX(-50%); }
                            100% { transform: translateX(0); }
                        }
                        .animate-marquee {
                            animation: marquee 40s linear infinite;
                            will-change: transform;
                        }
                        .animate-marquee-reverse {
                            animation: marquee-reverse 45s linear infinite;
                            will-change: transform;
                        }
                        .marquee-container:hover .animate-marquee,
                        .marquee-container:hover .animate-marquee-reverse {
                            animation-play-state: paused;
                        }
                        @media (prefers-reduced-motion: reduce) {
                            .animate-marquee, .animate-marquee-reverse {
                                animation: none;
                            }
                        }
                    `
                }} />

                {/* Row 1 - Moves Left */}
                <div data-reveal="rise" className="marquee-container w-full relative mb-4 md:mb-6">
                    <div className="animate-marquee flex w-max">
                        <div className="flex">
                            {renderCards(row1, "r1b1")}
                        </div>
                    </div>
                </div>

                {/* Row 2 - Moves Right (Reverse) */}
                <div data-reveal="rise" className="marquee-container w-full relative mb-4 md:mb-6">
                    <div className="animate-marquee-reverse flex w-max">
                        <div className="flex">
                            {renderCards(row2, "r2b1")}
                        </div>
                    </div>
                </div>

                {/* Row 3 - Moves Left */}
                <div data-reveal="rise" className="marquee-container w-full relative mb-8 md:mb-12">
                    <div className="animate-marquee flex w-max" style={{ animationDuration: '45s' }}>
                        <div className="flex">
                            {renderCards(row3, "r3b1")}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}