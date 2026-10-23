


"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { smoothScrollTo } from '@/lib/smoothScroll';

// Backgrounds are 2560px copies of the campaign photos in W2/ (up to 7952px there)

const UNIQUE_DATA = [
    {
        year: '2006',
        image: '/img/final/WW/W2/web/WHISTLING%20WOODS%20CAMPAIGN%2009.04_1.webp',
        text: '· Located in the heart of filmcity, Mumbai. Founded by Subhash Ghai.\n\n· Introduced India’s first programme for Producers.\n\n· Introduced India’s first long-term full-time programme in Animation.',
    },
    {
        year: '2008',
        image: '/img/final/WW/W2/web/WHISTLING%20WOODS%20CAMPAIGN%2009.04_8.webp',
        text: '· Launched India’s 1st MBA in Media & Entertainment.',
    },
    {
        year: '2010',
        image: '/img/final/WW/W2/web/110.webp',
        text: '· Recognised as one of the top 10 film schools globally by the Hollywood Reporter.\n\n· Received CILECT membership, a mark of global credibility and excellence in film & media education.',
    },
    {
        year: '2011',
        image: '/img/final/WW/W2/web/WHISTLING%20WOODS%20CAMPAIGN%2009.04_17.webp',
        text: '· Partnered with Sony to set up the Sony Media Technology Centre.\n\n· Expansion to Media Management Programmes at UG & PG levels',
    },
    {
        year: '2013',
        image: '/img/final/WW/W2/web/30.webp',
        text: '· Expansion to commence Fashion Design education, in association with Neeta Lulla.',
    },
    {
        year: '2014',
        image: '/img/final/WW/W2/web/1L0.webp',
        text: "· Partnered with the Tata Institute of Social Sciences (TISS) to offer UG & PG degree.\n\n· Launched India’s first UG applied arts degrees in Filmmaking, Acting & Music programmes.",
    },
    {
        year: '2015',
        image: '/img/final/WW/W2/web/220.webp',
        text: '· Partnered with FoxConn to set up the FoxConn Media Lab to broaden the scope of education in the creation of digital content for UGC (User Generated Content) platforms.\n\n· Partnered with Google to set up the YouTube Space & YouTube Educator Lab at the WWI Mumbai campus.',
    },
    {
        year: '2016',
        image: '/img/final/WW/W2/web/330.webp',
        text: '· Partnered with REDucation platform to become India’s first institute to have DSMC2 cameras.',
    },
    {
        year: '2018',
        image: '/img/final/WW/W2/web/440.webp',
        text: '· Partnered with Reliance Jio to set up the WWI Jio VR Lab.\n\n· First in India to introduce 8k Cinematography, in association with RED.\n\n· WWI hosts the CILECT World Congress, first time in India.\n\n· Recognised with the excellence in creative & performing arts award at the 6th FICCI Higher Education Excellence Award.',
    },
    {
        year: '2019',
        image: '/img/final/WW/W2/web/50.webp',
        text: '· Institutional partner to Apple for ‘Shot on iPhone’ education.',
    },
    {
        year: '2020',
        image: '/img/final/WW/W2/web/55..tiff0.webp',
        text: '· Established the WWI Emerging Media Lab for Virtual Production, Motion Capture, Photogrammetry & Volumetric Capture.',
    },
    {
        year: '2022',
        image: '/img/final/WW/W2/web/6L0.webp',
        text: '· Partnered with the Epic Games, the creator of unreal engine for 3D creation tools.\n\n· Partnered with the Disguise for integrated video & media server technology used in live events, broadcast & virtual production.',
    },
    {
        year: '2024',
        image: '/img/final/WW/W2/web/7L0.webp',
        text: '· Partnered with Intel to livestream the 2024 Paris Olympics in 8k.\n\n· Meghna Ghai Puri, President, WWI has been welcomed into the prestigious EMMY Academy – a global community of creative visionaries shaping the future of television and media.\n\n· Chaitanya Chinchlikar, Vice President & CTO, WWI received the SMPTE EXCELLENCE in education.',
    },
    {
        year: '2025',
        image: '/img/final/WW/W2/web/90.webp',
        text: 'FICCI BAF Awards 2025: Our Students Shine with 3 Prestigious Wins!\n\n· Best Student Animation Film\n\n· Best Student Game\n\n· Best Student VFX Work',
    },
    {
        year: '2026',
        image: '/img/final/WW/W2/web/WHISTLING%20WOODS%20CAMPAIGN%2009.04_18.webp',
        text: 'WWI partners with IIM Mumbai to launch India’s first MBA in Creative Industries, shaping future leaders at the intersection of business and entertainment.',
    },
];

const N = UNIQUE_DATA.length;

