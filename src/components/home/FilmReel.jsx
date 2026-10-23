"use client";

import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useInView from "@/hooks/useInView";

// The sprocket holes along the top and bottom edges of the strip
const HOLES = {
    backgroundImage: "repeating-linear-gradient(to right, #ffffff 0, #ffffff 16px, transparent 16px, transparent 32px)",
};

// Section 9 of the home page content doc: five frames, one figure each, on the client's own photos
// (the behind-the-scenes stills, Whistling Woods and Topiwala; strip/ holds 800px copies of the big files)
const CONTENT = [
    { value: "45+", label: "Years of Legacy", image: "/img/final/home/home2/SG_0067.webp" },
    { value: "50+", label: "Films Produced", image: "/img/final/home/home2/SG_0054.webp" },
    { value: "35", label: "Blockbusters", image: "/img/final/home/home2/SG_0044.webp" },
    { value: "4500+", label: "Alumni", image: "/img/final/home/strip/WWI_0R2A9902.webp" },
    { value: "37", label: " Mukta A2 Cinemas", image: "/img/final/home/strip/TOPIWALA_MA2_28.webp" },
];

// Duplicate multiple times for a seamless scroll effect
const LOOP_CONTENT = [...CONTENT, ...CONTENT, ...CONTENT, ...CONTENT, ...CONTENT, ...CONTENT];

export default function FilmReel() {
    const sectionRef = useRef(null);
    const marqueeRef = useRef(null);
    const tweenRef = useRef(null);
    // Only runs while the section is near the screen
    const running = useInView(sectionRef);
    // Its images are only fetched once the section is a screen or so away
    const loadImages = useInView(sectionRef, "100%", true);

    useGSAP(() => {
        // Infinite horizontal scrolling, moving half the width
        tweenRef.current = gsap.to(marqueeRef.current, {
            x: "-50%",
            duration: 25,
            repeat: -1,
            ease: "none",
        });
    });

    useEffect(() => {
        tweenRef.current?.paused(!running);
    }, [running]);

    return (
        // The strip is wider than the screen and tilted, so the section clips it and leaves room for its corners
        <section ref={sectionRef} className="w-full bg-white overflow-hidden flex justify-center py-[max(4rem,6vw)]">
            <div className="w-[120vw] shrink-0 -rotate-[3deg] bg-[#111] py-2 shadow-2xl overflow-hidden pointer-events-none">
                {/* Top holes */}
                <div className="h-3" style={HOLES}></div>

                {/* Scrolling content */}
                <div className="flex w-max gap-2 px-2 my-1" ref={marqueeRef}>
                    {LOOP_CONTENT.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-center min-w-[200px] md:min-w-[280px] h-[120px] md:h-[160px] px-4 md:px-8 rounded-sm bg-black/50 bg-cover bg-center"
                            // The photo sits under a dark overlay for text readability
                            style={loadImages ? { backgroundImage: `linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)), url("${encodeURI(item.image)}")` } : undefined}
                        >
                            <h3 className="text-[#f97316] text-3xl! md:text-5xl! leading-none! font-bold tracking-tight whitespace-nowrap drop-shadow-md">{item.value}</h3>
                            <p className="mt-1 md:mt-2 text-white text-xs md:text-base font-semibold uppercase tracking-wide whitespace-nowrap drop-shadow-md">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom holes */}
                <div className="h-3 opacity-40" style={HOLES}></div>
            </div>
        </section>
    );
}
