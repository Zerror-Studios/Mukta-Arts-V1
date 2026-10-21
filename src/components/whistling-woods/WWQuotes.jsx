"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import useScrollReveal from "@/hooks/useScrollReveal";
import { gsap, EASE, DURATION, MOTION_OK } from "@/lib/motion";

const categories = [
  { id: "actors", title: "Actors" },
  { id: "filmmakers", title: "Filmmakers" },
  { id: "music", title: "Music & Dance" },
  { id: "business", title: "Business Leaders" },
];

// Word for word from the client's WWIL_QUOTES.pdf (/img/final/WW/pdf), in the order it lists them.
// Saroj Khan's entry has no date there.
const quotes = [
  {
    name: "Shabana Azmi",
    role: "Actor",
    category: "actors",
    date: "30 March 2006",
    quote: "Trust Subhash to do what we all have dreamed of doing for so long. You have all my support.",
  },
  {
    name: "Alka Yagnik",
    role: "Singer",
    category: "music",
    date: "2 April 2006",
    quote: "Amazing! A dream come true for all aspiring young ones who want to ‘make it’ in the world of films. Kudos! Luv’n’ Regards.",
  },
  {
    name: "Anil Kapoor",
    role: "Actor",
    category: "actors",
    date: "21 June 2006",
    quote: "Subhashji, your contribution to the world of entertainment has without doubt been tremendous. You are an institution to a lot of young film-makers, but this monument which you have built is much bigger than all the films you or any other film-maker of this country has made. As a student of cinema, I would like to bow down and thank you for making this temple.",
  },
  {
    name: "Ashutosh Gowariker",
    role: "Filmmaker",
    category: "filmmakers",
    date: "12 August 2006",
    quote: "Today, once again, I felt extreme pride to see WWI growing from strength to strength, with reference not only to the campus, faculty and the ever-growing syllabus, but also the quality of students. All I can say is that ‘the future of Indian cinema is cinematically bright!’ With great hope and best wishes to all.",
  },
  {
    name: "Sukhwinder Singh",
    role: "Music Director",
    category: "music",
    date: "14 August 2006",
    quote: "This was a new feel. I really loved the atmosphere.",
  },
  {
    name: "Madhuri Dixit",
    role: "Actor",
    category: "actors",
    date: "23 May 2007",
    quote: "Hope this institution makes every dream turn into reality: now and forever.",
  },
  {
    name: "Amole Gupte",
    role: "Filmmaker",
    category: "filmmakers",
    date: "6 August 2008",
    quote: "I haven’t been lucky enough to study at a film school, completely self-taught! So it’s great to see the facilities, the infrastructure available. Wish I had studied here... WWI, a place I wish I had squatted for 20 years.: Rip Van Winkle",
  },
  {
    name: "Farhan Akhtar",
    role: "Filmmaker",
    category: "filmmakers",
    date: "15 October 2008",
    quote: "Thank you for having me here at your amazing academy, film school. It is an experience I will always remember and cherish. Hope to be back here soon with more stories for your wonderful students.",
  },
  {
    name: "Imtiaz Ali",
    role: "Director",
    category: "filmmakers",
    date: "2 September 2009",
    quote: "Energetic, zestful and informal atmosphere at WWI infused zing and a sense of youth in me. A very interesting experience coming here. I wish WWI all the best, and I’m sure students coming out from here will make the film industry stronger and a better place to be.",
  },
  {
    name: "Mahesh Samat",
    role: "Managing Director, Walt Disney",
    category: "business",
    date: "15 January 2010",
    quote: "WWI is a really impressive place! Great campus and a lot of passion within the walls. All the best to the Institute.",
  },
  {
    name: "Rajkumar Hirani",
    role: "Filmmaker",
    category: "filmmakers",
    date: "20 January 2010",
    quote: "Whistling Woods, All IZZ Well!",
  },
  {
    name: "Saroj Khan",
    role: "Choreographer",
    category: "music",
    quote: "I enjoyed every minute of my session. Also, the students are ‘LAJAWAB’. I must say Subhashji and Meghna have done such a fabulous job. I love all students and their mentors. Thanks for calling me.",
  },
  {
    name: "Kamal Haasan",
    role: "Actor and Filmmaker",
    category: "actors",
    date: "18 July 2014",
    quote: "A river water never returns to the fountain’s head unless through osmosis as rain. I have this rare opportunity of returning to the very womb of filmmakers: the film school. Truly a pleasure.",
  },
  {
    name: "Omung Kumar",
    role: "Filmmaker",
    category: "filmmakers",
    date: "9 April 2015",
    quote: "5th Veda is the most exciting programme I have come across in a very long time. I had fun sharing my experience with the students. There is so much to talk about, and the concept just took over me. Thank you for inviting me.",
  },
  {
    name: "N. R. Narayana Murthy",
    role: "Chairman Emeritus, Infosys",
    category: "business",
    date: "17 July 2015",
    quote: "Spending some time going through the institute was like going through a stunning magic show. Keep it up and raise the image of the country.",
  },
  {
    name: "Shankar Mahadevan",
    role: "Singer and Music Composer",
    category: "music",
    date: "23 July 2015",
    quote: "We feel proud that an institution of this level and quality exists in our country. Thank you for the opportunity to come and share my views.",
  },
];

