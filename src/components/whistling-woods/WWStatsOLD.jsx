'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const textContent = "Founded in 2006 by Subhash Ghai within Mumbai’s iconic Filmcity Complex, Whistling Woods International is a premier institute for filmmaking, media, communication and creative arts. Combining world-class education with hands-on industry experience, WWI has emerged as a global leader in media and entertainment education.";

const statsData = [
    {
        target: 4500,
        prefix: "",
        suffix: "+",
        text: "Film and Media Industry Alumni",
    },
    {
        target: 1300,
        prefix: "",
        suffix: "+",
        text: "Students on campus",
    },
    {
        target: 30,
        prefix: "",
        suffix: "+",
        text: "Technology Partners",
    },
    {
        target: 350,
        prefix: "",
        suffix: "+",
        text: "Industry Partners as full time or guest faculty",
    },
    {
        target: 1,
        prefix: "$ ",
        suffix: "M+",
        text: "Scholarships and fee waivers provided in the past 18 years.",
    },
    {
        target: 16,
        prefix: "",
        suffix: "+",
        text: "International University Affiliations across the globe.",
    },
];

const WWStats = () => {
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

        // Stats Columns Animation
        gsap.from(".stat-col", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".stats-container",
                start: "top 85%",
            }
        });

        // Number Animation (all numbers count up together)
        const nums = Array.from(containerRef.current.querySelectorAll('.stat-num'));
        const targets = nums.map((num) => parseInt(num.getAttribute('data-target'), 10));
        const proxy = { progress: 0 };
        gsap.to(proxy, {
            progress: 1,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".stats-container",
                start: "top 85%",
                once: true,
            },
            onUpdate: () => {
                nums.forEach((num, i) => {
                    num.innerText = Math.round(targets[i] * proxy.progress).toLocaleString('en-US');
                });
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#FAFAFA] py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10  overflow-hidden">
            <div className=" mx-auto">

                {/* Scroll Reveal Text */}
                <div className="mb-16 md:mb-36 lg:mb-44 flex justify-center max-w-[95%] sm:max-w-[80%] mx-auto">
                    <h5
                        ref={textRef}
                        className="text-[28px] md:text-4xl lg:text-[2.75rem] max-sm:text-[1.5rem]! max-sm:leading-[1.3]! text-center w-full  leading-[1.3] font-medium tracking-tight"
                    >
                        {/* The space after each word is not drawn (end of an inline-block), but the HTML reads as a sentence */}
                        {textContent.split(" ").map((word, index) => (
                            <span key={index} className="word inline-block mr-[0.25em]">
                                {word}{" "}
                            </span>
                        ))}
                    </h5>
                </div>

                {/* Stats Grid */}
                <div className="stats-container grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-12 md:gap-y-16 lg:gap-x-16 lg:gap-y-20">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className="stat-col flex flex-col justify-between gap-4 border-l border-[#D4D4D4] pl-4 md:pl-6 lg:pl-8 "
                        >
                            <h4 className="text-4xl md:text-[42px] max-sm:text-[1.75rem]! max-sm:leading-[1.1]! font-normal text-black tracking-tight flex flex-wrap items-baseline">
                                {stat.prefix && (
                                    <span className="text-lg md:text-3xl font-light text-neutral-600 mr-1.5">
                                        {stat.prefix}
                                    </span>
                                )}
                                {/* The final value, so it reads without JS; the scroll animation counts up from 0 */}
                                <span className="stat-num" data-target={stat.target}>{stat.target.toLocaleString('en-US')}</span>
                                {stat.suffix}
                            </h4>
                            <p className="text-[#555] text-[14px] md:text-[15px] max-sm:text-[13px]! max-sm:leading-snug! leading-relaxed pr-0 md:pr-4">
                                {stat.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WWStats;
