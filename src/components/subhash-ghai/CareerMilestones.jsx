"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const milestonesData = [
  {
    id: "m-1",
    year: "1978",
    title: "MUKTA ARTS WAS FOUNDED",
    tag: "Studio Inception",
    desc: "Founded by Subhash Ghai, marking the beginning of an enduring legacy in Indian entertainment.",
    img: "/img/ma/MuktaArtProduction.png",
    isMilestone: true,
  },
  {
    id: "m-2",
    year: "1979",
    title: "GAUTAM GOVINDA",
    tag: "Feature Film",
    desc: "An early action-drama reflecting the director's burgeoning narrative craft.",
    img: "/img/home/1.jpg",
  },
  {
    id: "m-3",
    year: "1980",
    title: "KARZ",
    tag: "Cult Classic",
    desc: "The landmark musical thriller on reincarnation that redefined style, music, and cinematic storytelling.",
    img: "/img/sg/3.png",
  },
  {
    id: "m-4",
    year: "1981",
    title: "KRODHI",
    tag: "Feature Film",
    desc: "A gripping drama of righteousness, vengeance, and spiritual redemption.",
    img: "/img/home/2.jpg",
  },
  {
    id: "m-5",
    year: "1982",
    title: "VIDHAATA",
    tag: "Blockbuster",
    desc: "The highest grossing film of 1982, uniting legendary screen icons on a grand scale.",
    img: "/img/home/3.jpg",
  },
  {
    id: "m-6",
    year: "1983",
    title: "HERO",
    tag: "Breakthrough",
    desc: "A phenomenal musical breakthrough that launched new superstars and timeless melodies.",
    img: "/img/sg/4.png",
  },
  {
    id: "m-7",
    year: "1985",
    title: "MERI JUNG",
    tag: "Courtroom Drama",
    desc: "A fierce courtroom drama showcasing powerhouse performances and emotional intensity.",
    img: "/img/home/4.jpg",
  },
  {
    id: "m-8",
    year: "1986",
    title: "KARMA",
    tag: "National Award",
    desc: "A patriotic magnum opus awarded the National Film Award for National Integration.",
    img: "/img/sg/7.png",
    isMilestone: true,
  },
  {
    id: "m-9",
    year: "1987",
    title: "UTTAR DAKSHIN",
    tag: "Feature Film",
    desc: "An evocative family drama exploring fraternal bonds and emotional conflicts.",
    img: "/img/home/5.jpg",
  },
  {
    id: "m-10",
    year: "1989",
    title: "RAM LAKHAN",
    tag: "Mega Blockbuster",
    desc: "A multi-starrer blockbuster that became a defining pop-culture phenomenon across generations.",
    img: "/img/home/C1.png",
  },
  {
    id: "m-11",
    year: "1991",
    title: "SAUDAGAR",
    tag: "Best Director",
    desc: "Filmfare Award winner for Best Director, staging the historic union of cinema titans.",
    img: "/img/home/C2.png",
  },
  {
    id: "m-12",
    year: "1992",
    title: "PREM DEEWANE",
    tag: "Romantic Adventure",
    desc: "A breezy romantic escapade driven by comedy, youthfulness, and memorable melodies.",
    img: "/img/home/6.jpg",
  },
  {
    id: "m-13",
    year: "1993",
    title: "KHALNAYAK",
    tag: "Blockbuster",
    desc: "A groundbreaking anti-hero musical that dominated charts and theaters nationwide.",
    img: "/img/home/C3.png",
  },
  {
    id: "m-14",
    year: "1995",
    title: "TRIMURTI",
    tag: "Grand Spectacle",
    desc: "A high-octane cinematic spectacle that shattered box office opening records across India.",
    img: "/img/home/7.jpg",
  },
  {
    id: "m-15",
    year: "1996",
    title: "JAAN",
    tag: "Action Romance",
    desc: "A celebrated love story set against high-stakes action and melodious folk music.",
    img: "/img/home/8.jpg",
  },
  {
    id: "m-16",
    year: "1997",
    title: "PARDES",
    tag: "Global Hit",
    desc: "Filmfare Award winner for Best Screenplay; celebrating Indian cultural ethos across the global diaspora.",
    img: "/img/sg/6.png",
  },
  {
    id: "m-17",
    year: "1998",
    title: "SHYAM GHANSHYAM",
    tag: "Feature Film",
    desc: "A rural emotional saga exploring fraternal loyalty, deceit, and redemption.",
    img: "/img/home/9.jpg",
  },
  {
    id: "m-18",
    year: "1999",
    title: "TAAL",
    tag: "Global Milestone",
    desc: "First Hindi film in the US Box Office Top 20, pioneering film insurance through CineMukta Policy.",
    img: "/img/home/C3.png",
    isMilestone: true,
  },
  {
    id: "m-19",
    year: "2000",
    title: "MUKTA ARTS IPO",
    tag: "First Studio IPO",
    desc: "Mukta Arts became India’s first film studio listed on major stock exchanges, pioneering corporatization.",
    img: "/img/ma/MuktaArtProduction.png",
    isMilestone: true,
  },
  {
    id: "m-20",
    year: "2001",
    title: "YAADEIN",
    tag: "Family Drama",
    desc: "A poignant modern drama on fatherhood, family values, and generational bonds.",
    img: "/img/home/C1.png",
  },
  {
    id: "m-21",
    year: "2004",
    title: "AITRAAZ",
    tag: "Courtroom Thriller",
    desc: "A critically acclaimed modern drama addressing power dynamics and marital loyalty.",
    img: "/img/home/C2.png",
  },
  {
    id: "m-22",
    year: "2005",
    title: "KISNA",
    tag: "Period Epic",
    desc: "An epic period musical romance set amidst the turbulent transition of India's independence.",
    img: "/img/home/3.jpg",
  },
  {
    id: "m-23",
    year: "2005",
    title: "IQBAL",
    tag: "National Award",
    desc: "National Film Award winner, celebrated as one of Indian cinema's most heart-warming and inspirational sports stories.",
    img: "/img/sg/5.png",
    isMilestone: true,
  },
  {
    id: "m-24",
    year: "2006",
    title: "WHISTLING WOODS INTERNATIONAL FOUNDED",
    tag: "Media Education",
    desc: "Asia’s premier film, television, and creative arts institute founded to nurture future media leaders.",
    img: "/img/ma/WhistlingWoods.jpg",
    isMilestone: true,
  },
  {
    id: "m-25",
    year: "2011",
    title: "MUKTA A2 CINEMAS FOUNDED",
    tag: "Exhibition Network",
    desc: "Mukta Arts enters theatrical exhibition, providing premium yet accessible moviegoing across India and the Middle East.",
    img: "/img/ma/MuktaA2Cinemas.jpg",
    isMilestone: true,
  },
];

