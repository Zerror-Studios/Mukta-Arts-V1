"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import useScrollReveal from "@/hooks/useScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Film posters are the client's own, the compressed copies of /img/final/home/all (Gautam Govinda, Krodhi,
// Vidhaata and Meri Jung have no client poster yet). Event photos are web-sized copies of /img/final/about_Img/AB2.
const POSTERS = "/img/final/home/all/compressed/";
const TL = "/img/final/timeline/";

const milestonesData = [
  {
    id: "m-1",
    year: "1978",
    title: "Mukta Arts Is Founded",
    tag: "Studio Inception",
    desc: "Founded by Subhash Ghai, marking the beginning of an enduring legacy in Indian entertainment.",
    img: `${TL}mal-is-founded.webp`,
    imgPos: "50% 30%",
    isMilestone: true,
  },
  {
    id: "m-2",
    year: "1979",
    title: "Gautam Govinda",
    tag: "Feature Film",
    img: "/img/films/gautam-govinda.jpg",
  },
  {
    id: "m-3",
    year: "1980",
    title: "Karz",
    tag: "Cult Classic",
    img: `${POSTERS}04_KARZ_(1980).jpg`,
  },
  {
    id: "m-4",
    year: "1981",
    title: "Krodhi",
    tag: "Feature Film",
    img: "/img/films/krodhi.jpg",
  },
  {
    id: "m-5",
    year: "1982",
    title: "Vidhaata",
    tag: "Blockbuster",
    img: "/img/films/vidhaata.jpg",
  },
  {
    id: "m-6",
    year: "1983",
    title: "Hero",
    tag: "Breakthrough",
    img: `${POSTERS}06_HERO_(1982).jpg`,
  },
  {
    id: "m-7",
    year: "1985",
    title: "Meri Jung",
    tag: "Courtroom Drama",
    img: "/img/films/meri-jung.jpg",
  },
  {
    id: "m-8",
    year: "1986",
    title: "Karma",
    tag: "National Award",
    img: `${POSTERS}08_KARMA_(1986).jpg`,
    isMilestone: true,
  },
  {
    id: "m-9",
    year: "1987",
    title: "Uttar Dakshin",
    tag: "Feature Film",
    img: `${POSTERS}UTTAR DAKSHIN (HINDI).jpg`,
  },
  {
    id: "m-10",
    year: "1989",
    title: "Ram Lakhan",
    tag: "Mega Blockbuster",
    img: `${POSTERS}10_RAM_LAKHAN_(1987).jpg`,
  },
  {
    id: "m-11",
    year: "1991",
    title: "Saudagar",
    tag: "Best Director",
    img: `${POSTERS}11_SAUDAGAR_(1991).jpg`,
  },
  {
    id: "m-12",
    year: "1992",
    title: "Prem Deewane",
    tag: "Romantic Adventure",
    img: `${POSTERS}12_PREM_DEEWANE_(1992).jpg`,
  },
  {
    id: "m-13",
    year: "1993",
    title: "Khalnayak",
    tag: "Blockbuster",
    img: `${POSTERS}13_KHALNAYAK_(1993).jpg`,
  },
  {
    id: "m-14",
    year: "1995",
    title: "Trimurti",
    tag: "Grand Spectacle",
    img: `${POSTERS}15_TRIMURTI_(1995).jpg`,
  },
  {
    id: "m-15",
    year: "1996",
    title: "Jaan",
    tag: "Action Romance",
    img: `${POSTERS}16_JAAN_(1996).jpg`,
  },
  {
    id: "m-16",
    year: "1997",
    title: "Pardes",
    tag: "Global Hit",
    img: `${POSTERS}17_PARDES_(1997).jpg`,
  },
  {
    id: "m-17",
    year: "1998",
    title: "Shyam Ghanshyam",
    tag: "Feature Film",
    img: `${POSTERS}18_SHYAM_GHANSHYAM_(1998).jpg`,
  },
  {
    id: "m-18",
    year: "1999",
    title: "Taal",
    tag: "Global Milestone",
    img: `${POSTERS}19_TAAL_(1999).jpg`,
    isMilestone: true,
  },
  {
    id: "m-19",
    year: "2000",
    title: "Mukta Arts IPO",
    tag: "First Studio IPO",
    desc: "Mukta Arts became India’s first film studio listed on major stock exchanges, pioneering corporatization.",
    img: `${TL}mal-ipo.webp`,
    imgPos: "50% 30%",
    isMilestone: true,
  },
  {
    id: "m-20",
    year: "2001",
    title: "Yaadein",
    tag: "Family Drama",
    img: `${POSTERS}20_YAADEIN_(2001).jpg`,
  },
  {
    id: "m-21",
    year: "2004",
    title: "Aitraaz",
    tag: "Courtroom Thriller",
    img: `${POSTERS}25_AITRAAZ_(2004).jpg`,
  },
  {
    id: "m-22",
    year: "2005",
    title: "Kisna",
    tag: "Period Epic",
    img: `${POSTERS}26_KISNA_(2005).jpg`,
  },
  {
    id: "m-23",
    year: "2005",
    title: "Iqbal",
    tag: "National Award",
    img: `${POSTERS}27_IQBAL_(2005).jpg`,
    isMilestone: true,
  },
  {
    id: "m-24",
    year: "2006",
    title: "Whistling Woods International",
    tag: "Media Education",
    desc: "Asia’s premier film, television, and creative arts institute founded to nurture future media leaders.",
    img: `${TL}whistling-woods.webp`,
    isMilestone: true,
  },
  {
    id: "m-25",
    year: "2011",
    title: "Mukta A2 Cinemas",
    tag: "Exhibition Network",
    desc: "Mukta Arts enters theatrical exhibition, providing premium yet accessible moviegoing across India and the Middle East.",
    img: `${TL}excelsior-ma2-36.webp`,
    isMilestone: true,
  },
  {
    id: "m-26",
    year: "2025",
    title: "SGM Studios Established",
    tag: "Animation Studio",
    desc: "SGM Studios is Mukta Arts' animation and visual storytelling arm.",
    img: "/img/final/SGM/SGM_Studios_MOU.webp",
    isMilestone: true,
  },
];

