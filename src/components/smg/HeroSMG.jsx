'use client'

import React, { useRef } from 'react';
import useEntrance from '@/hooks/useEntrance';

const HeroSMG = () => {
    const containerRef = useRef(null);

    // Title word by word, the rule draws in, then the copy line by line (shared with every inner page)
    useEntrance(containerRef);

    return (
        <section ref={containerRef} className="relative w-full h-screen min-h-[700px] flex flex-col bg-black overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                {/* Note: Placeholder â€” replace with an SGM Studios still */}
                <img
                    src="https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1740&auto=format&fit=crop"
                    alt="SGM Studios Background"
                    className="object-cover w-full h-full object-center"
                />
                {/* Dark overlay to ensure text and logo readability */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full  mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-between py-12 md:py-20 lg:py-24">

                {/* Top Spacer & Center Logo */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="relative">
                        <h2 data-entrance="words" className='text-white uppercase'>SGM Studios</h2>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="w-full">
                    {/* Divider Line */}
                    <div data-entrance="line" className="w-full h-[1px] bg-white/30 mb-10 md:mb-12"></div>

                    {/* Content Columns */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">

                        {/* Left Side: Description */}
                        <div className="flex flex-col gap-8 max-w-[440px]">
                            <p data-entrance="lines" className="text-white text-[15px] md:text-[17px] leading-[1.6]">
                                SGM Studios is Mukta Arts&apos; animation and visual storytelling arm, built to carry the company&apos;s cinematic legacy into the world of animation and new-age entertainment.
                            </p>
                        </div>

                        {/* Right Side: Description */}
                        <div className="flex flex-col gap-3.5 text-white max-w-[440px] lg:min-w-[400px]">
                            <p data-entrance="lines" className="text-white text-[15px] md:text-[17px] leading-[1.6]">
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
