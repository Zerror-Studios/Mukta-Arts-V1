"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const data = [
    {
        title: "Whistling Woods International",
        image: "/img/ma/WhistlingWoods.jpg",
        shortDesc: "Whistling Woods International (WWI) is India’s premier institute for Film, Communication, and Creative Arts. ",
        fullDesc: `● Among the world's ten best film schools, as rated by The Hollywood Reporter, more than once.
● 7 specialised schools under one roof, spanning filmmaking, acting, animation, design, fashion, media and music.
● IIM Mumbai x WWI: India's first MBA in Media & Entertainment from an IIM.
● TISS degrees, with a curriculum shaped by working industry professionals.
●  Built for what's next, with tech labs alongside  Apple, NVIDIA, Epic Games, 
Sony and more. 
●  4,000+ alumni  shaping Indian and global media and entertainment and  1,300 
current students. `,
        photo: "/img/ma/WhistlingWoods.jpg",
        website: "https://www.whistlingwoods.net/",
        pos: "top-[15%] left-[15%]",
        color1: "#c02690",
        color2: "#2d346b"
    },
    {
        title: "Mukta Arts Productions",
        image: "/img/ma/MuktaArtProduction.png",
        shortDesc: "The house behind Karz, Hero, Ram Lakhan, Pardes and Taal, producing 50+ stories that have stayed with Indian audiences since 1978.",
        fullDesc: `
        ●  50+ films  produced and co-produced since 1978, in  Hindi and regional 
languages. 
●  35 blockbusters,  many of which remain among the most  loved films in Indian 
cinema.
●  8 regional films  across Marathi, Bengali, Punjabi and Kannada, including Valu, 
Samhita, Noukadubi and Vijeta. 
●  National Award winner for Iqbal, named Best Film on Other Social Issues. 
●  India's first listed Hindi film company  , the first  to go public on the stock 
exchanges, in 2000.
        `,
        website: "",
        pos: "bottom-[5%] left-[85%]",
        color1: "#a52288",
        color2: "#272a63"
    },
    {
        title: "Mukta VN Films",
        image: "/img/ma/MuktaVNFilms.jpg",
        shortDesc: "Mukta VN Films is Mukta Arts’ film programming and distribution services venture, established in 2014 as a joint venture with UFO Moviez.",
        fullDesc: `
        ●  Around 195 screens  have been programmed nationwide,  across a growing 
network of cinemas. 
●  A trusted partner to cinema operators  , working where  content, exhibition and 
audience demand meet. 
●  A legacy in programming  , rooted in Mukta Arts' earlier Mukta Movies 
Distributors division. 
●  Part of India's multiplex story  ,  having  programmed for PVR, INOX, Cinepolis, 
Big Cinemas, Fame, Fun Cinemas, DT and Carnival Cinemas  in their early 
years.`,
        website: null,
        pos: "top-[5%] right-[0%]",
        color1: "#7e1c79",
        color2: "#202257"
    },
    {
        title: "Mukta A2 Cinemas",
        image: "/img/ma/MuktaA2Cinemas.jpg",
        shortDesc: "Mukta A2 Cinemas is the exhibition arm of Mukta Arts, founded with a vision to make the big- screen experience accessible to audiences across India.",
        fullDesc: `
        ●  57 screens across 19 cities  in India, and growing. 
●  Iconic properties  including New Excelsior in South Mumbai, Sun City in Vile 
Parle, Ratnanjali Square in Ahmedabad, Orbit Plaza in Surat and Konark 70MM 
in Hyderabad. 
●  Big-screen experience, pocket-friendly prices  , making  the multiplex 
accessible beyond metro audiences. 
●  International presence  through a 6-screen multiplex in the Kingdom of Bahrain.
        `,
        website: "https://muktaa2cinemas.in/",
        pos: "bottom-[5%] left-[15%]",
        color1: "#5d186c",
        color2: "#191a4b"
    },
    {
        title: "SGM STUDIOS",
        image: "https://muktaarts.com/Media/uploads/2026/SGM-ANIMATION-STUDIOS-MUKTA-ARTS-LTD-MOU.gif",
        shortDesc: "For SGM Studios the page format won’t work. It’ll have to be an introduction text (below) with a couple of photos I will share that can be placed as a carousel or showreel under.",
        fullDesc: `
       SGM Studios is Mukta Arts' animation and visual storytelling arm, built to carry the company's cinematic legacy into the world of animation and new-age entertainment. The studio develops original, culturally rooted IP, bringing together creative talent and emerging technology to craft visually distinctive worlds and character-driven narratives for audiences across India and beyond. Its work spans animation, digital formats and franchise development, with the ambition of building properties that can travel across film, series and other forms of entertainment, pairing decades of experience in cinema with the creative range of animation. 
        `,
        website: "https://muktaa2cinemas.in/",
        pos: "bottom-[5%] left-[15%]",
        color1: "#5d186c",
        color2: "#191a4b"
    }
];

