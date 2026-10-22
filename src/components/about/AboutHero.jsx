"use client";

import { useRef } from "react";
import Image from "next/image";
import useEntrance from "@/hooks/useEntrance";
import useInfiniteDragSlider from "@/hooks/useInfiniteDragSlider";

const carouselItems = [
    { src: "/img/final/about_Img/AB1/SG_0024_1_11zon_1_11zon.webp" },
    { src: "/img/final/about_Img/AB1/SG_0063_2_11zon_2_11zon.webp" },
    { src: "/img/final/about_Img/AB1/SG_0068_3_11zon_3_11zon.webp" },
    { src: "/img/final/about_Img/AB1/SG_0113_4_11zon_4_11zon.webp" },
    { src: "/img/final/about_Img/AB1/SG_0117_5_11zon_5_11zon.webp" },
    { src: "/img/final/about_Img/AB1/SG_0123_6_11zon_6_11zon.webp" },
    { src: "/img/final/about_Img/AB1/SG_0125_7_11zon_7_11zon.webp" },
    { src: "/img/final/about_Img/AB1/SG_0134_8_11zon_8_11zon.webp" },
    { src: "/img/final/about_Img/AB1/WHISTLING WOODS CAMPAIGN 09.04_2_9_11zon_9_11zon.webp" },
];

// Seconds for the strip to scroll one full set on its own
const LOOP_SECONDS = 35;

const AboutHero = () => {
    const heroRef = useRef(null);
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    // Headline line by line, then the founding line, then the image strip
    useEntrance(heroRef, { gap: 0.25 });

    // Auto-scrolling strip that glides after a drag and eases back into its own speed
    useInfiniteDragSlider(containerRef, trackRef, { itemCount: carouselItems.length, loopSeconds: LOOP_SECONDS });

    return (
        <section ref={heroRef} className="relative w-full pt-32 pb-16 overflow-hidden bg-[#FAFAFA]">
            <div className="px-4 md:px-8 mb-16 md:mb-24">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-16">
                    <h1
                        data-entrance="lines"
                        className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-black max-w-4xl leading-[1.05]"
                    >
                        Telling stories across cinema, screens and classrooms.
                    </h1>
                    <p
                        data-entrance="rise"
                        className="text-[#555] text-lg md:text-xl max-w-[22rem] leading-relaxed font-medium"
                    >
                        Established in 1978 by Mr. Subhash Ghai.
                    </p>
                </div>
            </div>

            <div
                ref={containerRef}
                data-entrance="rise"
                className="w-full cursor-grab active:cursor-grabbing overflow-hidden"
            >
                <div
                    ref={trackRef}
                    className="flex items-center w-max px-4 md:px-8"
                >
                    {/* Double the array for seamless infinite looping */}
                    {[...carouselItems, ...carouselItems].map((item, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-[300px] sm:w-[380px] md:w-[440px] h-[220px] sm:h-[260px] md:h-[300px] mr-4 md:mr-6 overflow-hidden"
                        >
                            <Image
                                src={item.src}
                                alt=""
                                fill
                                sizes="(max-width: 768px) 80vw, 33vw"
                                className="object-cover"
                                priority={index < 4}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
