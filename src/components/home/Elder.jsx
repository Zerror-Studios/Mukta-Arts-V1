"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, EASE, DURATION, STAGGER, RISE, MOTION_OK } from '@/lib/motion';

// Copy is word for word from the home page content doc; **double asterisks** mark the
// phrases that are bold there. `link` is an internal page, `website` an external one.
const data = [
    {
        title: "Whistling Woods International",
        image: "/img/final/home/home2/2O5A3438.webp",
        shortDesc: "Whistling Woods International (WWI) is India’s premier institute for Film, Communication, and Creative Arts.",
        bullets: [
            "Among the **world's ten best film schools**, as rated by The Hollywood Reporter, more than once.",
            "**7 specialised schools** under one roof, spanning filmmaking, acting, animation, design, fashion, media and music.",
            "IIM Mumbai x WWI: India's **first MBA in Media & Entertainment** from an IIM.",
            "**TISS degrees**, with a curriculum shaped by working industry professionals.",
            "Built for what's next, with tech labs alongside **Apple, NVIDIA, Epic Games, Sony and more.**",
            "**4,500+ alumni** shaping Indian and global media and entertainment and **1,300+** current students.",
        ],
        photo: "/img/ma/WhistlingWoods.jpg",
        website: "https://www.whistlingwoods.net/",
        color1: "#c02690",
        color2: "#2d346b"
    },
    {
        title: "Mukta Arts Productions",
        image: "/img/final/home/home2/2O5A4368.webp",
        shortDesc: "The house behind Karz, Hero, Ram Lakhan, Pardes and Taal, producing 50+ stories that have stayed with Indian audiences since 1978.",
        bullets: [
            "**50+ films** produced and co-produced since 1978, in Hindi and regional languages.",
            "**35 blockbusters,** many of which remain among the most loved films in Indian cinema.",
            "**8 regional films** across Marathi, Bengali, Punjabi and Kannada, including Valu, Samhita, Noukadubi and Vijeta.",
            "**National Award winner for Iqbal, named Best Film on Other Social Issues.**",
            "**India's first listed Hindi film company**, the first to go public on the stock exchanges, in 2000.",
        ],
        link: "/our-films",
        color1: "#a52288",
        color2: "#272a63"
    },
    // {
    //     title: "Mukta VN Films",
    //     image: "/img/ma/MuktaVNFilms.jpg",
    //     shortDesc: "Mukta VN Films is Mukta Arts’ film programming and distribution services venture, established in 2014 as a joint venture with UFO Moviez.",
    //     bullets: [
    //         "**Around 195 screens** have been programmed nationwide, across a growing network of cinemas.",
    //         "**A trusted partner to cinema operators**, working where content, exhibition and audience demand meet.",
    //         "**A legacy in programming**, rooted in Mukta Arts' earlier Mukta Movies Distributors division.",
    //         "Part of India's multiplex story, having **programmed for PVR, INOX, Cinepolis, Big Cinemas, Fame, Fun Cinemas, DT and Carnival Cinemas** in their early years.",
    //     ],
    //     link: "/mukta-vn-films",
    //     color1: "#7e1c79",
    //     color2: "#202257"
    // },
    {
        title: "Mukta A2 Cinemas",
        image: "/img/final/home/home2/TOPIWALA.webp",
        shortDesc: "Mukta A2 Cinemas is the exhibition arm of Mukta Arts, founded with a vision to make the big-screen experience accessible to audiences across India.",
        // TODO(client): the doc's "Manages XX screens across XX" line still needs the figures
        // from the Mukta A2 content doc; until then the first bullet uses the confirmed 37 cinemas.
        bullets: [
            "**37 Mukta A2 cinemas**, and growing.",
            "**Iconic properties** including New Excelsior in South Mumbai, Sun City in Vile Parle, Ratnanjali Square in Ahmedabad, Orbit Plaza in Surat and Konrak Theatre in Hyderabad.",
            "**Big-screen experience, pocket-friendly prices**, making the multiplex accessible beyond metro audiences.",
            "**International presence** through a 6-screen multiplex in the Kingdom of Bahrain.",
        ],
        website: "https://muktaa2cinemas.in/",
        color1: "#5d186c",
        color2: "#191a4b"
    },
    {
        title: "SGM Studios",
        image: "https://muktaarts.com/Media/uploads/2026/SGM-ANIMATION-STUDIOS-MUKTA-ARTS-LTD-MOU.gif",
        shortDesc: "SGM Studios is Mukta Arts' animation and visual storytelling arm.",
        // No bullets for SGM: the panel carries the introduction, and SGM has no external site
        paragraphs: [
            "SGM Studios is Mukta Arts' animation and visual storytelling arm, built to carry the company's cinematic legacy into the world of animation and new-age entertainment. The studio develops original, culturally rooted IP, bringing together creative talent and emerging technology to craft visually distinctive worlds and character-driven narratives for audiences across India and beyond.",
            "Its work spans animation, digital formats and franchise development, with the ambition of building properties that can travel across film, series and other forms of entertainment, pairing decades of experience in cinema with the creative range of animation.",
        ],
        color1: "#5d186c",
        color2: "#191a4b"
    }
];

