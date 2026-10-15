"use client";

import React, { useRef } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

export default function AlumniWorkSection() {
    const sectionRef = useRef(null);

    // Heading word by word, then each marquee row rises in, as the section enters
    useScrollReveal(sectionRef);

    // Extracted companies grouped into 3 rows for a dense, visually appealing layout
    const row1 = [
        { id: 1, name: "Disney India" },
        { id: 2, name: "aidem" },
        { id: 3, name: "Anurag Kashyap Films" },
        { id: 4, name: "Fountainhead MKTG" },
        { id: 5, name: "Myntra" },
        { id: 6, name: "NDTV Good Times" },
        { id: 7, name: "Seventyseven" },
        { id: 8, name: "Film Companion" },
        { id: 9, name: "DreamWorks" },
        { id: 10, name: "LINOPINION gh" },
        { id: 11, name: "NDTV" },
        { id: 12, name: "LinkedIn" },
        { id: 13, name: "Dharma Productions" },
        { id: 14, name: "The Digital Street" },
        { id: 15, name: "Balaji Telefilms" },
        { id: 16, name: "Banijay Asia" },
        { id: 17, name: "CAA KWAN" },
    ];

    const row2 = [
        { id: 18, name: "Excel Entertainment" },
        { id: 19, name: "FCB ULKA" },
        { id: 20, name: "FICCI" },
        { id: 21, name: "DNEG" },
        { id: 22, name: "ENCOMPASS" },
        { id: 23, name: "Endemol" },
        { id: 24, name: "EPIC" },
        { id: 25, name: "Genesis Burson-Marsteller" },
        { id: 26, name: "Google" },
        { id: 27, name: "GroupM" },
        { id: 28, name: "Indian Oil" },
        { id: 29, name: "Industrial Light & Magic" },
        { id: 30, name: "Jio Studios" },
        { id: 31, name: "Wunderman JWT" },
        { id: 32, name: "Little Red Car" },
        { id: 33, name: "Jio Digital Life" },
        { id: 34, name: "MAMI" },
    ];

    const row3 = [
        { id: 35, name: "Madison" },
        { id: 36, name: "McCann Worldgroup" },
        { id: 37, name: "MSLGROUP" },
        { id: 38, name: "Mukta A2 Cinemas" },
        { id: 39, name: "Nadiadwala Grandson" },
        { id: 40, name: "Ogilvy" },
        { id: 41, name: "Prime Focus" },
        { id: 42, name: "PVR Cinemas" },
        { id: 43, name: "Red Chillies Entertainment" },
        { id: 44, name: "Rediffusion - Y&R" },
        { id: 45, name: "Republic" },
        { id: 46, name: "Social Kinnect" },
        { id: 47, name: "OML" },
        { id: 48, name: "Universal" },
        { id: 49, name: "Weber Shandwick" },
        { id: 50, name: "Weta Digital" },
        { id: 51, name: "Yash Raj Films" },
        { id: 52, name: "YouTube" },
    ];

    // Helper to render a continuous block of company cards
    const renderCards = (companies, blockKey) =>
        [...companies, ...companies].map((company, index) => (
            <div
                key={`${blockKey}-${company.id}-${index}`}
                className="bg-white border border-gray-200/80 w-[160px] h-[76px] md:w-[220px] md:h-[100px] flex items-center justify-center shrink-0 shadow-sm rounded-lg mx-2 md:mx-3 hover:shadow-md transition-shadow duration-300"
            >
                {/* 
                  When you have the actual image files, uncomment the <img> tag below 
                  and format your image paths appropriately. 
                */}

                {/* <img 
                    src={`/logos/${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`} 
                    alt={`${company.name} logo`} 
                    className="max-w-[160px] max-h-[60px] object-contain"
                /> */}

                {/* Fallback Text Styling (Remove this once images are applied) */}
                <span className="font-bold text-gray-700 text-center text-xs md:text-sm px-2 tracking-wide uppercase">
                    {company.name}
                </span>
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