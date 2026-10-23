"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import useScrollReveal from "@/hooks/useScrollReveal";
import { gsap, ScrollTrigger, SplitText, EASE, DURATION_LONG, RISE, MOTION_OK } from "@/lib/motion";

// Three of the quotes in the client's WWIL_QUOTES.pdf (/img/final/WW/pdf), word for word and in
// the order it lists them.
const quotes = [
  {
    name: "Shabana Azmi",
    role: "Actor",
    quote: "Trust Subhash to do what we all have dreamed of doing for so long. You have all my support.",
  },
  {
    name: "Rajkumar Hirani",
    role: "Filmmaker",
    quote: "Whistling Woods, All IZZ Well!",
  },
  {
    name: "Kamal Haasan",
    role: "Actor and Filmmaker",
    quote: "A river water never returns to the fountain’s head unless through osmosis as rain. I have this rare opportunity of returning to the very womb of filmmakers: the film school. Truly a pleasure.",
  },
];

const pad = (n) => String(n).padStart(2, "0");
const EASE_CSS = "ease-[cubic-bezier(0.215,0.61,0.355,1)]"; // power3.out, the same curve as EASE

const Arrow = ({ flip }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={flip ? "rotate-180" : undefined}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const navButton =
  "grid place-items-center size-11 md:size-12 rounded-full border border-white/25 text-white cursor-pointer transition-colors duration-300 hover:bg-white hover:border-white hover:text-[#1B123D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e2a866]";

export default function WWQuotes() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const activeRef = useRef(0);
  const showRef = useRef(null);
  const [active, setActive] = useState(0);

  // Heading word by word
  useScrollReveal(sectionRef);

  // The section is one screen tall and the buttons swap its quotes: the leaving quote lifts out
  // word by word, then the next one rises in (in reverse when going back). With reduced motion
  // the quotes simply swap.
  useGSAP(
    () => {
      const figures = gsap.utils.toArray("[data-quote]", stageRef.current);
      if (!figures.length) return;

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

        const show = (next, dir = 1) => {
          if (next === current) return;
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

          // Pieces still off stage start below (above when going back); any caught mid-exit by
          // a quick change of direction carry on from where they are
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

          current = next;
        };
        showRef.current = show;

        // The first quote rises in as the section comes into view
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
          onEnter: () => current < 0 && show(activeRef.current),
        });

        return () => {
          showRef.current = null;
        };
      });
    },
    { scope: sectionRef }
  );

  // dir 1 brings the quote up from below, -1 down from above; prev/next wrap around
  const go = (next, dir) => {
    const i = (next + quotes.length) % quotes.length;
    activeRef.current = i;
    setActive(i);
    showRef.current?.(i, dir);
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col h-svh overflow-hidden bg-[#1B123D] text-white px-4 md:px-8 lg:px-10 pt-24 pb-8 md:pt-28 md:pb-10"
    >
      {/* Heading on the left, the quote count on the right */}
      <div className="shrink-0 flex items-center justify-between gap-6">
        <h4 data-reveal="words" className="text-white uppercase">
          Voices from <br /> the Industry
        </h4>
        <div
          aria-hidden="true"
          className="flex items-baseline gap-1.5 font-['SwitzerL'] text-white/40 text-[14px] leading-[1.1] tabular-nums"
        >
          <span className="block h-[1.1em] overflow-hidden text-white">
            <span
              className={`block transition-transform duration-700 motion-reduce:transition-none ${EASE_CSS}`}
              style={{ transform: `translateY(${(-100 * active) / quotes.length}%)` }}
            >
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

      {/* The stage: all three quotes share one grid cell, so it is as tall as the longest. On
          large screens the quote mark and name sit in a narrow left column beside the quote. */}
      <div className="flex flex-1 min-h-0 items-center py-4 md:py-8">
        <div ref={stageRef} aria-live="polite" className="grid w-full">
          {quotes.map((q, i) => (
            <figure
              key={q.name}
              data-quote
              aria-hidden={i !== active}
              className={`col-start-1 row-start-1 grid content-start gap-y-5 md:gap-y-7 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-0 ${
                i ? "motion-safe:opacity-0" : ""
              } ${i !== active ? "motion-reduce:invisible" : ""}`}
            >
              <span
                data-mark
                aria-hidden="true"
                className="block lg:col-span-3 font-['SwitzerB'] text-[#e2a866] text-[44px] md:text-[64px] lg:text-[120px] leading-[0.6] lg:leading-[0.75] select-none"
              >
                “
              </span>

              <blockquote className="lg:col-start-4 lg:col-span-9 lg:row-start-1 lg:row-span-2">
                <p className="font-['SwitzerR'] text-white/90 text-[length:clamp(18px,3.6svh,24px)]! md:text-[30px]! xl:text-[length:clamp(30px,6svh,42px)]! leading-[1.3]! tracking-[-0.01em] text-pretty">
                  {q.quote}
                </p>
              </blockquote>

              <figcaption className="lg:col-span-3 lg:row-start-2 lg:self-end">
                <span aria-hidden="true" className="block mb-4 h-px w-10 bg-white/25" />
                <span className="block font-['SwitzerSB'] text-white text-[16px] md:text-[18px]">{q.name}</span>
                <span className="block mt-1 text-white/55 text-[13px] md:text-[14px]">{q.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* One bar per quote (click to jump to it), then previous / next */}
      <div className="shrink-0 flex items-center justify-between gap-6 border-t border-white/15 pt-5 md:pt-6">
        <div className="flex items-center gap-2">
          {quotes.map((q, i) => (
            <button
              key={q.name}
              type="button"
              onClick={() => go(i, Math.sign(i - activeRef.current) || 1)}
              aria-label={`Show quote ${i + 1}: ${q.name}`}
              aria-current={i === active ? "true" : undefined}
              className="group py-3 cursor-pointer"
            >
              <span className="relative block h-[2px] w-10 md:w-16 overflow-hidden bg-white/15 transition-colors group-hover:bg-white/30">
                <span
                  className={`absolute inset-0 origin-left bg-[#e2a866] transition-transform duration-700 motion-reduce:transition-none ${EASE_CSS} ${
                    i === active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => go(activeRef.current - 1, -1)} aria-label="Previous quote" className={navButton}>
            <Arrow flip />
          </button>
          <button type="button" onClick={() => go(activeRef.current + 1, 1)} aria-label="Next quote" className={navButton}>
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
}