// "**bold** rest" -> text with <strong> runs
const rich = (text) =>
    text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
        part.startsWith("**") ? (
            <strong key={i} className="font-['SwitzerSB'] font-normal text-white">{part.slice(2, -2)}</strong>
        ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
        )
    );

// The closing paragraph, split into its bold and regular runs (bold as in the content doc)
const finalCopy = [
    { text: "For nearly five decades,", bold: true },
    { text: "Mukta Arts has been telling stories that became a part of India’s cultural memory. From iconic films and unforgettable music to cinema, education and new forms of storytelling,", bold: false },
    { text: "Mukta continues to build on a legacy shaped by a belief in the power of the moving image.", bold: true },
];

const finalColors = {
    color1: "#3c1a5e",
    color2: "#881a28"
};

// Timeline length of one item. At SCROLL_PER_UNIT one item gets ~144vh of scroll, about what a
// popup travels (100vh plus its own height), so it moves with the scroll.
const ITEM_SPAN = 8;
const SCROLL_PER_UNIT = 18; // vh of scroll per second of timeline
// The intro and the closing words take ~10 more timeline seconds; the last 100vh is the sticky screen
const SECTION_HEIGHT = `${(data.length * ITEM_SPAN + 10) * SCROLL_PER_UNIT + 100}vh`;