// Studio-level landmarks (not film releases) get a wide, landscape frame
const isFilm = (m) => m.img.startsWith("/img/films/") || m.img.startsWith(POSTERS);
const isStudioEvent = (m) => m.isMilestone && !isFilm(m);

// Years labelled on the timeline: the first entry of each decade, plus the last
const decadeLabelIndexes = milestonesData.reduce((acc, m, i) => {
  const decade = m.year.slice(0, 3);
  if (i === 0 || decade !== milestonesData[i - 1].year.slice(0, 3)) acc.push(i);
  return acc;
}, []);
if (!decadeLabelIndexes.includes(milestonesData.length - 1)) {
  decadeLabelIndexes.push(milestonesData.length - 1);
}

// Labels right beside the first or last one would overlap it on phones
const crowdedLabelIndexes = decadeLabelIndexes.filter((i) => {
  const t = i / (milestonesData.length - 1);
  return t > 0 && t < 1 && (t < 0.12 || t > 0.88);
});

const pad = (n) => String(n).padStart(2, "0");

export default function CareerMilestones() {
  const containerRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const progressLineRef = useRef(null);
  const activeYearRef = useRef(null);
  const activeTitleRef = useRef(null);
  const activeCountRef = useRef(null);
  const bgYearRef = useRef(null);
  const cardsRef = useRef([]);
  const dotsRef = useRef([]);
  const yearsRef = useRef([]);

  // Section heading reveals as it enters
  useScrollReveal(containerRef);

  useGSAP(
    () => {
      const track = scrollTrackRef.current;
      const cards = cardsRef.current.filter(Boolean);
      const n = cards.length;
      if (!track || !n) return;

      let centers = [];
      let activeIndex = -1;

      // Card centres along the track (offsetLeft ignores the GSAP transform)
      const measure = () => {
        centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
        const span = centers[n - 1] - centers[0] || 1;
        dotsRef.current.forEach((dot, i) => {
          if (dot) dot.style.left = `${((centers[i] - centers[0]) / span) * 100}%`;
        });
        yearsRef.current.forEach((label, i) => {
          if (label) label.style.left = `${((centers[i] - centers[0]) / span) * 100}%`;
        });
      };

      const setActive = (index) => {
        if (index === activeIndex) return;
        const prevYear = milestonesData[activeIndex]?.year;
        activeIndex = index;
        const m = milestonesData[index];

        cards.forEach((card, i) => {
          card.dataset.active = String(i === index);
        });
        dotsRef.current.forEach((dot, i) => {
          if (!dot) return;
          dot.dataset.passed = String(i <= index);
          dot.dataset.active = String(i === index);
        });
        yearsRef.current.forEach((label, i) => {
          if (label) label.dataset.passed = String(i <= index);
        });

        if (activeYearRef.current) activeYearRef.current.textContent = m.year;
        if (activeTitleRef.current) activeTitleRef.current.textContent = m.title;
        if (activeCountRef.current) activeCountRef.current.textContent = pad(index + 1);

        if (bgYearRef.current && m.year !== prevYear) {
          bgYearRef.current.textContent = m.year;
          gsap.fromTo(
            bgYearRef.current,
            { yPercent: 6, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out", overwrite: true }
          );
        }
      };

      measure();
      setActive(0);

      // Scroll from the first card centred in the viewport to the last one centred
      gsap.fromTo(
        track,
        { x: () => window.innerWidth / 2 - centers[0] },
        {
          x: () => window.innerWidth / 2 - centers[n - 1],
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${Math.max(centers[n - 1] - centers[0], window.innerHeight * 3)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
          onUpdate() {
            const p = this.progress();
            gsap.set(progressLineRef.current, { scaleX: p });

            const pos = centers[0] + p * (centers[n - 1] - centers[0]);
            let closest = 0;
            for (let i = 1; i < n; i++) {
              if (Math.abs(centers[i] - pos) < Math.abs(centers[closest] - pos)) closest = i;
            }
            setActive(closest);
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      // --ph is the image height: it leaves room for the header, footer and card copy,
      // so the whole section always fits one screen (svh avoids mobile URL-bar jumps)
      className="relative h-svh w-full bg-[#F8F9FA] overflow-hidden text-black select-none flex flex-col [--ph:min(48svh,calc(100svh-380px))] md:[--ph:min(48svh,calc(100svh-420px))] short:[--ph:calc(100svh-190px)]"
    >
      {/* Oversized outlined year behind the track */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          ref={bgYearRef}
          aria-hidden="true"
          className="font-['SwitzerB'] leading-none tracking-tighter text-transparent text-[44vw] md:text-[30vw] short:text-[24vw]"
          style={{ WebkitTextStroke: "1px rgba(0,0,0,0.07)" }}
        >
          {milestonesData[0].year}
        </span>
      </div>

      {/* Header: starts below the fixed site header (5rem / 7rem tall) and shares its side padding */}
      <header className="relative z-20 flex items-end justify-between gap-4 px-6 md:px-8 pt-[calc(5rem+8px)] md:pt-[calc(7rem+8px)] pointer-events-none">
        <div className="min-w-0">
          {/* <div className="flex items-center gap-3 short:hidden">
            <span className="w-6 md:w-8 h-px bg-black/30" />
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-gray-500 font-['SwitzerM']">
              Chronological Journey
            </p>
          </div> */}
          <h2 data-reveal="words" className="text-[32px]! sm:text-[40px]! lg:text-[clamp(40px,3.4vw,56px)]! short:text-[24px]! leading-none! font-['SwitzerB'] tracking-tight">
            Milestones &amp; Films
          </h2>
        </div>

        {/* <div className="shrink-0 text-right font-mono leading-none">
          <span
            ref={activeCountRef}
            className="text-[1.65rem] sm:text-3xl md:text-5xl short:text-2xl font-['SwitzerB'] tracking-tight tabular-nums"
          >
            01
          </span>
          <span className="text-[11px] md:text-sm text-gray-400 ml-1 tabular-nums">/ {pad(milestonesData.length)}</span>
          <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-gray-400 hidden sm:block short:hidden">
            {milestonesData[0].year} — {milestonesData[milestonesData.length - 1].year}
          </p>
        </div> */}
      </header>

      {/* Horizontal track */}
      <div className="relative z-10 flex-1 flex items-center min-h-0">
        <div
          ref={scrollTrackRef}
          className="relative flex items-start gap-6 sm:gap-10 md:gap-16 short:gap-8 w-max will-change-transform"
        >
          {milestonesData.map((m, index) => {
            const studio = isStudioEvent(m);
            return (
              <article
                key={m.id}
                ref={(el) => (cardsRef.current[index] = el)}
                data-active={index === 0}
                className={`group shrink-0 flex flex-col transition-opacity duration-700 opacity-40 md:opacity-45 data-[active=true]:opacity-100 ${
                  studio
                    ? "w-[min(calc(var(--ph)*1.35),84vw)]"
                    : "w-[min(calc(var(--ph)*0.68),64vw)]"
                }`}
              >
                {/* Meta row */}
                {/* <div className="flex items-center justify-between mb-2 md:mb-3 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.15em] md:tracking-[0.2em]">
                  <span className="text-black font-semibold">{m.year}</span>
                  {m.isMilestone ? (
                    <span className="flex items-center gap-1.5 text-black">
                      <span className="w-1.5 h-1.5 rotate-45 bg-black" />
                      Landmark
                    </span>
                  ) : (
                    <span className="text-gray-400">No. {pad(index + 1)}</span>
                  )}
                </div> */}

                {/* Image */}
                <div className="relative h-(--ph) overflow-hidden bg-neutral-200 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)]">
                  <img
                    src={m.img}
                    alt={studio ? m.title : `${m.title} (${m.year}) film poster`}
                    loading="lazy"
                    draggable={false}
                    style={m.imgPos ? { objectPosition: m.imgPos } : undefined}
                    className="w-full h-full object-cover grayscale scale-[1.06] transition-[filter,transform] duration-1000 ease-out group-data-[active=true]:grayscale-0 group-data-[active=true]:scale-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
                  {/* <span className="absolute left-2.5 bottom-2.5 md:left-4 md:bottom-4 max-w-[calc(100%-1.25rem)] truncate px-2 py-1 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.15em] md:tracking-[0.2em] text-white border border-white/40 backdrop-blur-sm bg-black/20">
                    {m.tag}
                  </span> */}
                </div>

                {/* Copy */}
                <div className="mt-[12px] md:mt-[18px] short:mt-[8px]">
                  <h3
                    className={`font-['SwitzerB'] uppercase tracking-tight leading-[1.05] ${
                      studio ? "text-[17px] md:text-[22px] short:text-[15px]" : "text-[15px] md:text-[17px] short:text-[13px]"
                    }`}
                  >
                    {m.title}
                  </h3>
                  {/* Only corporate milestones carry a description; film entries show title and tag */}
                  {m.desc && (
                    <p className="mt-[6px] md:mt-[8px] text-gray-600 text-[12px]! md:text-[13px]! leading-[1.5]! font-['SwitzerR'] short:hidden line-clamp-2 md:max-w-[90%]">
                      {m.desc}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Timeline footer */}
      <footer className="relative z-20 px-6 md:px-8 pt-[16px] pb-[max(24px,env(safe-area-inset-bottom))] md:pb-[36px] short:pt-[8px] short:pb-[12px]">
        <div className="relative h-[16px] mb-[8px]">
          {milestonesData.map((m, i) =>
            decadeLabelIndexes.includes(i) ? (
              <span
                key={m.id}
                ref={(el) => (yearsRef.current[i] = el)}
                data-passed={i === 0}
                className={`absolute bottom-0 -translate-x-1/2 ${crowdedLabelIndexes.includes(i) ? "max-sm:hidden" : ""} text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-wider md:tracking-widest text-gray-400 transition-colors duration-300 data-[passed=true]:text-black first:translate-x-0 last:-translate-x-full`}
                style={{ left: `${(i / (milestonesData.length - 1)) * 100}%` }}
              >
                {m.year}
              </span>
            ) : null
          )}
        </div>

        <div className="relative w-full h-px bg-black/15">
          <div
            ref={progressLineRef}
            className="absolute left-0 -top-px h-0.5 w-full bg-black origin-left"
            style={{ transform: "scaleX(0)" }}
          />
          {milestonesData.map((m, i) => (
            <span
              key={m.id}
              ref={(el) => (dotsRef.current[i] = el)}
              data-passed={i === 0}
              data-active={i === 0}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8F9FA] border transition-all duration-300 border-black/25 data-[passed=true]:bg-black data-[passed=true]:border-black data-[active=true]:scale-[1.8] ${
                m.isMilestone ? "w-1.75 h-1.75 md:w-2.5 md:h-2.5" : "w-1.25 h-1.25 md:w-1.5 md:h-1.5"
              }`}
              style={{ left: `${(i / (milestonesData.length - 1)) * 100}%` }}
            />
          ))}
        </div>

        {/* <div className="mt-[14px] flex items-center gap-3 text-[12px] md:text-[13px] short:hidden">
          <span ref={activeYearRef} className="font-mono tracking-widest text-gray-500 tabular-nums">
            {milestonesData[0].year}
          </span>
          <span className="w-6 h-px bg-black/30" />
          <span ref={activeTitleRef} className="font-['SwitzerSB'] uppercase tracking-wider truncate">
            {milestonesData[0].title}
          </span>
        </div> */}
      </footer>
    </section>
  );
}