/* ---------- Tuning knobs ---------- */
const SCROLL_DRIVEN = true;   // true = section pins and scrolling rotates the wheel. false = click only
const SCROLL_VH = 55;         // scroll distance (in vh) per year while pinned
const STEP = 16.5;            // degrees between two years on the wheel
const ARC_TOP = 170;          // y position (px, inside the stage) of the active dot
const ACCENT = '#d1582b';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Makes every year "dwell" in the centre for a bit, then glide to the next one
const dwell = (x) => {
    const i = Math.floor(x);
    const f = x - i;
    let g = clamp((f - 0.25) / 0.5, 0, 1);
    g = g * g * (3 - 2 * g);
    return i + g;
};

const WWMilestones = () => {
    const sectionRef = useRef(null);
    const wheelRef = useRef(null);
    const rafRef = useRef(0);
    const currentRef = useRef(SCROLL_DRIVEN ? 0 : 4);
    const targetRef = useRef(SCROLL_DRIVEN ? 0 : 4);

    const [active, setActive] = useState(SCROLL_DRIVEN ? 0 : 4);
    const [vw, setVw] = useState(1260);

    // Wheel radius follows the screen width (≈707px at 1260px wide, like the design)
    const R = clamp(vw * 0.56, 380, 780);

    // Phones: pull the arc up and tighten the gaps so the description fits in one screen
    const isMobile = vw < 768;
    const arcTop = isMobile ? 125 : ARC_TOP;
    const descGap = isMobile ? 110 : 140;

    const applyRotation = () => {
        if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${-currentRef.current * STEP}deg)`;
        }
    };

    // Smoothly chase the target position (scroll "scrub" with easing)
    const kick = useCallback(() => {
        if (rafRef.current) return;
        const reduce =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const tick = () => {
            const diff = targetRef.current - currentRef.current;
            if (Math.abs(diff) < 0.0008) {
                currentRef.current = targetRef.current;
                applyRotation();
                setActive(Math.round(currentRef.current));
                rafRef.current = 0;
                return;
            }
            currentRef.current += diff * (reduce ? 1 : 0.085);
            applyRotation();
            const idx = Math.round(currentRef.current);
            setActive((p) => (p === idx ? p : idx));
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    // Viewport width
    useEffect(() => {
        const onResize = () => setVw(window.innerWidth);
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Scroll -> target index
    useEffect(() => {
        applyRotation();
        if (!SCROLL_DRIVEN) return;

        const onScroll = () => {
            const el = sectionRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const total = el.offsetHeight - window.innerHeight;
            if (total <= 0) return;
            const p = clamp(-rect.top / total, 0, 1);
            targetRef.current = dwell(p * (N - 1));
            kick();
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        };
    }, [kick]);

    const handleDotClick = (i) => {
        if (i === active) return;

        if (SCROLL_DRIVEN && sectionRef.current) {
            // Scroll to the matching position so scroll + click stay in sync
            const el = sectionRef.current;
            const total = el.offsetHeight - window.innerHeight;
            const top = el.getBoundingClientRect().top + window.scrollY + (i / (N - 1)) * total;
            smoothScrollTo(top);
        } else {
            targetRef.current = i;
            kick();
        }
    };

    const paragraphs = UNIQUE_DATA[active]?.text.split('\n\n') || [];

    return (
        <section
            ref={sectionRef}
            className="relative text-white"
            style={{
                backgroundColor: '#2b6aab',
                height: SCROLL_DRIVEN ? `calc(100vh + ${(N - 1) * SCROLL_VH}vh)` : undefined,
            }}
        >
            <div
                className={
                    SCROLL_DRIVEN
                        ? 'sticky top-0 overflow-hidden'
                        : 'relative overflow-hidden pb-10'
                }
                style={SCROLL_DRIVEN ? { height: '100svh', minHeight: isMobile ? undefined : 680 } : undefined}
            >
                {/* Dynamic Milestone Background Crossfade */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none ">
                    {UNIQUE_DATA.map((item, i) => (
                        <div
                            key={item.year}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${active === i ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={item.image}
                                alt={`${item.year} Milestone Background`}
                                loading={i <= 1 ? 'eager' : 'lazy'}
                                className={`w-full h-full object-cover object-center transition-transform duration-1000 ease-out ${active === i ? 'scale-100' : 'scale-105'
                                    }`}
                            />
                        </div>
                    ))}

                    {/* Cinematic Gradient & Vignette Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(ellipse at center, rgba(30, 80, 140, 0.72) 0%, rgba(18, 48, 86, 0.88) 60%, rgba(10, 26, 48, 0.96) 100%)',
                        }}
                    />

                    {/* Brand Blue Tint Blend */}
                    <div className="absolute inset-0 bg-[#1e5288]/40 mix-blend-multiply" />

                    {/* Soft Edge Blends */}
                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#143d68]/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0a203a]/90 to-transparent" />
                </div>

                {/* Header */}
                <div
                    className="relative z-10 text-center px-4 mx-auto max-w-5xl  max-sm:mt-30"
                    style={{ paddingTop: isMobile ? 'clamp(20px, 5svh, 48px)' : 'clamp(28px, 8vh, 80px)' }}
                >
                    {/* <h2
                        className="font-medium  tracking-tight mb-5"
                        style={{ fontSize: 'clamp(28px, 3.3vw, 44px)' }}
                    >
                        WWI Milestones — From Vision To
                        <br className="hidden md:block" /> A Global Creative Community
                    </h2> */}

                    <h4 className='mb-3 md:mb-5 max-md:text-[1.5rem]! max-md:leading-[1.2]!'>
                        WWI Milestones — From A Vision To <br className="hidden md:block" /> A Global Creative Community
                    </h4>
                    <p className="text-sm mx-auto text-white/90 max-w-md leading-relaxed max-md:text-[13px]! max-md:leading-snug!">
                        From a bold vision to a thriving community shaping the future of
                        media, communication, and creative arts.
                    </p>
                </div>

                {/* Stage */}
                <div className="relative w-full   " style={{ height: 560 }}>
                    {/* Fixed connector lines around the active year */}
                    <div className="absolute  left-1/2 w-px bg-white/40 z-20 hidden md:block" style={{ top: arcTop - 150, height: 40 }} />
                    <div className="absolute  left-1/2 w-px bg-white/40 z-20" style={{ top: arcTop - 51, height: 25 }} />
                    <div className="absolute  left-1/2 w-px bg-white/40 z-20" style={{ top: arcTop + 56, height: isMobile ? 40 : 56 }} />

                    {/* Description */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-full px-5 md:px-6 text-center z-20 pointer-events-none"
                        style={{ top: arcTop + descGap, maxWidth: 620 }}
                    >
                        <div key={active} className="wwm-fade">
                            {paragraphs.map((p, idx) => (
                                <p
                                    key={idx}
                                    className={`text-[14px] md:text-[15px] leading-relaxed md:leading-[1.5] max-md:text-[13px]! max-md:leading-[1.5]! ${p.startsWith('FICCI') ? 'font-semibold text-white' : 'text-white/95'
                                        } ${idx > 0 ? (p.startsWith('·') && paragraphs[idx - 1]?.startsWith('·') && p.length < 40 ? 'mt-1.5 md:mt-2' : 'mt-2 md:mt-3') : ''}`}
                                >
                                    {p}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Wheel */}
                    <div
                        ref={wheelRef}
                        className="absolute rounded-full border \ border-dashed border-white/30"
                        style={{
                            left: '50%',
                            top: arcTop,
                            width: R * 2,
                            height: R * 2,
                            marginLeft: -R,
                            willChange: 'transform',
                        }}
                    >
                        {UNIQUE_DATA.map((item, i) => {
                            const isActive = active === i;
                            return (
                                <div
                                    key={item.year}
                                    className="absolute group cursor-pointer"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        width: 0,
                                        height: 0,
                                        transform: `rotate(${i * STEP}deg) translateY(${-R}px)`,
                                    }}
                                    onClick={() => handleDotClick(i)}
                                >
                                    {/* Dot (with a larger hit area) */}
                                    <div
                                        className="absolute flex items-center justify-center"
                                        style={{ width: 48, height: 48, left: -24, top: -24 }}
                                    >
                                        <div
                                            className="rounded-full group-hover:scale-125"
                                            style={{
                                                width: isActive ? 20 : 16,
                                                height: isActive ? 20 : 16,
                                                backgroundColor: isActive ? ACCENT : '#fff',
                                                transition: 'all 0.35s ease',
                                            }}
                                        />
                                    </div>

                                    {/* Year, placed radially outside the arc */}
                                    <span
                                        className="absolute whitespace-nowrap font-medium select-none"
                                        style={{
                                            left: 0,
                                            bottom: 58,
                                            transform: 'translateX(-50%)',
                                            fontSize: 'clamp(22px, 2.7vw, 36px)',
                                            lineHeight: 1.1,
                                            color: '#fff',
                                            opacity: isActive ? 1 : 0.8,
                                            transition: 'opacity 0.3s ease',
                                        }}
                                    >
                                        {item.year}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes wwmFade {
                        0%   { opacity: 0; transform: translateY(14px); filter: blur(4px); }
                        100% { opacity: 1; transform: translateY(0);    filter: blur(0); }
                    }
                    .wwm-fade { animation: wwmFade 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
                    @media (prefers-reduced-motion: reduce) { .wwm-fade { animation: none; } }
                `,
                }}
            />
        </section>
    );
};

export default WWMilestones;