const finalColors = {
    color1: "#3c1a5e",
    color2: "#881a28"
};

const Elder = () => {
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const titlesRef = useRef([]);
    const popupsRef = useRef([]);
    const finalRef = useRef(null);
    const overlayRef = useRef(null);
    const [activeItem, setActiveItem] = useState(null);
    const scrollTimeout = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (overlayRef.current) {
                overlayRef.current.classList.add('scale-[1.03]');
                overlayRef.current.classList.remove('scale-100');
            }
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = setTimeout(() => {
                if (overlayRef.current) {
                    overlayRef.current.classList.remove('scale-[1.03]');
                    overlayRef.current.classList.add('scale-100');
                }
            }, 150);
        };

        window.addEventListener('wheel', handleScroll, { passive: true });
        window.addEventListener('touchmove', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
            }
        });

        // 1. Text animates from bottom
        tl.fromTo(titlesRef.current,
            { y: 120, opacity: 0 },
            { y: 0, opacity: 0.5, stagger: 0.2, duration: 0.5, ease: "power3.out" }
        );

        // Hold a little bit before continuing
        tl.to({}, { duration: 0.5 });

        data.forEach((item, i) => {
            // Fade in the title
            tl.to(titlesRef.current[i], { color: "#ffffff", opacity: 1, duration: 1 }, `step${i}`);

            // Change background gradient smoothly over the entire scroll of this item
            tl.to(containerRef.current, {
                "--color1": item.color1,
                "--color2": item.color2,
                duration: 3.5,
                ease: "power1.inOut"
            }, `step${i}`);

            // Continuous vertical parallax movement
            tl.fromTo(popupsRef.current[i],
                { y: "100vh" },
                { y: "-100vh", duration: 3.5, ease: "none" },
                `step${i}`
            );

            // Fade in the popup
            tl.fromTo(popupsRef.current[i],
                { autoAlpha: 0, scale: 0.95 },
                { autoAlpha: 1, scale: 1, duration: 1.5, ease: "power2.out" },
                `step${i}`
            );

            // Hold for a bit
            tl.to({}, { duration: 1.5 }, `step${i}+=1`);

            // Fade them out if not the last item
            if (i !== data.length - 1) {
                tl.to(titlesRef.current[i], { color: "#5c6d86", opacity: 0.5, duration: 1 }, `end${i}`);
                tl.to(popupsRef.current[i], { autoAlpha: 0, duration: 1 }, `end${i}`);
            } else {
                // Last item: fade out the whole list and the popup
                tl.to(listRef.current, { autoAlpha: 0, y: -50, duration: 2 }, `end${i}`);
                tl.to(popupsRef.current[i], { autoAlpha: 0, duration: 1 }, `end${i}`);
            }
        });

        // Fade in final text container & change background to final smoothly
        tl.to(containerRef.current, {
            "--color1": finalColors.color1,
            "--color2": finalColors.color2,
            duration: 3,
            ease: "power1.inOut"
        }, "-=1");

        tl.to(finalRef.current, { autoAlpha: 1, duration: 0.1 }, "-=1");

        // Animate words staggered
        tl.to(".final-word", {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out"
        }, "-=1");

        // Hold final text
        tl.to({}, { duration: 2 });

    }, { scope: containerRef, dependencies: [] });

    return (
        <div
            ref={containerRef}
            className="w-full h-[700vh] relative z-[888] text-white overflow-clip"
            style={{
                "--color1": "#0474BA",
                "--color2": "#0474BA",
            }}
        >
            <div
                className="w-full h-[100vh] sticky top-0 left-0 overflow-hidden flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--color1) 0%, var(--color2) 100%)" }}
            >

                {/* Camera Recording Overlay */}
                <div ref={overlayRef} className="absolute inset-0 pointer-events-none z-[880] transition-transform duration-500 ease-out flex items-center justify-center scale-100">
                    {/* Top Left - REC */}
                    <div className="absolute top-6 left-4 md:top-28 md:left-16 flex items-center gap-2 md:gap-3">
                        <div className="w-2 h-2 md:w-4 md:h-4 bg-red-600 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                        <span className="text-white font-mono text-xs md:text-base tracking-widest font-bold">REC</span>
                    </div>

                    {/* Top Right - Specs */}
                    <div className="absolute top-6 right-4 md:top-28 md:right-16 flex items-center gap-2 md:gap-4">
                        <span className="text-white/80 font-mono text-[10px] md:text-sm">4K</span>
                        <span className="text-white/80 font-mono text-[10px] md:text-sm border border-white/40 px-1">60FPS</span>
                        <div className="w-6 h-3 md:w-8 md:h-4 border border-white/60 rounded-sm p-[1px] md:p-[2px] flex">
                            <div className="w-full bg-white/80 rounded-[1px]"></div>
                        </div>
                    </div>

                    {/* Bottom Left - Settings */}
                    <div className="absolute bottom-6 left-4 md:bottom-28 md:left-16 text-white/80 font-mono text-[10px] md:text-sm flex gap-2 md:gap-3">
                        <span>ISO 800</span>
                        <span>F/2.8</span>
                        <span>1/50</span>
                    </div>

                    {/* Bottom Right - Timecode */}
                    <div className="absolute bottom-6 right-4 md:bottom-28 md:right-16 text-white/80 font-mono text-[10px] md:text-sm">
                        TC 01:23:45:12
                    </div>

                    {/* Center Focus Area */}
                    <div className="opacity-40 w-[95%] h-[75%] absolute inset-0 m-auto pointer-events-none">
                        <div className="w-full h-full border border-white/20 relative">
                            {/* Focus Corners */}
                            <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-[3px] border-l-[3px] border-white"></div>
                            <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-[3px] border-r-[3px] border-white"></div>
                            <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-[3px] border-l-[3px] border-white"></div>
                            <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-[3px] border-r-[3px] border-white"></div>

                            {/* Center Dot */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/60 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* List Container */}
                <div className="absolute max-sm:top-1/2  left-4 md:left-12 lg:left-20 md:top-1/2 -translate-y-1/2 z-10 pointer-events-none w-full max-w-[85vw] md:max-w-[55vw]">
                    <div ref={listRef} className="flex flex-col items-start gap-3 md:gap-6">
                        {data.map((item, i) => (
                            <h2
                                key={i}
                                ref={el => titlesRef.current[i] = el}
                                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#7889a1] opacity-50 text-left"
                                style={{ willChange: "transform, opacity, color" }}
                            >
                                {item.title}
                            </h2>
                        ))}
                    </div>
                </div>

                {/* Popups */}
                {data.map((item, i) => (
                    <div
                        key={i}
                        ref={el => popupsRef.current[i] = el}
                        className="absolute right-4 md:right-12 lg:right-24 top-0 z-[888] w-[65vw] sm:w-[50vw] md:w-80 lg:w-[28rem] flex flex-col gap-2 md:gap-3 opacity-0 invisible"
                        style={{ willChange: "transform, opacity" }}
                    >
                        <div className="w-full aspect-video relative overflow-hidden shadow-2xl rounded-sm">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm md:text-lg lg:text-xl mb-1">{item.title}</h3>
                            <p className="text-white/70 text-[10px] md:text-sm line-clamp-3 leading-snug">{item.shortDesc}</p>

                            <div className="flex justify-between items-center mt-2 md:mt-4 relative z-[9999]">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveItem(item); }}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer text-sm md:text-base"
                                >
                                    +
                                </button>
                                {item.website && (
                                    <a
                                        href={item.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-[10px] md:text-xs uppercase tracking-widest border-b border-white/40 hover:border-white text-white/80 hover:text-white transition-colors pb-0.5 cursor-pointer py-1 md:py-2"
                                    >
                                        Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Final Text */}
                <div
                    ref={finalRef}
                    className="absolute z-30 w-full max-w-5xl px-4 md:px-12 opacity-0 invisible pointer-events-none flex flex-col items-center justify-center text-center"
                >
                    <h4 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white/90 flex flex-wrap justify-center text-center gap-x-1.5 md:gap-x-3 gap-y-1 md:gap-y-2">
                        {"For nearly five decades, Mukta Arts has been telling stories that became a part of India’s cultural memory. From iconic films and unforgettable music to cinema, education and new forms of storytelling, Mukta continues to build on a legacy shaped by a belief in the power of the moving image."
                            .split(/\s+/)
                            .map((word, i) => (
                                <span
                                    key={i}
                                    className={`final-word opacity-0 translate-y-8 inline-block ${i >= 4 ? 'text-[#e2a866]' : ''}`}
                                >
                                    {word}
                                </span>
                            ))}
                    </h4>
                </div>

                {/* Sidebar for Full Description */}
                <div
                    className={`fixed top-0 right-0 h-[100dvh] w-full md:w-[50vw] bg-[#0474BA] backdrop-blur-2xl border-l border-white/10 z-[888] transform transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeItem ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto shadow-2xl flex flex-col`}
                >
                    <button
                        onClick={() => setActiveItem(null)}
                        className="absolute top-4 left-4 md:top-8 md:left-8 text-white text-lg md:text-xl font-extralight hover:text-white/60 transition-colors cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full"
                    >
                        ✕
                    </button>

                    <div className="flex-1 overflow-y-auto p-5 pt-20 md:p-16 lg:p-20 flex flex-col">
                        {activeItem && (
                            <>
                                <h2 className={`${activeItem.title?.trim() === "Whistling Woods International" ? "hidden" : ""} text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 tracking-wide`}>{activeItem.title}</h2>

                                {activeItem.photo && (
                                    <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 md:mb-8 flex-shrink-0 shadow-2xl relative border border-white/10 group">
                                        <img
                                            src={activeItem.photo}
                                            alt={activeItem.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                                    </div>
                                )}

                                <div className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg font-light leading-relaxed space-y-4">
                                    {activeItem.fullDesc.split('\n\n').map((block, bIdx) => {
                                        const lines = block.split('\n');
                                        const isBulletList = lines.some(line => /^\s*[●•\-\*]/.test(line));

                                        if (isBulletList) {
                                            return (
                                                <ul key={bIdx} className="space-y-3 pl-1">
                                                    {lines.map((line, lIdx) => {
                                                        const trimmed = line.trim();
                                                        if (!trimmed) return null;
                                                        const isBullet = /^[●•\-\*]/.test(trimmed);
                                                        if (isBullet) {
                                                            const bulletContent = trimmed.replace(/^[●•\-\*]\s*/, '');
                                                            return (
                                                                <li key={lIdx} className="flex items-start gap-3">
                                                                    <span className="text-[#e2a866] text-xs md:text-sm mt-1 flex-shrink-0 select-none">●</span>
                                                                    <span className="flex-1">{bulletContent}</span>
                                                                </li>
                                                            );
                                                        }
                                                        return <p key={lIdx}>{trimmed}</p>;
                                                    })}
                                                </ul>
                                            );
                                        }

                                        return (
                                            <p key={bIdx} className="whitespace-pre-line">
                                                {block}
                                            </p>
                                        );
                                    })}
                                </div>

                                {activeItem.website && (
                                    <div className="mt-8 md:mt-12 mb-4">
                                        <a
                                            href={activeItem.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-white text-black hover:bg-gray-200 text-[10px] md:text-xs lg:text-sm font-medium tracking-[0.2em] uppercase transition-colors"
                                        >
                                            Visit Website
                                        </a>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Elder;