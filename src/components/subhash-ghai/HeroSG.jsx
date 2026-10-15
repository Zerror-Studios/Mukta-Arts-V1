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
        <section ref={heroRef} className="bg-[#f5f5f6] min-h-screen px-6 py-8 md:px-12 md:py-16 lg:px-10 relative overflow-hidden font-['SwitzerR']">

            {/* Title Section */}
            <div className="mt-8 md:mt-16 mb-12">
                <h1
                    data-entrance="words"
                    data-entrance-at="0"
                    className="text-6xl md:text-[6rem] lg:text-[8.5rem] leading-[0.9] tracking-tighter font-['SwitzerB'] font-bold text-black mb-4"
                >
                    Subhash Ghai
                </h1>
            </div>

            {/* 3 Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-stretch mt-8 lg:mt-24">

                {/* Left Column - Stats */}
                <div className="flex flex-col justify-end order-2 lg:order-1">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={i < stats.length - 1 ? "border-b border-gray-300 pb-5 mb-8" : "pb-5"}
                        >
                            {/* Rendered at the final value so it reads without JS; counts up on load */}
                            <h3
                                data-entrance="count"
                                data-entrance-at={0.2 + i * 0.1}
                                data-count-to={stat.value}
                                data-count-suffix={stat.suffix}
                                data-count-duration="0.9"
                                className="text-[1.75rem] leading-tight font-bold font-['SwitzerSB'] text-black mb-2 tabular-nums"
                            >
                                {`${stat.value}${stat.suffix}`}
                            </h3>
                            <p
                                data-entrance="rise"
                                data-entrance-at={0.25 + i * 0.1}
                                className="text-gray-600 text-base font-['SwitzerR']"
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Middle Column - Image */}
                <div
                    data-entrance="fade"
                    data-entrance-at="0.1"
                    className="relative order-1 lg:order-2 h-[400px] md:h-[600px] lg:h-[700px]"
                >
                    <img
                        src="/img/sg/1.jpg"
                        alt="Subhash Ghai"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Right Column - Intro */}
                <div className="flex flex-col justify-between order-3 lg:order-3 pt-4">
                    <p
                        data-entrance="lines"
                        data-entrance-at="0.5"
                        className="text-[#4A4A4A] text-[1.1rem] leading-relaxed font-['SwitzerR'] pr-4"
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
