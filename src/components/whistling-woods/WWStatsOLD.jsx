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
        prefix: "USD ",
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

        // Number Animation
        const statCols = containerRef.current.querySelectorAll('.stat-col');
        statCols.forEach((col) => {
            const num = col.querySelector('.stat-num');
            if (!num) return;
            const target = parseInt(num.getAttribute('data-target'), 10);
            const proxy = { val: 0 };
            gsap.to(proxy, {
                val: target,
                scrollTrigger: {
                    trigger: col,
                    start: "top 90%",
                    end: "top 50%",
                    scrub: true,
                },
                onUpdate: () => {
                    num.innerText = Math.round(proxy.val).toLocaleString('en-US');
                }
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#FAFAFA] py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10  overflow-hidden">
            <div className=" mx-auto">

                {/* Scroll Reveal Text */}
                <div className="mb-16 md:mb-36 lg:mb-44 flex justify-center max-w-[1400px] mx-auto">
                    <h5
                        ref={textRef}
                        className="text-[28px] md:text-4xl lg:text-[2.75rem] max-sm:text-[1.5rem]! max-sm:leading-[1.3]! text-center w-full md:w-4/5 lg:w-2/3 leading-[1.3] font-medium tracking-tight"
                    >
                        {textContent.split(" ").map((word, index) => (
                            <span key={index} className="word inline-block mr-[0.25em]">
                                {word}
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
                                <span className="stat-num" data-target={stat.target}>0</span>
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
