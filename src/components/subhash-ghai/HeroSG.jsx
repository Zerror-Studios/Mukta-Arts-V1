'use client'

import React, { useRef } from 'react';
import useEntrance from '@/hooks/useEntrance';

const stats = [
    { value: 50, suffix: " Years", label: "as a Filmmaker" },
    { value: 19, suffix: " Films", label: "Written and Directed" },
    { value: 45, suffix: "+", label: "Films Produced" },
];

const HeroSG = () => {
    const heroRef = useRef(null);

    // Name first, then the three stats counting up, then the intro: all in under 1.5s
    useEntrance(heroRef);

    return (
        // One screen tall: the top padding clears the fixed header (5rem / 7rem), and the image takes
        // whatever height is left, so the title, stats and intro always fit. min-h-svh lets it grow on
        // very short screens instead of clipping; svh avoids jumps from the mobile URL bar.
        <section ref={heroRef} className="bg-[#f5f5f6] min-h-svh lg:h-svh lg:min-h-[640px] flex flex-col px-6 pt-[calc(5rem+12px)] pb-6 md:px-12 md:pt-[calc(7rem+8px)] md:pb-10 lg:px-10 relative overflow-hidden font-['SwitzerR']">

            {/* Title Section */}
            <div className="shrink-0 mb-5 md:mb-8 lg:mb-0">
                <h1
                    data-entrance="words"
                    data-entrance-at="0"
                    // On desktop the name also scales with the screen height, so short screens keep room for the image
                    className="text-6xl md:text-[6rem] lg:text-[min(8.5rem,14svh)] leading-[0.9] tracking-tighter font-['SwitzerB'] font-bold text-black"
                >
                    Subhash Ghai
                </h1>
            </div>

            {/* 3 Column Grid (stacked below lg: image, stats, intro) */}
            <div className="flex-1 min-h-0 flex flex-col gap-5 md:gap-8 lg:grid lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)] lg:gap-16 lg:mt-[clamp(1.5rem,6svh,6rem)]">

                {/* Left Column - Stats: a row of three on phones and tablets, a column on desktop */}
                <div className="order-2 lg:order-1 grid grid-cols-3 lg:flex lg:flex-col lg:justify-end">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={
                                i < stats.length - 1
                                    ? "border-r border-gray-300 pr-3 mr-3 md:pr-6 md:mr-6 lg:border-r-0 lg:pr-0 lg:mr-0 lg:border-b lg:pb-5 lg:mb-8"
                                    : "lg:pb-5"
                            }
                        >
                            {/* Rendered at the final value so it reads without JS; counts up on load */}
                            <h3
                                data-entrance="count"
                                data-entrance-at={0.2 + i * 0.1}
                                data-count-to={stat.value}
                                data-count-suffix={stat.suffix}
                                data-count-duration="0.9"
                                className="text-[1.3rem] sm:text-[1.6rem] md:max-lg:text-[28px] lg:text-[1.75rem] leading-tight font-bold font-['SwitzerSB'] text-black mb-1 lg:mb-2 tabular-nums whitespace-nowrap"
                            >
                                {`${stat.value}${stat.suffix}`}
                            </h3>
                            <p
                                data-entrance="rise"
                                data-entrance-at={0.25 + i * 0.1}
                                className="text-gray-600 text-base max-lg:text-[13px]! max-lg:leading-[1.3]! md:max-lg:text-[15px]! font-['SwitzerR']"
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Middle Column - Image: fills the height left over */}
                <div
                    data-entrance="fade"
                    data-entrance-at="0.1"
                    className="relative order-1 lg:order-2 flex-1 min-h-[220px] lg:min-h-0 lg:h-full"
                >
                    <img
                        src="/img/final/SG/S1/DSC00988 2_2_11zon.webp"
                        alt="Subhash Ghai"
                        className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
                    />
                </div>

                {/* Right Column - Intro */}
                <div className="shrink-0 flex flex-col justify-between order-3 lg:order-3 lg:pt-4">
                    <p
                        data-entrance="lines"
                        data-entrance-at="0.5"
                        className="text-[#4A4A4A] text-[1.1rem] leading-relaxed max-lg:text-[15px]! max-lg:leading-[1.5]! md:max-lg:text-[17px]! font-['SwitzerR'] lg:pr-4"
                    >
                        A five-decade journey across cinema, education and entrepreneurship. From creating
                        some of Indian cinema’s most enduring films to building institutions that shape the next
                        generation of creative talent, Subhash Ghai’s vision has always extended beyond the
                        screen.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default HeroSG;
