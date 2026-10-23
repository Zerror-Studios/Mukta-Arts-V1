'use client'

import React, { useRef } from 'react';
import useEntrance from '@/hooks/useEntrance';
import Button from '@/components/common/Button';

const WEBSITE = 'https://www.whistlingwoods.net/';

const WWHERO = () => {
    const heroRef = useRef(null);

    // Title word by word, the rule draws in, then the copy lines and the button rise
    useEntrance(heroRef);

    return (
        <section ref={heroRef} className="relative w-full min-h-svh lg:h-screen lg:min-h-[700px] flex flex-col bg-black overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                {/* A 2560px copy of the 8192px original (W1/), so the first screen loads quickly */}
                <img
                    src="/img/final/WW/W1/web/0R2A2411_1_11zon_2_11zon.webp"
                    alt=""
                    fetchPriority="high"
                    className="object-cover w-full h-full object-center"
                />
                {/* Dark overlay to keep the type readable */}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full flex-1 lg:h-full mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-between gap-12 py-12 md:py-20 lg:py-24">

                {/* Title */}
                <div className="flex-1 flex items-center justify-center">
                    <h1
                        data-entrance="words"
                        className="font-['SwitzerSB'] text-white max-sm:mt-20 uppercase text-center text-[clamp(2rem,9vw,5rem)] leading-[1.05]"
                    >
                        Whistling Woods International
                    </h1>
                </div>

                {/* Bottom Section */}
                <div className="w-full">
                    <div data-entrance="line" className="w-full h-px bg-white/30 mb-10 md:mb-12"></div>

                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">

                        {/* Left: description and button */}
                        <div className="flex flex-col gap-8 w-full lg:max-w-md">
                            <p data-entrance="lines" className="text-white max-md:text-[15px]! max-md:leading-[1.6]!">
                                Whistling Woods International (WWI) and the Tata Institute of Social Sciences (TISS) team up to offer degree and diploma programmes in Filmmaking, Animation &amp; Game Design, Acting, Media &amp; Communication, Fashion, Music and Visual communication Design.
                            </p>
                            <div data-entrance="rise">
                                <Button onDark href={WEBSITE} external>
                                    Visit Our Website
                                    <span className="sr-only">(opens in a new tab)</span>
                                </Button>
                            </div>
                        </div>

                        {/* Right: campus */}
                        <div className="w-full lg:max-w-152">
                            <p data-entrance="lines" className="text-white max-md:text-[15px]! max-md:leading-[1.6]!">
                                Spread across a 5.5-acre campus, WWI is equipped with industry-grade facilities and cutting-edge technology that enable students to develop both the academic and practical aspects of their craft. Our vision is to build a globally benchmarked institution that sets new standards for excellence in creative education.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default WWHERO;
