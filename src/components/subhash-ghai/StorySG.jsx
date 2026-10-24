'use client'

import React, { useRef } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import useParallax from '@/hooks/useParallax';

const StorySG = () => {
    const sectionRef = useRef(null);

    // Headline and paragraphs reveal line by line, once; the photograph drifts 12% slower than the scroll
    useScrollReveal(sectionRef);
    useParallax(sectionRef);

    return (
        <section ref={sectionRef} className="bg-[#1B123D] relative px-6 py-16 md:px-12 md:py-24 lg:px-10 overflow-hidden font-['SwitzerR']">


            {/* Background Graphic Placeholder */}
            <div className="absolute -top-20 left-0 w-full h-[60%] flex items-center justify-center opacity-30 pointer-events-none">
                {/* Assuming this might be the film reel or a circular graphic */}
                {/* <div className="w-[600px] h-[600px]  ">
                    <img loading="lazy" decoding="async" src="/img/logo/logo-4k.png" alt="" className='w-full h-full object-cover object-center' />
                </div> */}
            </div>

            {/* Top Text Section */}
            <div className="max-w-5xl mx-auto text-center relative z-10">
                <p data-reveal="lines" className="text-white/90 text-sm md:text-base tracking-wide mb-6 font-['SwitzerR']">
                    A Journey That Began With Cinema And Grew Into A Legacy
                </p>
                <h5 data-reveal="lines" className=" text-white font-['SwitzerM'] ">
                    As the founder of Mukta Arts, he created a body of work that helped define mainstream
                    Hindi cinema, with films such as Karz, Hero, Ram Lakhan, Saudagar, Pardes and Taal
                    becoming cultural touchstones for generations.
                </h5>
            </div>

            {/* Bottom Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-16 md:mt-24 lg:mt-32 items-end relative z-10">

                {/* Left Column - Image (parallax frame) */}
                <div className="lg:col-span-8 relative overflow-hidden h-[300px] sm:h-[420px] lg:h-[600px]">
                    <img
                        data-parallax="0.12"
                        src="/img/final/SG/S2/SG_0067_3_11zon.webp"
                        alt="Subhash Ghai"
                        className="absolute left-0 top-0 w-full h-full object-cover object-center will-change-transform"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                {/* Right Column - Text & Signature */}
                <div className="lg:col-span-4 flex flex-col justify-end lg:pb-12">
                    <p data-reveal="lines" className="text-white text-sm md:text-[1.05rem] font-medium! leading-relaxed font-['SwitzerR'] mb-12">
                        What began as a passion for storytelling grew into a lifelong pursuit of creating,
                        nurturing and shaping the world of entertainment. From iconic films through Mukta Arts
                        to the creation of Whistling Woods International, Subhash Ghai’s journey has always
                        looked beyond the moment - towards the future of Indian cinema and the people who
                        will shape it.
                    </p>

                    <div data-reveal="rise">
                        {/* His own autograph (Autograph_1_11zon.webp with the paper made transparent), inverted to white ink */}
                        <img
                            src="/img/final/SG/S2/Autograph_transparent.webp"
                            alt="Subhash Ghai's signature"
                            className="w-[170px] md:w-[200px] h-auto mb-3 invert opacity-90 select-none pointer-events-none"
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                        />
                        <p className="text-white text-lg font-['SwitzerM'] tracking-wide">Subhash Ghai</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default StorySG;