export default function CareerMilestones() {
  const containerRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const progressLineRef = useRef(null);
  const activeInfoRef = useRef(null);
  const activeCountRef = useRef(null);
  const yearsRef = useRef([]);
  const dotsRef = useRef([]);

  useGSAP(
    () => {
      const track = scrollTrackRef.current;
      if (!track) return;

      const getScrollAmount = () => {
        return track.scrollWidth - window.innerWidth;
      };

      const scrollDist = getScrollAmount();

      // 1. Horizontal Scroll Animation
      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${Math.max(scrollDist, 3000)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 2. Timeline Progress Bar Animation & Active Milestone Tracker
      gsap.to(progressLineRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${Math.max(scrollDist, 3000)}`,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const numItems = milestonesData.length;
            const currentIndex = Math.min(
              Math.floor(progress * numItems),
              numItems - 1
            );

            if (activeInfoRef.current && milestonesData[currentIndex]) {
              activeInfoRef.current.innerText = `${milestonesData[currentIndex].year} — ${milestonesData[currentIndex].title}`;
            }

            if (activeCountRef.current) {
              activeCountRef.current.innerText = `${String(currentIndex + 1).padStart(2, "0")} / ${numItems}`;
            }

            const thresholds = Array.from(
              { length: numItems },
              (_, i) => i / (numItems - 1)
            );

            dotsRef.current.forEach((dot, i) => {
              if (!dot) return;
              if (progress >= thresholds[i] - 0.02) {
                dot.classList.remove("bg-gray-300");
                dot.classList.add("bg-black");
              } else {
                dot.classList.remove("bg-black");
                dot.classList.add("bg-gray-300");
              }
            });

            yearsRef.current.forEach((yearEl, i) => {
              if (!yearEl) return;
              if (progress >= thresholds[i] - 0.02) {
                yearEl.classList.remove("text-gray-400");
                yearEl.classList.add("text-black");
              } else {
                yearEl.classList.remove("text-black");
                yearEl.classList.add("text-gray-400");
              }
            });
          },
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-[#F8F9FA] overflow-hidden font-sans text-black select-none"
    >
      {/* Top Section Header */}
      <div className="absolute top-8 md:top-12 left-6 md:left-16 z-20 pointer-events-none">
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-500 font-medium">
          Chronological Journey
        </p>
        <h2 className="text-xl md:text-3xl font-bold font-['SwitzerB'] tracking-tight text-black mt-1">
          Milestones & Films
        </h2>
      </div>

      {/* Horizontal Scrolling Track */}
      <div
        ref={scrollTrackRef}
        className="flex h-full items-center pl-[25vw] md:pl-[35vw] pr-[25vw] md:pr-[35vw] gap-[5vw] md:gap-[6vw] mb-auto w-max"
      >
        {milestonesData.map((milestone, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={milestone.id}
              className={`w-[280px] sm:w-[320px] md:w-[360px] flex flex-col shrink-0 group ${
                isEven
                  ? "-mt-16 md:-mt-24"
                  : "mt-16 md:mt-24"
              }`}
            >
              {isEven ? (
                <>
                  {/* Text on Top */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold text-black font-mono tracking-widest bg-black/5 px-2 py-0.5 rounded">
                        {milestone.year}
                      </span>
                      {milestone.tag && (
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-mono">
                          {milestone.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-black font-['SwitzerB'] leading-snug mb-2 uppercase">
                      {milestone.title}
                    </h3>
                    {milestone.desc && (
                      <p className="text-gray-600 text-xs md:text-[13px] leading-relaxed font-['SwitzerR'] line-clamp-2">
                        {milestone.desc}
                      </p>
                    )}
                  </div>

                  {/* Image */}
                  <div className="overflow-hidden bg-gray-200 shadow-sm">
                    <img
                      src={milestone.img}
                      alt={milestone.title}
                      className="w-full h-[200px] sm:h-[230px] md:h-[260px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Image on Top */}
                  <div className="overflow-hidden bg-gray-200 mb-4 shadow-sm">
                    <img
                      src={milestone.img}
                      alt={milestone.title}
                      className="w-full h-[200px] sm:h-[230px] md:h-[260px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Text on Bottom */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold text-black font-mono tracking-widest bg-black/5 px-2 py-0.5 rounded">
                        {milestone.year}
                      </span>
                      {milestone.tag && (
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-mono">
                          {milestone.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-black font-['SwitzerB'] leading-snug mb-2 uppercase">
                      {milestone.title}
                    </h3>
                    {milestone.desc && (
                      <p className="text-gray-600 text-xs md:text-[13px] leading-relaxed font-['SwitzerR'] line-clamp-2">
                        {milestone.desc}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Static Timeline Footer */}
      <div className="absolute bottom-8 md:bottom-12 left-6 right-6 md:left-16 md:right-16 z-20">
        {/* Active Milestone Live Indicator */}
        <div className="flex items-center justify-between text-xs font-mono tracking-widest text-gray-500 mb-3">
          <span className="uppercase text-gray-400 font-sans hidden sm:inline">
            1978 — 2011 Journey
          </span>
          <span
            ref={activeInfoRef}
            className="text-black font-semibold text-xs sm:text-sm tracking-wider truncate max-w-[70vw] sm:max-w-none"
          >
            1978 — MUKTA ARTS WAS FOUNDED
          </span>
          <span ref={activeCountRef} className="text-gray-400 font-mono">
            01 / {milestonesData.length}
          </span>
        </div>

        <div className="relative w-full h-[1px] bg-gray-300">
          {/* Animated Black Progress Line */}
          <div
            ref={progressLineRef}
            className="absolute left-0 top-[-1px] h-[2px] bg-black origin-left"
            style={{ width: "100%", transform: "scaleX(0)" }}
          ></div>

          {/* Timeline Nodes */}
          {milestonesData.map((milestone, i) => {
            // Display prominent landmark years on the progress bar without clutter
            const showYearLabel = [0, 5, 9, 15, 18, 23, 24].includes(i);
            return (
              <div
                key={milestone.id}
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: `${(i / (milestonesData.length - 1)) * 100}%`,
                }}
              >
                {/* Landmark Year Labels */}
                {showYearLabel && (
                  <div
                    ref={(el) => (yearsRef.current[i] = el)}
                    className={`absolute bottom-3 md:bottom-4 -translate-x-1/2 text-[10px] md:text-xs font-semibold tracking-wider font-mono transition-colors duration-300 ${
                      i === 0 ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {milestone.year}
                  </div>
                )}

                {/* Dot */}
                <div
                  ref={(el) => (dotsRef.current[i] = el)}
                  className={`w-[5px] h-[5px] md:w-[6px] md:h-[6px] rounded-full transition-colors duration-300 -ml-[2.5px] md:-ml-[3px] ${
                    i === 0 ? "bg-black" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}