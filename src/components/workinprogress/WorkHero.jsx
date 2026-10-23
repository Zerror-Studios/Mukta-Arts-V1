'use client'
import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

// The poster when the page is opened directly rather than from the film grid
const DEFAULT_IMAGE = "https://m.media-amazon.com/images/M/MV5BNTI3M2Y1YzYtYzNkZC00OTc0LTk0MGQtYWM1ZWU1Yzk4N2VmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg";

const WorkHero = () => {
    // Set once the grid's choice has been read, so the default poster is never downloaded only to be replaced
    const [imageSrc, setImageSrc] = useState(null);
    const [title, setTitle] = useState("Yaadein");
    const [description, setDescription] = useState("Yaadein (Transl. Memories) Is A 2001 Indian Hindi-Language Musical Drama Film Written, Directed, Edited And Produced By Subhash Ghai.[2] The Film Stars Hrithik Roshan, Kareena Kapoor, Jackie Shroff And Amrish Puri.");
    const [year, setYear] = useState("2001");

    useEffect(() => {
        const savedImage = localStorage.getItem("selectedFilmImage");
        const savedTitle = localStorage.getItem("selectedFilmTitle");
        const savedDesc = localStorage.getItem("selectedFilmDesc");
        const savedYear = localStorage.getItem("selectedFilmYear");

        setImageSrc(savedImage || DEFAULT_IMAGE);
        if (savedTitle) {
            setTitle(savedTitle);
            // A film without a brief yet should show nothing, not the default copy
            setDescription(savedDesc || "");
            setYear(savedYear || "");
        }

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
                    {/* Using tracking and scale to mimic the condensed font look without needing a custom font */}
                    <h2 className=" uppercase font-bold! text-black "
                    >
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
                    {/* Fallback image as standard img tag to avoid Next.js domain config issues for external URLs */}
                    <img
                        src={imageSrc ?? undefined}
                        alt={`${title} Movie Poster`}
                        className="w-full h-full object-cover work-hero-image opacity-0"
                    />
                </div>
            </div>

        </div>
    );
};

export default WorkHero;