const ALL = "all";
const filters = [
  { id: ALL, title: "All", count: quotes.length },
  ...categories.map((c) => ({ ...c, count: quotes.filter((q) => q.category === c.id).length })),
];

// Cards are 2 a row on tablets and 4 a row on desktops. A short last row is centred, so the
// grid stays symmetrical in every category (the grid has twice the columns; each card spans 2).
const MD_START = { 1: "md:col-start-2" };
const XL_START = { 1: "xl:col-start-4", 2: "xl:col-start-3", 3: "xl:col-start-2" };
const lastRowStart = (i, total, perRow, starts) => {
  const rest = total % perRow;
  return rest && i === total - rest ? starts[rest] : "";
};
const cardStart = (i, total) => {
  const md = lastRowStart(i, total, 2, MD_START);
  const xl = lastRowStart(i, total, 4, XL_START);
  return xl || (md ? `${md} xl:col-start-auto` : "");
};

export default function WWQuotes() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const tabRefs = useRef([]);
  const filterChanged = useRef(false);
  const [active, setActive] = useState(ALL);

  // Heading word by word, the intro line by line
  useScrollReveal(sectionRef);

  const visible = active === ALL ? quotes : quotes.filter((q) => q.category === active);

  // Cards rise in: on first view as the grid scrolls in, then on every category change
  useGSAP(
    () => {
      const cards = gridRef.current?.querySelectorAll("[data-card]");
      if (!cards?.length) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION,
            ease: EASE,
            stagger: 0.05,
            scrollTrigger: filterChanged.current ? undefined : { trigger: gridRef.current, start: "top 85%", once: true },
          }
        );
      });
    },
    { scope: gridRef, dependencies: [active] }
  );

  const select = (id) => {
    filterChanged.current = true;
    setActive(id);
  };

  // Arrow keys move between the categories (WAI-ARIA tabs pattern)
  const onTabKeyDown = (e) => {
    const i = filters.findIndex((f) => f.id === active);
    const last = filters.length - 1;
    let next = null;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    select(filters[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section ref={sectionRef} className="bg-[#1B123D] text-white py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10 overflow-hidden">
      {/* Heading, laid out like the schools section above */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-16 mb-12 md:mb-16">
        <h2 data-reveal="words" className="tracking-tight max-w-4xl text-white">
          Voices from the Industry
        </h2>
        <p data-reveal="lines" className="text-white/60 text-base! md:text-lg! leading-relaxed! max-w-md lg:pb-3">
          Actors, filmmakers, musicians and business leaders, in their own words after visiting Whistling Woods International.
        </p>
      </div>

      {/* Categories: text tabs with a gold underline, scrolling sideways on phones */}
      <div
        role="tablist"
        aria-label="Quote categories"
        className="flex gap-6 md:gap-10 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 border-b border-white/15 mb-10 md:mb-14 [scrollbar-width:none]"
      >
        {filters.map((f, i) => {
          const selected = f.id === active;
          return (
            <button
              key={f.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`ww-quotes-tab-${f.id}`}
              aria-selected={selected}
              aria-controls="ww-quotes-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(f.id)}
              onKeyDown={onTabKeyDown}
              className={`relative shrink-0 flex items-baseline gap-2 pb-4 text-[15px] md:text-[17px] font-medium whitespace-nowrap cursor-pointer outline-none focus-visible:text-white transition-colors duration-300 ${
                selected ? "text-white" : "text-white/45 hover:text-white"
              }`}
            >
              {f.title}
              <span className={`text-[12px] tabular-nums ${selected ? "text-[#e2a866]" : "text-white/35"}`}>{f.count}</span>
              <span
                aria-hidden="true"
                className={`absolute left-0 right-0 -bottom-px h-[2px] bg-[#e2a866] transition-opacity duration-300 ${
                  selected ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Every row is as tall as the tallest card (auto-rows-fr), so all cards share one size */}
      <div
        key={active}
        ref={gridRef}
        id="ww-quotes-panel"
        role="tabpanel"
        aria-labelledby={`ww-quotes-tab-${active}`}
        className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-8 auto-rows-fr gap-4 md:gap-6"
      >
        {visible.map((q, i) => (
          <figure
            key={q.name}
            data-card
            className={`md:col-span-2 ${cardStart(i, visible.length)} flex flex-col rounded-[3px] bg-white/[0.03] border border-white/10 p-6 md:p-8 xl:p-7 transition-colors duration-300 hover:border-white/25`}
          >
            {/* Quote mark and number, like the numbered school rows above */}
            <div className="flex items-start justify-between mb-6">
              <span aria-hidden="true" className="font-['SwitzerB'] text-[#e2a866] text-[44px] leading-[0.6] select-none">
                “
              </span>
              <span aria-hidden="true" className="font-['SwitzerL'] text-white/30 text-[14px] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <blockquote>
              <p className="font-['SwitzerM'] text-white/90 text-[16px]! md:text-[17px]! leading-[1.55]!">{q.quote}</p>
            </blockquote>

            {/* Pinned to the bottom, so every card's name lines up */}
            <figcaption className="mt-auto pt-6">
              <span className="block pt-5 border-t border-white/15 font-['SwitzerSB'] text-white text-[15px] md:text-[16px]">
                {q.name}
              </span>
              <span className="block text-white/55 text-[13px] md:text-[14px] mt-1">
                {q.role}
                {q.date && <> · {q.date}</>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
