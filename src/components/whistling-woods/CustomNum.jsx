'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const textContent = "From creating some of Hindi cinema’s most iconic films to shaping stories that transcend generations, Mukta Arts has been part of the cultural fabric of Indian cinema for decades. Its body of work is defined by unforgettable characters, landmark storytelling and music that continues to resonate with audiences. A pioneer in the business of Indian cinema, Mukta Arts has continually pushed creative boundaries, building on its cinematic heritage while embracing new possibilities in entertainment.";

const statsData = [
    {
        target: 50,
        prefix: "",
        suffix: "+",
        title: "Films Produced",
        text: "A diverse filmography spanning genres, generations and stories that have left a lasting mark on Indian cinema.",
    },
    {
        target: 35,
        prefix: "",
        suffix: "+",
        title: "Blockbusters",
        text: "Defining cinematic successes that captured audiences and became an enduring part of popular culture.",
    },
    {
        target: 45,
        prefix: "",
        suffix: "+",
        title: "Years of Filmmaking",
        text: "Pioneering the industry through bold storytelling, landmark films and a vision that has continually pushed the boundaries of Indian cinema.",
    },
];

const CustomNum = () => {
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
                <div className="mb-24 md:mb-36 lg:mb-44 flex justify-center max-w-[80%] mx-auto">
                    <h5
                        ref={textRef}
                        className="text-[28px] md:text-4xl lg:text-[2.75rem] text-center w-full leading-[1.3] font-medium tracking-tight"
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
                            <h4 className="text-4xl md:text-[42px] font-normal text-black tracking-tight flex items-baseline">
                                {stat.prefix && (
                                    <span className="text-2xl md:text-3xl font-light text-neutral-600 mr-1.5">
                                        {stat.prefix}
                                    </span>
                                )}
                                <span className="stat-num" data-target={stat.target}>0</span>
                                {stat.suffix}
                            </h4>
                            <div className="pr-4">
                                {stat.title && (
                                    <p className="text-black text-[16px] md:text-[18px] font-medium mb-2">
                                        {stat.title}
                                    </p>
                                )}
                                <p className="text-[#555] text-[14px] md:text-[15px] leading-relaxed">
                                    {stat.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomNum;
