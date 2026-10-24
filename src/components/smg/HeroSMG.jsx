'use client'

import { useRef } from 'react';
import Image from 'next/image';
import useEntrance from '@/hooks/useEntrance';

const HeroSMG = () => {
    const containerRef = useRef(null);

    // Title word by word, the rule draws in, then the copy line by line (shared with every inner page)
    useEntrance(containerRef);

    return (
        // Phones grow with the content (svh avoids jumps from the mobile URL bar) instead of clipping it
        <section ref={containerRef} className="relative w-full min-h-svh md:h-screen md:min-h-[700px] flex flex-col bg-black overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                {/* Note: Placeholder — replace with an SGM Studios still */}
                {/* The source is 5472px wide: Next serves a copy sized to the screen. On a screen
                    narrower than the 3:2 photo, object-cover fills the height, so it shows 150vh wide */}
                <Image
                    src="/img/final/home/home2/2O5A4368.webp"
                    alt="Exterior of a curved building surrounded by trees"
                    fill
                    sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
                    preload
                    className="object-cover w-full h-full object-center"
                />
                {/* Dark overlay to ensure text and logo readability */}
                <div className="absolute inset-0 bg-black/30 md:bg-black/50"></div>
                {/* Phones only: darkens the lower part so the text reads over the photo */}
                <div className="md:hidden absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none"></div>
            </div>

            {/* Content Container: on phones everything sits at the bottom, leaving the photo clear */}
            <div className="relative z-10 w-full flex-1 md:h-full mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-end md:justify-between pt-32 pb-10 md:py-20 lg:py-24">

                {/* Top Spacer & Center Logo */}
                <div className="flex-1 flex items-center justify-center max-md:flex-none max-md:justify-start max-md:mb-6">
                    <div className="relative">
                        {/* `!` because the global h2 size in fonts.css is unlayered and would win over the utilities */}
                        <h1 data-entrance="words" className='h2 text-white uppercase max-md:text-[clamp(2.6rem,11vw,4rem)]! max-md:leading-none!'>SGM Studios</h1>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="w-full">
                    {/* Divider Line */}
                    <div data-entrance="line" className="w-full h-[1px] bg-white/30 mb-6 md:mb-12"></div>

                    {/* Content Columns */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 md:gap-12 lg:gap-8">

                        {/* Left Side: Description */}
                        <div className="flex flex-col gap-8 max-w-[440px]">
                            <p data-entrance="lines" className="text-white text-[15px] md:text-[17px] leading-[1.6] max-md:text-[15px]! max-md:leading-[1.6]!">
                                SGM Studios is Mukta Arts&apos; animation and visual storytelling arm, built to carry the company&apos;s cinematic legacy into the world of animation and new-age entertainment.
                            </p>
                        </div>

                        {/* Right Side: Description */}
                        <div className="flex flex-col gap-3.5 text-white max-w-[440px] lg:min-w-[400px]">
                            <p data-entrance="lines" className="text-white max-md:text-white/75 text-[15px] md:text-[17px] leading-[1.6] max-md:text-[15px]! max-md:leading-[1.6]!">
                                The studio develops original, culturally rooted IP, bringing together creative talent and emerging technology to craft visually distinctive worlds and character-driven narratives for audiences across India and beyond.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSMG;
