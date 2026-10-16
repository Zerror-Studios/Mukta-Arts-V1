'use client'

import React, { useRef } from 'react';
import useEntrance from '@/hooks/useEntrance';
import useScrollReveal from '@/hooks/useScrollReveal';

// Copy is the Mukta VN Films text from the home page content doc (same as the home
// ecosystem panel). **double asterisks** mark the phrases that are bold there.
// TODO(client): any copy written only for this page still has to come from the client.
const intro =
    "Mukta VN Films is Mukta Arts’ film programming and distribution services venture, established in 2014 as a joint venture with UFO Moviez.";

const details = [
    { label: "Established", value: "2014" },
    { label: "Partner", value: "Joint venture with UFO Moviez" },
    { label: "Focus", value: "Film programming & distribution services" },
];

const highlights = [
    "**Around 195 screens** have been programmed nationwide, across a growing network of cinemas.",
    "**A trusted partner to cinema operators**, working where content, exhibition and audience demand meet.",
    "**A legacy in programming**, rooted in Mukta Arts' earlier Mukta Movies Distributors division.",
    "Part of India's multiplex story, having **programmed for PVR, INOX, Cinepolis, Big Cinemas, Fame, Fun Cinemas, DT and Carnival Cinemas** in their early years.",
];

const renderBold = (text) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? <strong key={i} className="font-semibold text-black">{part}</strong> : part
    );

const MNFILMS = () => {
    const containerRef = useRef(null);
    const highlightsRef = useRef(null);

    // Title word by word, the rule draws in, then the copy line by line (shared with every inner page)
    useEntrance(containerRef);
    useScrollReveal(highlightsRef);

    return (
        <>
            <section ref={containerRef} className="relative w-full h-screen min-h-[700px] flex flex-col bg-black overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <img
                        src="https://images.unsplash.com/photo-1632187989763-c9c620420b4d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                        className="object-cover w-full h-full object-center"
                    />
                    {/* Dark overlay to ensure text and logo readability */}
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full h-full mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-between py-12 md:py-20 lg:py-24">

                    {/* Top Spacer & Center Title */}
                    <div className="flex-1 flex items-center justify-center">
                        <h2 data-entrance="words" className="text-white uppercase text-center">Mukta VN Films</h2>
                    </div>

                    {/* Bottom Section */}
                    <div className="w-full">
                        {/* Divider Line */}
                        <div data-entrance="line" className="w-full h-[1px] bg-white/30 mb-10 md:mb-12"></div>

                        {/* Content Columns */}
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">

                            {/* Left Side: Description */}
                            <div className="flex flex-col gap-8 max-w-[440px]">
                                <p data-entrance="lines" className="text-white text-[15px] md:text-[17px] leading-[1.6]">
                                    {intro}
                                </p>
                            </div>

                            {/* Right Side: Details Grid */}
                            <dl data-entrance="rise" className="flex flex-col gap-3.5 text-white lg:min-w-[400px]">
                                {details.map(({ label, value }) => (
                                    <div key={label} className="grid grid-cols-[100px_1fr] gap-4">
                                        <dt className="text-[#A0A0A0] text-[13px] md:text-[14.5px]">{label}:</dt>
                                        <dd className="text-white text-[13px] md:text-[14.5px]">{value}</dd>
                                    </div>
                                ))}
                            </dl>

                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section ref={highlightsRef} className="bg-[#FAFAFA] py-24 md:py-32 px-4 md:px-8 lg:px-10">
                <h2 data-reveal="words" className="text-3xl! md:text-5xl! font-semibold tracking-tight text-black mb-16 md:mb-20">
                    Highlights
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-16">
                    {highlights.map((text, i) => (
                        <li key={i} data-reveal="rise" className="border-l border-[#D4D4D4] pl-6 lg:pl-8">
                            <span className="block font-mono text-xs tracking-[0.2em] text-[#1B123D] mb-4">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <p className="text-[#555] text-base! md:text-lg! leading-relaxed max-w-[560px]">
                                {renderBold(text)}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
};

export default MNFILMS;
