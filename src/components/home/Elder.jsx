"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, EASE, DURATION, STAGGER, RISE, MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { smoothScrollTo } from '@/lib/smoothScroll';

// Copy is word for word from the home page content doc; **double asterisks** mark the
// phrases that are bold there. `link` is an internal page, `website` an external one.
const data = [
    {
        title: "Mukta A2 Cinemas",
        image: "/img/final/home/home2/TOPIWALA.webp",
        shortDesc: "Mukta A2 Cinemas is the exhibition arm of Mukta Arts, founded with a vision to make the big-screen experience accessible to audiences across India.",
        // TODO(client): the doc's last line, "Manage XX screens across XX", is left out until it has figures
        bullets: [
            "**57 screens across 19 cities** in India, and growing.",
            "**Iconic properties** including New Excelsior in South Mumbai, Sun City in Vile Parle, Ratnanjali Square in Ahmedabad, Orbit Plaza in Surat and Konark 70MM in Hyderabad.",
            "**Big-screen experience, pocket-friendly prices**, making the multiplex accessible beyond metro audiences.",
            "**International presence** through a 6-screen multiplex in the Kingdom of Bahrain.",
        ],
        website: "https://muktaa2cinemas.in/",
        // Each company has its own palette colour, flat so it reads as that colour
        color1: "#1F1056",
        color2: "#1F1056"
    },
    {
        title: "SGM Studios",
        // The SGM Studios signing frame of the old muktaarts.com GIF, now served locally
        image: "/img/final/SGM/SGM_Studios_MOU.webp",
        shortDesc: "SGM Studios is Mukta Arts' animation and visual storytelling arm.",
        // No bullets for SGM: the panel carries the introduction, and SGM has no external site
        paragraphs: [
            "SGM Studios is Mukta Arts' animation and visual storytelling arm, built to carry the company's cinematic legacy into the world of animation and new-age entertainment. The studio develops original, culturally rooted IP, bringing together creative talent and emerging technology to craft visually distinctive worlds and character-driven narratives for audiences across India and beyond.",
            "Its work spans animation, digital formats and franchise development, with the ambition of building properties that can travel across film, series and other forms of entertainment, pairing decades of experience in cinema with the creative range of animation.",
        ],
        color1: "#DF4819",
        color2: "#DF4819"
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
        // The palette's steel blue rather than its light blue (#9EB9E6), which white text can't sit on
        color1: "#597D9B",
        color2: "#597D9B"
    },
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
            "**4,500+ alumni** shaping Indian and global media and entertainment and **1,300** current students.",
        ],
        photo: "/img/ma/WhistlingWoods.jpg",
        website: "https://www.whistlingwoods.net/",
        color1: "#c02690",
        color2: "#2d346b",
        BOTTOMIMG: "/img/final/home/WWI_Philosophy_Lockup_Transparent.png"
    },
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

// Timeline length of one item. At SCROLL_PER_UNIT one item gets ~144vh of scroll, about what a
// popup travels (100vh plus its own height), so it moves with the scroll.
const ITEM_SPAN = 8;
const SCROLL_PER_UNIT = 18; // vh of scroll per second of timeline
// The intro takes ~2 more timeline seconds; the last 100vh is the sticky screen. The section ends as
// the last popup leaves, so it unpins on the last company rather than an empty screen.
// Names other than the active one: translucent white, which reads on every company colour
const DIM = 0.35;
const SECTION_HEIGHT = `${(data.length * ITEM_SPAN + 2) * SCROLL_PER_UNIT + 100}vh`;

// Tailwind's md: the pinned scroll story from here up, the dropdown list below it
const DESKTOP = "(min-width: 768px)";
const PHONE = "(max-width: 767px)";
const PANEL_TIME = 0.6; // s; a dropdown opening or closing
const HEADER_CLEARANCE = 96; // px; the fixed header's height, with a little room

// WWI's two colours as a gradient; the others are flat
const swatch = (item) => `linear-gradient(135deg, ${item.color1} 0%, ${item.color2} 100%)`;

/* ---------- phones: one company, a name that drops down to what the desktop sidebar shows ---------- */

