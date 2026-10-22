'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const textContent = "The cinemas combine modern projection and sound technology with comfortable seating, food and beverage offerings and a focus on delivering an accessible, high-quality movie-going experience. From major cities to emerging Tier II and Tier III markets, Mukta A2 Cinemas continues to take the magic of the big screen to a wider and more diverse audience.";

const statsData = [
    {
        target: 37,
        prefix: "",
        suffix: " Cinemas",
        text: "Mukta A2 cinemas forming a multi-screen exhibition network that serves audiences across diverse markets.",
    },
    {
        target: 24,
        prefix: "",
        suffix: " Cities",
        text: "Operations across India with an additional 22 Screens in Bahrain and Saudi Arabia.",
    },
    {
        target: 18379,
        prefix: "",
        suffix: " capacity",
        text: "The total seating capacity across the exhibition network.",
    },
];

const Stater = () => {
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

        // Number Animation
        const statCols = containerRef.current.querySelectorAll('.stat-col');
        statCols.forEach((col) => {
            const num = col.querySelector('.stat-num');
            if (!num) return;
            const target = parseInt(num.getAttribute('data-target'), 10);
            const proxy = { val: 0 };
            gsap.to(proxy, {
                val: target,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: col,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
                onUpdate: () => {
                    num.innerText = Math.round(proxy.val).toLocaleString('en-US');
                }
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#FAFAFA] py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10  overflow-hidden">
            <div className=" mx-auto">

                {/* Scroll Reveal Text */}
                <div className="mb-24 md:mb-36 lg:mb-44 flex justify-center max-w-[80%]  mx-auto">
                    <h5
                        ref={textRef}
                        className="text-[28px] md:text-4xl lg:text-[2.75rem] text-center w-full   leading-[1.3] font-medium tracking-tight"
                    >
                        {textContent.split(" ").map((word, index) => (
                            <span key={index} className="word inline-block mr-[0.25em]">
                                {word}
                            </span>
                        ))}
                    </h5>
                </div>

                {/* Stats Grid */}
                <div className="stats-container grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16 lg:gap-x-16 lg:gap-y-20">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className="stat-col flex flex-col justify-between border-l border-[#D4D4D4] pl-6 lg:pl-8 min-h-[160px] md:min-h-[180px] lg:min-h-[200px]"
                        >
                            <h4 className="text-4xl md:text-[42px] font-normal text-black tracking-tight flex items-baseline flex-wrap gap-x-[0.25em]">
                                {stat.prefix && (
                                    <span className="text-2xl md:text-3xl font-light text-neutral-600 mr-1.5">
                                        {stat.prefix}
                                    </span>
                                )}
                                <span className="stat-num" data-target={stat.target}>0</span>
                                {stat.suffix}
                            </h4>
                            <p className="text-[#555] text-[14px] md:text-[15px] leading-relaxed pr-4">
                                {stat.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stater;
