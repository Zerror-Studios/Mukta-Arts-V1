"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import useScrollReveal from "@/hooks/useScrollReveal";
import { gsap, ScrollTrigger, SplitText, EASE, DURATION, DURATION_LONG, RISE, MOTION_OK } from "@/lib/motion";

// Three of the quotes in the client's WWIL_QUOTES.pdf (/img/final/WW/pdf), word for word and in
// the order it lists them.
const quotes = [
  {
    name: "Shabana Azmi",
    role: "Actor",
    date: "30 March 2006",
    quote: "Trust Subhash to do what we all have dreamed of doing for so long. You have all my support.",
  },
  {
    name: "Rajkumar Hirani",
    role: "Filmmaker",
    date: "20 January 2010",
    quote: "Whistling Woods, All IZZ Well!",
  },
  {
    name: "Kamal Haasan",
    role: "Actor and Filmmaker",
    date: "18 July 2014",
    quote: "A river water never returns to the fountain’s head unless through osmosis as rain. I have this rare opportunity of returning to the very womb of filmmakers: the film school. Truly a pleasure.",
  },
];

const pad = (n) => String(n).padStart(2, "0");
const SCREENS_PER_QUOTE = 0.8; // how far the page scrolls, in screen heights, while each quote holds the stage

export default function WWQuotes() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const countRef = useRef(null);
  const fillRefs = useRef([]);

  // Heading word by word
  useScrollReveal(sectionRef);

  // The section pins and its quotes take the stage one at a time: the leaving quote lifts out
  // word by word, then the next one rises in (in reverse when scrolling back up). With reduced
  // motion nothing pins and the three quotes stand one under another.
  useGSAP(
    () => {
      const section = sectionRef.current;
      const figures = gsap.utils.toArray("[data-quote]", stageRef.current);
      const n = figures.length;
      if (!n) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Each quote moves as one sequence: its quote mark, its words, then the name
        const parts = figures.map((fig) => [
          fig.querySelector("[data-mark]"),
          ...SplitText.create(fig.querySelector("blockquote p"), { type: "words" }).words,
          fig.querySelector("figcaption"),
        ]);
        gsap.set(parts.flat(), { autoAlpha: 0 });
        gsap.set(figures, { opacity: 1 }); // quotes 2 and 3 are hidden by class until they are split
        let current = -1;

        const show = (next) => {
          if (next === current) return;
          const dir = next > current ? 1 : -1;
          const from = dir > 0 ? "start" : "end";

          if (current >= 0) {
            gsap.to(parts[current], {
              y: -RISE * dir,
              autoAlpha: 0,
              duration: 0.5,
              ease: "power2.in",
              stagger: { amount: 0.15, from },
              overwrite: true,
            });
          }

          // Pieces still off stage start below (above when scrolling back); any caught
          // mid-exit by a quick change of direction carry on from where they are
          const els = parts[next];
          gsap.set(
            els.filter((el) => !gsap.getProperty(el, "opacity")),
            { y: RISE * dir }
          );
          gsap.to(els, {
            y: 0,
            autoAlpha: 1,
            duration: DURATION_LONG,
            ease: EASE,
            stagger: { amount: 0.4, from },
            delay: current >= 0 ? 0.4 : 0,
            overwrite: true,
          });

          gsap.to(countRef.current, { yPercent: (-100 * next) / n, duration: DURATION, ease: EASE, overwrite: true });
          current = next;
        };

        // The first quote rises in as the section comes into view
        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          once: true,
          onEnter: () => current < 0 && show(0),
        });

        // Each quote holds an equal share of the pin; its bar fills as the page scrolls through it
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * SCREENS_PER_QUOTE * n}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress * n;
            fillRefs.current.forEach((fill, i) => gsap.set(fill, { scaleX: gsap.utils.clamp(0, 1, p - i) }));
            show(Math.min(n - 1, Math.floor(p)));
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#1B123D] text-white px-4 md:px-8 lg:px-10 py-24 md:py-32 motion-safe:flex motion-safe:flex-col motion-safe:h-svh motion-safe:pt-24 motion-safe:pb-8 md:motion-safe:pt-28 md:motion-safe:pb-10"
    >
      {/* Heading on the left, the quote count on the right */}
      <div className="shrink-0 flex items-center justify-between  ">
        <h2
          data-reveal="words"
          className=" text-white uppercase "
        >
          Voices from the Industry
        </h2>
        <div
          aria-hidden="true"
          className="motion-reduce:hidden flex items-baseline gap-1.5 font-['SwitzerL'] text-white/40 text-[14px] leading-[1.1] tabular-nums"
        >
          <span className="block h-[1.1em] overflow-hidden text-white">
            <span ref={countRef} className="block">
              {quotes.map((q, i) => (
                <span key={q.name} className="block h-[1.1em]">
                  {pad(i + 1)}
                </span>
              ))}
            </span>
          </span>
          / {pad(quotes.length)}
        </div>
      </div>

      {/* The stage: all three quotes share one grid cell, so it is as tall as the longest */}
      <div
        ref={stageRef}
        className="grid flex-1 items-start gap-16 md:gap-24 mt-14 md:mt-20 motion-safe:mt-0 pt-10 "
      >
        {quotes.map((q, i) => (
          <figure
            key={q.name}
            data-quote
            className={`motion-safe:col-start-1 motion-safe:row-start-1 mx-auto w-full max-w-5xl text-center ${
              i ? "motion-safe:opacity-0" : ""
            }`}
          >
            <span
              data-mark
              aria-hidden="true"
              className="block mb-4 md:mb-6 font-['SwitzerB'] text-[#e2a866] text-[56px] md:text-[72px] leading-[0.6] select-none"
            >
              “
            </span>

            <blockquote>
              <p className="font-['SwitzerR'] text-white/90 text-[24px]! md:text-[34px]! xl:text-[42px]! leading-[1.3]! tracking-[-0.01em] text-balance">
                {q.quote}
              </p>
            </blockquote>

            <figcaption className="mt-8 md:mt-10">
              <span aria-hidden="true" className="block mx-auto mb-5 h-px w-10 bg-white/25" />
              <span className="block font-['SwitzerSB'] text-white text-[16px] md:text-[18px]">{q.name}</span>
              <span className="block mt-1 text-white/55 text-[13px] md:text-[14px]">
                {q.role} · {q.date}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* One bar per quote, filling as the page scrolls through it */}
      <div aria-hidden="true" className="motion-reduce:hidden shrink-0 flex justify-center gap-2">
        {quotes.map((q, i) => (
          <span key={q.name} className="relative h-[2px] w-12 md:w-16 overflow-hidden bg-white/15">
            <span
              ref={(el) => {
                fillRefs.current[i] = el;
              }}
              className="absolute inset-0 origin-left bg-[#e2a866]"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