const Elder = () => {
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const titlesRef = useRef([]);
    const popupsRef = useRef([]);
    const finalRef = useRef(null);
    const overlayRef = useRef(null);
    const panelRef = useRef(null);
    const [activeItem, setActiveItem] = useState(null);
    const scrollTimeout = useRef(null);

    // The opened panel builds in with the section's own rise: photo/title, intro, then each bullet
    useGSAP(() => {
        if (!activeItem) return;
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            gsap.fromTo(
                ".panel-reveal",
                { autoAlpha: 0, y: RISE },
                { autoAlpha: 1, y: 0, duration: DURATION, ease: EASE, stagger: STAGGER, delay: 0.3 }
            );
        });
    }, { scope: panelRef, dependencies: [activeItem] });

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

            // The popup rises from just below the screen to just above it (100vh + its own height)
            // across the whole item, so it moves at roughly the scroll's own speed (see SECTION_HEIGHT)
            tl.fromTo(popupsRef.current[i],
                { y: "100vh", yPercent: 0 },
                { y: 0, yPercent: -100, duration: ITEM_SPAN, ease: "none" },
                `step${i}`
            );

            // Fade in the popup
            tl.fromTo(popupsRef.current[i],
                { autoAlpha: 0, scale: 0.95 },
                { autoAlpha: 1, scale: 1, duration: 1.5, ease: "power2.out" },
                `step${i}`
            );

            // Hand over to the next item as this popup leaves the top of the screen
            tl.addLabel(`end${i}`, `step${i}+=${ITEM_SPAN - 1.5}`);

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
            className="w-full relative z-[888] text-white overflow-clip"
            style={{
                height: SECTION_HEIGHT,
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
                                // Sized to the column so the longest name sits on one line at every width (on phones a
                                // break would leave a word alone); text-balance is the fallback on very narrow screens.
                                // `!` because the global h2 size in fonts.css is unlayered and would win over the utilities.
                                className="text-[6.3vw]! leading-[1.1]! md:text-[3.4rem]! lg:text-[3.9rem]! lg:whitespace-nowrap text-balance font-bold tracking-tight text-[#7889a1] opacity-50 text-left"
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
                                {item.link && (
                                    <Link
                                        href={item.link}
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-2 bg-[#0474BA] hover:bg-[#0666a1] text-white px-4 py-2 md:px-6 md:py-2.5 text-[10px] md:text-sm tracking-wider font-semibold rounded-[3px] transition-all duration-300 shadow-md hover:shadow-lg group cursor-pointer"
                                    >
                                        <span>View More</span>
                                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                )}
                                {item.website && (
                                    <a
                                        href={item.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                    className="absolute z-30 w-full max-w-7xl px-4 md:px-12 opacity-0 invisible pointer-events-none flex flex-col items-center justify-center text-center"
                >
                    {/* Wide and set smaller, so it reads in four or five lines on a 15" laptop */}
                    <h4 className="text-[1.6rem]! leading-[1.25]! md:text-[2.4rem]! md:leading-[1.25]! font-normal text-white/90 flex flex-wrap justify-center text-center gap-x-1.5 md:gap-x-[0.28em] gap-y-1 md:gap-y-1.5">
                        {finalCopy.flatMap((run, r) =>
                            run.text.split(/\s+/).map((word, i) => (
                                <span
                                    key={`${r}-${i}`}
                                    className={`final-word opacity-0 translate-y-8 inline-block ${run.bold ? "font-['SwitzerB'] text-white" : "font-['SwitzerM'] text-[#e2a866]"}`}
                                >
                                    {word}
                                </span>
                            ))
                        )}
                    </h4>
                </div>

                {/* Sidebar for Full Description */}
                <div
                    ref={panelRef}
                    className={`fixed top-0 right-0 h-[100dvh] w-full md:w-[50vw] bg-[#0474BA] backdrop-blur-2xl border-l border-white/10 z-[888] transform transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeItem ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto shadow-2xl flex flex-col`}
                >
                    <button
                        onClick={() => setActiveItem(null)}
                        className="absolute top-20 left-4 md:top-24 md:left-8 text-white text-lg md:text-xl font-extralight hover:text-white/60 transition-colors cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full"
                    >
                        ✕
                    </button>

                    <div data-lenis-prevent className="flex-1 overflow-y-auto p-5 pt-36 md:p-16 md:pt-40 lg:p-20 lg:pt-40 flex flex-col">
                        {activeItem && (
                            <>
                                {/* A photo stands in for the title where there is one, so the name is not repeated */}
                                {!activeItem.photo && (
                                    <h2 className="panel-reveal text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 tracking-wide">{activeItem.title}</h2>
                                )}

                                {activeItem.photo && (
                                    <div className="panel-reveal w-full aspect-video rounded-xl overflow-hidden mb-6 md:mb-8 flex-shrink-0 shadow-2xl relative border border-white/10 group">
                                        <img
                                            src={activeItem.photo}
                                            alt={activeItem.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                                    </div>
                                )}

                                <div className="text-white/80 text-sm md:text-base lg:text-lg font-light leading-relaxed space-y-5">
                                    <div className="panel-reveal text-white text-base md:text-lg lg:text-xl leading-snug font-['SwitzerM']">
                                        {activeItem.shortDesc}
                                    </div>

                                    {activeItem.bullets && (
                                        <ul className="space-y-3 md:space-y-4 pl-1">
                                            {activeItem.bullets.map((bullet, i) => (
                                                <li key={i} className="panel-reveal flex items-start gap-3">
                                                    <span className="text-[#e2a866] text-[0.6em] mt-[0.55em] flex-shrink-0 select-none" aria-hidden="true">●</span>
                                                    <span className="flex-1">{rich(bullet)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {activeItem.paragraphs?.map((para, i) => (
                                        <div key={i} className="panel-reveal">{para}</div>
                                    ))}
                                </div>

                                {(activeItem.link || activeItem.website) && (
                                    <div className="panel-reveal mt-8 md:mt-12 mb-4 flex flex-wrap items-center gap-4">
                                        {activeItem.link && (
                                            <Link
                                                href={activeItem.link}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white text-black hover:bg-gray-200 text-[10px] md:text-xs lg:text-sm font-medium tracking-[0.2em] uppercase transition-colors group"
                                            >
                                                View More
                                                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                            </Link>
                                        )}
                                        {activeItem.website && (
                                            <a
                                                href={activeItem.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-white text-black hover:bg-gray-200 text-[10px] md:text-xs lg:text-sm font-medium tracking-[0.2em] uppercase transition-colors"
                                            >
                                                Visit Website
                                            </a>
                                        )}
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