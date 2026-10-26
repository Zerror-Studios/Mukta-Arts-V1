'use client'
import React, { useEffect } from 'react';
import { gsap } from 'gsap';

// The film detail page at /our-films/<slug>; the data comes from Sanity through the page
const FilmHero = ({ title, year, description, image }) => {
    useEffect(() => {
        const clone = document.getElementById("transition-clone");

        // Initial state for text
        gsap.set(".work-hero-text", { opacity: 0, y: 20 });

        if (clone) {
            const actualImg = document.querySelector(".work-hero-image");
            if (actualImg) {
                // Use requestAnimationFrame for a smoother handover synced with the browser's paint cycle
                requestAnimationFrame(() => {
                    const rect = actualImg.getBoundingClientRect();
                    gsap.set(clone, {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                    });

                    gsap.set(".work-hero-image", { opacity: 0 });

                    // Crossfade
                    gsap.to(clone, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                        onComplete: () => clone.remove()
                    });
                    gsap.to(".work-hero-image", {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.inOut"
                    });

                    // Fade in text quickly
                    gsap.to(".work-hero-text", {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.1,
                        ease: "power2.out",
                        delay: 0.1
                    });
                });
            }
        } else {
            gsap.to(".work-hero-text", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" });
            gsap.fromTo(".work-hero-image",
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
            );
        }
    }, []);

    return (
        <div className="w-full min-h-screen bg-white text-black flex flex-col md:flex-row items-center justify-center px-10 gap-12 mx-auto overflow-hidden">

            {/* Left Column - Text Content */}
            <div className="flex-1 w-full max-w-2xl flex flex-col justify-center work-hero-text opacity-0 max-sm:mt-[10vh]">
                {/* Title Area */}
                <div className="flex mb-12 ">
                    <h2 className=" uppercase font-bold! text-black ">
                        {title}
                    </h2>
                    {year && (
                        <h5 className="text-3xl md:text-5xl font-bold ml-6 lg:ml-8 mb-4 text-black ">
                            ({year})
                        </h5>
                    )}
                </div>

                {/* Paragraphs */}
                <div className="max-w-[90%] work-hero-text opacity-0">
                    {description.split(/\n\s*\n/).filter(Boolean).map((para, i) => (
                        <p key={i} className="mb-4">
                            {para}
                        </p>
                    ))}
                </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex-1 w-full flex justify-center md:justify-end items-center max-sm:mt-0 sm:mt-12 md:mt-0">
                <div className="relative w-full max-w-[600px] aspect-[4/5] bg-gray-100 shadow-2xl">
                    <img
                        src={image}
                        alt={`${title} Movie Poster`}
                        className="w-full h-full object-cover work-hero-image opacity-0"
                    />
                </div>
            </div>

        </div>
    );
};

export default FilmHero;
