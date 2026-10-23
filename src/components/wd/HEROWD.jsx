"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Button from '@/components/common/Button';

const HEROWD = () => {
    const containerRef = useRef(null);
    const logoRef = useRef(null);
    const lineRef = useRef(null);
    const leftTextRef = useRef(null);
    const rightTextRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        // GSAP animations
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Set initial states
            gsap.set(logoRef.current, { y: 40, opacity: 0 });
            gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });
            gsap.set(leftTextRef.current, { y: 20, opacity: 0 });
            gsap.set(rightTextRef.current, { y: 20, opacity: 0 });
            gsap.set(bgRef.current, { scale: 1.1 });

            // Animate background zoom in slowly
            tl.to(bgRef.current, {
                scale: 1,
                duration: 2.5,
                ease: 'power2.out',
            })
                // Animate logo fade and slide up
                .to(logoRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                }, '-=2')
                // Animate horizontal line expanding
                .to(lineRef.current, {
                    scaleX: 1,
                    duration: 1.5,
                    ease: 'power3.inOut',
                }, '-=1')
                // Animate bottom texts
                .to([leftTextRef.current, rightTextRef.current], {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                }, '-=1');
        }, containerRef);

        return () => ctx.revert(); // Cleanup on unmount
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen min-h-[700px] flex flex-col items-center overflow-hidden bg-[#0a0a0a] font-sans"
        >
            {/* Background Image Container */}
            <div
                ref={bgRef}
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    // Using a relevant unsplash image of a film camera on set as a placeholder
                    backgroundImage: 'url("/img/wd/wdh.webp")',
                }}
            >
                {/* Overlay to darken background for text readability */}
                <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                {/* Gradient for vignette effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#111111]/90"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-12 flex flex-col justify-between">

                {/* Top Space / Logo Centering */}
                <div className="flex-1 flex items-center justify-center w-full">
                    {/* Logo Block */}
                    <div ref={logoRef} className="flex flex-col items-start max-w-fit mx-auto">

                        <div className="flex flex-row items-center gap-4 md:gap-5">


                            {/* Text Part of Logo */}
                            <div className="flex flex-col justify-center text-white shrink-0">
                                <h2 className=" text-center ">
                                    WHISTLING

                                    WOODS
                                    <br />
                                    INTERNATIONAL
                                </h2>
                            </div>
                        </div>

                        {/* Subtitle */}
                        <p className=" text-white mx-auto ">
                            Institute of Film, Communication & Creative Arts
                        </p>
                    </div>
                </div>

                {/* Footer Content */}
                <div className="w-full flex flex-col gap-8 md:gap-10 pb-4 md:pb-8">
                    {/* Subtle Horizontal Divider */}
                    <div ref={lineRef} className="w-full h-[1px] bg-white/20"></div>

                    <div className="flex flex-col lg:flex-row justify-between items-start gap-10 w-full">

                        {/* Left Content */}
                        <div ref={leftTextRef} className="text-white max-w-lg">
                            <p className="text-sm md:text-[16px] leading-relaxed mb-6 md:mb-8 font-light text-white/95">
                                Founded by filmmaker Subhash Ghai, WWI offers<br className="hidden md:block" />
                                world-class education in Film, Communication,<br className="hidden md:block" />
                                Creative and Performing Arts.
                            </p>
                            <Button onDark>
                                Visit Our Website
                            </Button>
                        </div>

                        {/* Right Content */}
                        <div ref={rightTextRef} className="text-white text-sm md:text-[15px] font-light w-full flex flex-col ">
                            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-y-3 gap-x-4 ml-auto">
                                <div className="text-white/80 font-normal">Founder:</div>
                                <div className="text-white/95">Subhash Ghai (2006)</div>

                                <div className="text-white/80 font-normal">Location:</div>
                                <div className="text-white/95">Filmcity, Mumbai</div>

                                <div className="text-white/80 font-normal">Focus:</div>
                                <div className="text-white/95">Film, Communication & Creative Arts</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HEROWD;