const CompanyRow = ({ item, index, isOpen, isDimmed, onToggle, rowRef }) => {
    const panelRef = useRef(null);
    const mounted = useRef(false);

    // Same height tween as the other dropdowns on the site; the panel starts closed from its classes
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        const panel = panelRef.current;
        const instant = window.matchMedia(MOTION_REDUCED).matches;
        gsap.to(panel, {
            height: isOpen ? "auto" : 0,
            autoAlpha: isOpen ? 1 : 0,
            duration: instant ? 0 : PANEL_TIME,
            ease: isOpen ? EASE : "power2.inOut",
            overwrite: "auto",
        });
        if (isOpen && !instant) {
            gsap.fromTo(
                panel.querySelectorAll("[data-panel-item]"),
                { autoAlpha: 0, y: RISE },
                { autoAlpha: 1, y: 0, duration: DURATION, ease: EASE, stagger: STAGGER, delay: 0.1 }
            );
        }
    }, [isOpen]);

    const buttonId = `elder-company-${index}`;
    const panelId = `${buttonId}-panel`;

    return (
        <div ref={rowRef} className="relative border-b border-white/15">
            {/* The company's colour draws across the top of the open row */}
            <span
                aria-hidden="true"
                className={`absolute -top-px left-0 h-[3px] w-full origin-left transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? "scale-x-100" : "scale-x-0"}`}
                style={{ background: swatch(item) }}
            />

            {/* `!` because the global h2 size in fonts.css is unlayered and would win over the utilities */}
            <h2 className="text-[clamp(1.625rem,7.2vw,2.5rem)]! leading-[1.1]! font-bold tracking-tight">
                <button
                    type="button"
                    id={buttonId}
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 py-6 text-left cursor-pointer outline-none focus-visible:bg-white/5"
                >
                    <span className={`text-balance transition-opacity duration-500 ${isDimmed ? "opacity-40" : "opacity-100"}`}>
                        {item.title}
                    </span>
                    <span aria-hidden="true" className="relative grid place-items-center flex-shrink-0 w-10 h-10 rounded-full border border-white/40 overflow-hidden">
                        <span
                            className={`absolute inset-0 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                            style={{ background: swatch(item) }}
                        />
                        <Plus strokeWidth={1.5} className={`relative w-5 h-5 transition-transform duration-500 ease-out ${isOpen ? "rotate-45" : ""}`} />
                    </span>
                </button>
            </h2>

            {/* invisible while closed, so its links are not tabbed to */}
            <div
                ref={panelRef}
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="h-0 overflow-hidden invisible opacity-0"
            >
                <div className="pb-10 flex flex-col gap-5 text-white/80 text-sm font-light leading-relaxed">
                    <div data-panel-item className="w-full aspect-video relative overflow-hidden shadow-2xl rounded-sm">
                        <img loading="lazy" src={item.image} alt={item.title} decoding="async" className="w-full h-full object-cover" />
                    </div>

                    <div data-panel-item className="text-white text-base leading-snug font-['SwitzerM']">
                        {item.shortDesc}
                    </div>

                    {item.bullets && (
                        <ul className="space-y-3 pl-1">
                            {item.bullets.map((bullet, i) => (
                                <li key={i} data-panel-item className="flex items-start gap-3">
                                    <span className="text-[#e2a866] text-[0.6em] mt-[0.55em] flex-shrink-0 select-none" aria-hidden="true">●</span>
                                    <span className="flex-1">{rich(bullet)}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {item.paragraphs?.map((para, i) => (
                        <div key={i} data-panel-item>{para}</div>
                    ))}

                    {item.BOTTOMIMG && (
                        <img
                            data-panel-item
                            src={item.BOTTOMIMG}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            className="mt-2 w-full max-w-[80%] h-auto object-contain object-left"
                        />
                    )}

                    {(item.link || item.website) && (
                        <div data-panel-item className="mt-2 flex flex-wrap items-center gap-3">
                            {item.link && (
                                <Link
                                    href={item.link}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors group"
                                >
                                    View More
                                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            )}
                            {item.website && (
                                <a
                                    href={item.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-gray-200 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors"
                                >
                                    Visit Website
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// The pinned story needs the names and the popups side by side, which a phone has no room for
const ElderMobile = () => {
    const sectionRef = useRef(null);
    const rowsRef = useRef([]);
    const toggled = useRef(false);
    // One company open at a time; all start closed
    const [openIndex, setOpenIndex] = useState(null);

    // The names rise in as the list comes into view
    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(`${PHONE} and ${MOTION_OK}`, () => {
            gsap.fromTo(
                rowsRef.current,
                { autoAlpha: 0, y: RISE },
                {
                    autoAlpha: 1, y: 0, duration: DURATION, ease: EASE, stagger: STAGGER,
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
                }
            );
        });
    }, { scope: sectionRef });

    // Once the panels have settled: the scroll triggers further down measure the new page height,
    // and a name pushed up under the header by a panel closing above it comes back into view
    useEffect(() => {
        if (!toggled.current) {
            toggled.current = true;
            return;
        }
        const settle = gsap.delayedCall(PANEL_TIME + 0.05, () => {
            ScrollTrigger.refresh();
            if (openIndex === null) return;
            const top = rowsRef.current[openIndex].getBoundingClientRect().top;
            if (top < HEADER_CLEARANCE) smoothScrollTo(window.scrollY + top - HEADER_CLEARANCE);
        });
        return () => settle.kill();
    }, [openIndex]);

    const toggle = (i) => setOpenIndex((current) => (current === i ? null : i));

    return (
        <div ref={sectionRef} className="md:hidden w-full relative z-[888] bg-[#1B123D] text-white px-4 sm:px-8 py-20">
            <div className="border-t border-white/15">
                {data.map((item, i) => (
                    <CompanyRow
                        key={item.title}
                        item={item}
                        index={i}
                        isOpen={openIndex === i}
                        isDimmed={openIndex !== null && openIndex !== i}
                        onToggle={() => toggle(i)}
                        rowRef={(el) => (rowsRef.current[i] = el)}
                    />
                ))}
            </div>
        </div>
    );
};

/* ---------- laptops and up: the pinned scroll story ---------- */

const ElderDesktop = () => {
    const containerRef = useRef(null);
    const titlesRef = useRef([]);
    const popupsRef = useRef([]);
    const bgRef = useRef(null);
    const panelRef = useRef(null);
    const [activeItem, setActiveItem] = useState(null);

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

    useGSAP(() => {
        // Only where this layout shows; phones get ElderMobile
        const mm = gsap.matchMedia();
        mm.add(DESKTOP, () => {
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
                { y: 0, opacity: DIM, stagger: 0.2, duration: 0.5, ease: "power3.out" }
            );

            // Hold a little bit before continuing
            tl.to({}, { duration: 0.5 });

            data.forEach((item, i) => {
                // Fade in the title
                tl.to(titlesRef.current[i], { opacity: 1, duration: 1 }, `step${i}`);

                // Change background gradient smoothly over the entire scroll of this item
                tl.to(bgRef.current, {
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

                tl.to(popupsRef.current[i], { autoAlpha: 0, duration: 1 }, `end${i}`);
                // The last name stays lit as the section scrolls away
                if (i !== data.length - 1) {
                    tl.to(titlesRef.current[i], { opacity: DIM, duration: 1 }, `end${i}`);
                }
            });
        });
    }, { scope: containerRef, dependencies: [] });

    return (
        <div
            ref={containerRef}
            className="hidden md:block w-full relative z-[888] text-white overflow-clip"
            style={{ height: SECTION_HEIGHT }}
        >
            <div className="w-full h-[100vh] sticky top-0 left-0 overflow-hidden flex items-center justify-center">

                {/* The gradient sits on its own empty layer: its colours change on every scroll frame, and
                    on the section itself that would restyle every element inside it each time */}
                <div
                    ref={bgRef}
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        "--color1": "#1B123D",
                        "--color2": "#1B123D",
                        background: "linear-gradient(135deg, var(--color1) 0%, var(--color2) 100%)",
                    }}
                />

                {/* List Container */}
                <div className="absolute top-1/2 left-4 md:left-12 lg:left-20 -translate-y-1/2 z-10 pointer-events-none w-full max-w-[85vw] md:max-w-[55vw]">
                    <div className="flex flex-col items-start gap-3 md:gap-6">
                        {data.map((item, i) => (
                            <h2
                                key={i}
                                ref={el => titlesRef.current[i] = el}
                                // Sized to the column so the longest name sits on one line at every width (on phones a
                                // break would leave a word alone); text-balance is the fallback on very narrow screens.
                                // `!` because the global h2 size in fonts.css is unlayered and would win over the utilities.
                                className="text-[6.3vw]! leading-[1.1]! md:text-[3.4rem]! lg:text-[3.9rem]! lg:whitespace-nowrap text-balance font-bold tracking-tight text-white opacity-35 text-left"
                                style={{ willChange: "transform, opacity" }}
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
                            <img loading="lazy" src={item.image} alt={item.title} decoding="async" className="w-full h-full object-cover" />
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
                                        className="inline-flex items-center gap-2 bg-[#1B123D] hover:bg-[#2A1D5C] text-white px-4 py-2 md:px-6 md:py-2.5 text-[10px] md:text-sm tracking-wider font-semibold rounded-[3px] transition-all duration-300 shadow-md hover:shadow-lg group cursor-pointer"
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


                {/* Sidebar for Full Description */}
                <div
                    ref={panelRef}
                    className={`fixed top-0 right-0 h-[100dvh] w-full md:w-[50vw] bg-[#1B123D] border-l border-white/10 z-[888] transform transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeItem ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto shadow-2xl flex flex-col`}
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
                                            loading="lazy"
                                            decoding="async"
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

                                {activeItem.BOTTOMIMG && (
                                    <img
                                        src={activeItem.BOTTOMIMG}
                                        alt=""
                                        aria-hidden="true"
                                        loading="lazy"
                                        decoding="async"
                                        className="panel-reveal mt-8 md:mt-12 w-full max-w-[80%] mx-auto h-auto object-contain object-left"
                                    />
                                )}

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

const Elder = () => (
    <>
        <ElderDesktop />
        <ElderMobile />
    </>
);

export default Elder;