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
                    alt="Whistling Woods International campus, Film City, Mumbai"
                    fetchPriority="high"
                    className="object-cover w-full h-full object-center"
                />
                {/* Dark overlay to keep the type readable */}
                <div className="absolute inset-0 bg-black/20"></div>
                {/* Phones only: darkens the lower part so the text reads over the photo */}
                <div className="md:hidden absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none"></div>
            </div>

            {/* Content Container: on phones everything sits at the bottom, leaving the photo clear */}
            <div className="relative z-10 w-full flex-1 lg:h-full mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-end md:justify-between gap-6 md:gap-12 pt-32 pb-10 md:py-20 lg:py-24">

                {/* Title */}
                <div className="flex-1 flex items-center justify-center max-md:flex-none max-md:justify-start">
                    <h1
                        data-entrance="words"
                        className="font-['SwitzerSB'] text-white uppercase text-center max-md:text-left text-[clamp(2rem,9vw,5rem)] max-md:text-[clamp(2.6rem,11vw,4rem)] leading-[1.05] max-md:leading-none"
                    >
                        Whistling Woods International
                    </h1>
                </div>

                {/* Bottom Section */}
                <div className="w-full">
                    <div data-entrance="line" className="w-full h-px bg-white/30 mb-6 md:mb-12"></div>

                    {/* On phones: both paragraphs, then the button */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 md:gap-12 lg:gap-16">

                        {/* Left: description and button */}
                        <div className="flex flex-col gap-8 w-full lg:max-w-md max-md:contents">
                            <p data-entrance="lines" className="text-white max-md:text-[15px]! max-md:leading-[1.6]!">
                                Whistling Woods International (WWI) and the Tata Institute of Social Sciences (TISS) team up to offer degree and diploma programmes in Filmmaking, Animation &amp; Game Design, Acting, Media &amp; Communication, Fashion, Music and Visual communication Design.
                            </p>
                            <div data-entrance="rise" className="max-md:order-last max-md:mt-4">
                                <Button onDark href={WEBSITE} external>
                                    Visit Our Website
                                    <span className="sr-only">(opens in a new tab)</span>
                                </Button>
                            </div>
                        </div>

                        {/* Right: campus */}
                        <div className="w-full lg:max-w-152">
                            <p data-entrance="lines" className="text-white max-md:text-white/75 max-md:text-[15px]! max-md:leading-[1.6]!">
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
