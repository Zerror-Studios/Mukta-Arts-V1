"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ABOUTWD = () => {
    const sectionRef = useRef(null);
    const wordsRef = useRef([]);
    const countersRef = useRef([]);

    const text = "Founded In 2006 By Subhash Ghai Inside Mumbai's Filmcity, Whistling Woods International Is India's Premier Media And Creative Arts Institute. Ranked Among The World's Top 10 Film Schools By The Hollywood Reporter, WWI Sets The Standard For Media, Tech, And Entertainment Education.";
    const words = text.split(" ");

    const stats = [
        {
            value: 18,
            suffix: "+",
            format: false,
            description: "For over 18 years, WWI has shaped creative talent through world-class education, industry exposure, and hands-on learning."
        },
        {
            value: 4500,
            suffix: "+",
            format: true,
            description: "A global community of 4,500+ alumni shaping successful careers across film, media, communication, and the creative industries."
        },
        {
            value: 1300,
            suffix: "+",
            format: true,
            description: "A vibrant community of 1,300+ students pursuing diverse undergraduate, postgraduate, and diploma programs."
        }
    ];

    useEffect(() => {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // 1. Text Scrub Animation (Words fill with dark color on scroll)
            gsap.to(wordsRef.current, {
                color: "#111111", // Target dark color
                stagger: 0.1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%", // Starts when top of section is 75% down viewport
                    end: "center 40%", // Ends when center of section is 40% down viewport
                    scrub: true, // 1 second smooth scrubbing
                }
            });

            // 2. Number Counter Animation
            countersRef.current.forEach((counter, i) => {
                const targetObj = { val: 0 };
                const targetValue = stats[i].value;
                const needsFormat = stats[i].format;

                gsap.to(targetObj, {
                    val: targetValue,
                    duration: 2.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: counter,
                        start: "top 90%", // Trigger when counter is in view
                        toggleActions: "play none none none"
                    },
                    onUpdate: () => {
                        let displayValue = Math.floor(targetObj.val);
                        if (needsFormat) {
                            displayValue = displayValue.toLocaleString();
                        }
                        counter.innerText = displayValue + stats[i].suffix;
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="w-full bg-[#f8f9fa] h-fit py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 flex flex-col items-center overflow-hidden ">

            {/* Top Text Area - Scrub Animation */}
            <div className=" flex mx-auto text-center mb-28 md:mb-40">
                <h5 className="text-3xl md:text-[42px] lg:text-[46px] font-medium leading-[1.3] text-[#b0b0b0]">
                    {words.map((word, i) => (
                        <React.Fragment key={i}>
                            <span ref={el => wordsRef.current[i] = el}>
                                {word}
                            </span>
                            {i < words.length - 1 && " "}
                        </React.Fragment>
                    ))}
                </h5>
            </div>

            {/* Stats Area - Counters */}
            <div className="w-full mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-0">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="flex flex-col justify-between border-l bg-amber-400 border-gray-300 pl-6 md:pl-10 pr-6 md:pr-12 flex-1 w-full"
                    >
                        <h5
                            ref={el => countersRef.current[i] = el}
                            className="text-[40px] md:text-[50px] lg:text-[56px] font-medium text-[#111] leading-none"
                        >
                            0{stat.suffix}
                        </h5>
                        <p className="text-[#555] text-sm md:text-[15px] leading-[1.7] mt-[30vh] ">
                            {stat.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ABOUTWD;
