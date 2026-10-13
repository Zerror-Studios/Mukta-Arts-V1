'use client'

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HeroSecMa2 = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Animate the main logo
        tl.from(".wwi-logo", {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.2
        })
            // Animate the divider line
            .from(".wwi-divider", {
                scaleX: 0,
                transformOrigin: "left",
                duration: 1,
                ease: "power3.inOut"
            }, "-=0.8")
            // Animate the bottom text and button
            .from(".wwi-text-anim", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.4");
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full h-screen min-h-[700px] flex flex-col bg-black overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                {/* Note: Update the src to your actual background image */}
                <img
                    src="https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Mukta A2 Cinemas Background"

                    className="object-cover w-full h-full object-center"

                />
                {/* Dark overlay to ensure text and logo readability */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full  mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-between py-12 md:py-20 lg:py-24">

                {/* Top Spacer & Center Logo */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="wwi-logo relative ">
                        {/* Note: Update the src to your actual Whistling Woods logo */}
                        {/* <Image
                            src="/img/wwi-logo.png"
                            alt="Whistling Woods International Logo"
                            fill
                            className="object-contain"
                        /> */}
                        <h2 className='text-white uppercase'>Mukta A2 Cinemas</h2>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="w-full">
                    {/* Divider Line */}
                    <div className="wwi-divider w-full h-[1px] bg-white/30 mb-10 md:mb-12"></div>

                    {/* Content Columns */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">

                        {/* Left Side: Description and Button */}
                        <div className="flex flex-col gap-8 max-w-[440px]">
                            <p className="wwi-text-anim text-white text-[15px] md:text-[17px] leading-[1.6]">
                                Mukta A2 Cinemas is the exhibition arm of Mukta Arts, founded with a vision to make the big-screen experience accessible to audiences across India.
                            </p>
                            <div className="wwi-text-anim">
                                <a
                                    href="https://muktaa2cinemas.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-white text-black px-8 py-3.5 text-[11px] font-bold tracking-[0.15em] transition-colors hover:bg-gray-200"
                                >
                                    VISIT OUR WEBSITE
                                </a>
                            </div>
                        </div>

                        {/* Right Side: Description */}
                        <div className="flex flex-col gap-3.5 text-white max-w-[440px] lg:min-w-[400px]">
                            <p className="wwi-text-anim text-white text-[15px] md:text-[17px] leading-[1.6]">
                                Built around the idea of offering quality cinema at affordable prices, the brand has grown into a diverse cinema exhibition network spanning established and emerging markets.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSecMa2;
