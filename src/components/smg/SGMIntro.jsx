'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const textContent = "Its work spans animation, digital formats and franchise development, with the ambition of building properties that can travel across film, series and other forms of entertainment, pairing decades of experience in cinema with the creative range of animation.";

const SGMIntro = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        // Text Reveal Animation on Scroll
        const words = textRef.current.querySelectorAll('.word');

        gsap.fromTo(words,
            { color: "#C0C0C0" }, // Initial gray state
            {
                color: "#000000",
                duration: 1,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 80%",
                    end: "bottom 40%",
                    scrub: 1,
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative bg-[#FAFAFA] pt-24 md:pt-32 lg:pt-40 px-4 md:px-8 lg:px-10 overflow-hidden pb-30">
            {/* Scroll Reveal Text */}
            <div className="flex justify-center max-w-[1400px] mx-auto">
                <h5
                    ref={textRef}
                    className="text-[28px] md:text-4xl lg:text-[2.75rem] text-center w-full md:w-4/5 lg:w-2/3 leading-[1.3] font-medium tracking-tight"
                >
                    {textContent.split(" ").map((word, index) => (
                        <span key={index} className="word inline-block mr-[0.25em]">
                            {word}
                        </span>
                    ))}
                </h5>
            </div>

           
        </section>
    );
};

export default SGMIntro;
