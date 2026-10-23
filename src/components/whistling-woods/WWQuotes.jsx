"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import useScrollReveal from "@/hooks/useScrollReveal";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  EASE,
  DURATION,
  DURATION_LONG,
  RISE,
  MOTION_OK,
  MOTION_REDUCED,
} from "@/lib/motion";

// Three of the quotes in the client's WWIL_QUOTES.pdf (/img/final/WW/pdf), word for word and in
// the order it lists them, with the date it gives for each visit.
const quotes = [
  {
    name: "Shabana Azmi",
    role: "Actor",
    date: "2006-03-30",
    quote: "Trust Subhash to do what we all have dreamed of doing for so long. You have all my support.",
  },
  {
    name: "Rajkumar Hirani",
    role: "Filmmaker",
    date: "2010-01-20",
    quote: "Whistling Woods, All IZZ Well!",
  },
  {
    name: "Kamal Haasan",
    role: "Actor and Filmmaker",
    date: "2014-07-18",
    quote: "A river water never returns to the fountain’s head unless through osmosis as rain. I have this rare opportunity of returning to the very womb of filmmakers: the film school. Truly a pleasure.",
  },
];

const pad = (n) => String(n).padStart(2, "0");
const EASE_CSS = "ease-[cubic-bezier(0.215,0.61,0.355,1)]"; // power3.out, the same curve as EASE

// "30 March 2006", as the PDF writes it. Read as UTC so it is the same day in every time zone.
const longDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Where a card sits in the deck: the front one, then each one behind it a little lower and
// narrower, so its bottom edge peeks out under the card in front. Cards deeper than the last
// step (if more quotes are added) wait unseen behind it.
const STACK = [
  { y: 0, scale: 1, opacity: 1 },
  { y: 18, scale: 0.95, opacity: 0.5 },
  { y: 36, scale: 0.9, opacity: 0.22 },
];
const n = quotes.length;
const depthOf = (i, front) => (i - front + n) % n;
const placement = (d) => {
  const step = STACK[Math.min(d, STACK.length - 1)];
  return { y: step.y, scale: step.scale, autoAlpha: d < STACK.length ? step.opacity : 0, zIndex: n - d };
};

// The deck as the server draws it (the first quote in front), so it is stacked before scripts run.
// GSAP takes over from these values; React never changes them after the first render.
const initialStyle = (i) => {
  const { y, scale, autoAlpha, zIndex } = placement(depthOf(i, 0));
  return { transform: `translateY(${y}px) scale(${scale})`, opacity: autoAlpha, zIndex };
};

const arrowClass =
  "grid place-items-center size-11 md:size-12 rounded-full border border-white/25 text-white cursor-pointer transition-colors duration-300 hover:bg-white hover:border-white hover:text-[#1B123D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e2a866]";

export default function WWQuotes() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const activeRef = useRef(0);
  const showRef = useRef(null);
  const [active, setActive] = useState(0);

  // Heading word by word, and the deck rises in as one piece
  useScrollReveal(sectionRef);

  // One quote at a time, on the front card of a small deck. Next sends the front card up and away
  // and it slips in at the back, while the one behind comes forward; previous brings the back card
  // down in front. The new quote then rises in word by word. With reduced motion the cards simply
  // swap places.
  useGSAP(
    () => {
      const cards = gsap.utils.toArray("[data-card]", stageRef.current);
      if (!cards.length) return;
      const contents = cards.map((card) => card.querySelector("[data-content]"));
      gsap.set(cards, { transformOrigin: "50% 100%" });

      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        const show = (front) => {
          cards.forEach((card, i) => gsap.set(card, placement(depthOf(i, front))));
          contents.forEach((el, i) => gsap.set(el, { autoAlpha: i === front ? 1 : 0 }));
        };
        show(activeRef.current);
        showRef.current = show;
        return () => {
          showRef.current = null;
        };
      });

      mm.add(MOTION_OK, () => {
        // Each card's quote moves as one sequence: its quote mark, its words, then the name
        const parts = cards.map((card) => [
          card.querySelector("[data-mark]"),
          ...SplitText.create(card.querySelector("blockquote"), { type: "words" }).words,
          card.querySelector("figcaption"),
        ]);
        gsap.set(contents, { autoAlpha: 1 }); // the cards behind are hidden by class until now
        gsap.set(parts.flat(), { autoAlpha: 0 });
        cards.forEach((card, i) => gsap.set(card, placement(depthOf(i, activeRef.current))));

        let current = activeRef.current;
        let revealed = false;
        const timelines = [];

        const riseIn = (i, dir, at) =>
          timelines[i].fromTo(
            parts[i],
            { y: RISE * dir, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: DURATION_LONG, ease: EASE, stagger: { amount: 0.4, from: dir > 0 ? "start" : "end" } },
            at
          );

        const show = (next, dir = 1) => {
          if (next === current && revealed) return;
          const prev = current;
          current = next;
          revealed = true;

          cards.forEach((card, i) => {
            // Start each card from wherever a quick earlier click left it
            timelines[i]?.kill();
            const tl = (timelines[i] = gsap.timeline());
            const target = placement(depthOf(i, next));

            if (i === next && i === prev) {
              riseIn(i, 1, 0); // the first quote, as the section comes into view
            } else if (i === prev && dir > 0) {
              // The old front card lifts away above the deck, then rejoins it at the back
              tl.set(card, { zIndex: n + 1 })
                .to(card, { y: -RISE * 2, autoAlpha: 0, duration: 0.5, ease: "power2.in" })
                .set(parts[i], { autoAlpha: 0 })
                .set(card, { ...target, autoAlpha: 0 })
                .to(card, { autoAlpha: target.autoAlpha, duration: 0.4, ease: EASE });
            } else if (i === prev) {
              // Going back: the old front card steps back one place, its quote fading as it goes
              tl.set(card, { zIndex: target.zIndex })
                .to(parts[i], { autoAlpha: 0, duration: 0.3, ease: "power2.in", stagger: { amount: 0.1, from: "end" } }, 0)
                .to(card, { ...target, duration: DURATION, ease: EASE }, 0);
            } else if (i === next && dir < 0) {
              // Going back: the card from the back comes down in front, from just above the deck
              tl.set(card, { zIndex: n + 1, y: -RISE * 2, scale: 1, autoAlpha: 0 })
                .to(card, { y: 0, autoAlpha: 1, duration: DURATION, ease: EASE })
                .set(card, { zIndex: target.zIndex });
              riseIn(i, dir, 0.25);
            } else if (i === next) {
              // The card behind comes forward as the old one lifts away
              tl.set(card, { zIndex: target.zIndex }).to(card, { ...target, duration: DURATION, ease: EASE }, 0.15);
              riseIn(i, dir, 0.4);
            } else {
              // A card moving back one place (its quote is already hidden, unless a quick click
              // caught it mid-exit)
              tl.set(card, { zIndex: target.zIndex })
                .to(parts[i], { autoAlpha: 0, duration: 0.2 }, 0)
                .to(card, { ...target, duration: DURATION, ease: EASE }, 0.15);
            }
          });
        };
        showRef.current = show;

        // The first quote rises in as the section comes into view
        ScrollTrigger.create({
          trigger: stageRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => !revealed && show(activeRef.current),
        });

        return () => {
          timelines.forEach((tl) => tl?.kill());
          showRef.current = null;
        };
      });
    },
    { scope: sectionRef }
  );

  // dir 1 is next, -1 previous; both wrap around
  const go = (dir) => {
    const i = (activeRef.current + dir + n) % n;
    activeRef.current = i;
    setActive(i);
    showRef.current?.(i, dir);
  };

  // The quote count rolls to the current number (as on the SGM showreel), then previous / next
  const controls = (
    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
      <div aria-hidden="true" className="flex items-baseline gap-1.5 font-mono text-sm tracking-widest text-white/50 tabular-nums">
        <span className="block h-[1.25em] overflow-hidden text-white">
          <span
            className={`block transition-transform duration-700 motion-reduce:transition-none ${EASE_CSS}`}
            style={{ transform: `translateY(${(-100 * active) / n}%)` }}
          >
            {quotes.map((q, i) => (
              <span key={q.name} className="block h-[1.25em] leading-[1.25em]">
                {pad(i + 1)}
              </span>
            ))}
          </span>
        </span>
        / {pad(n)}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous quote" className={arrowClass}>
          <RiArrowLeftLine size={20} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next quote" className={arrowClass}>
          <RiArrowRightLine size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="bg-[#1B123D] text-white py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10 overflow-hidden">
      <h2 data-reveal="words" className="tracking-tight max-w-4xl text-balance mb-12 md:mb-16">
        Voices from the Industry
      </h2>

      {/* The deck: every card shares one grid cell, so all are as tall as the longest quote. The
          padding below leaves room for the edges of the cards behind. */}
      <div data-reveal="rise" className="pb-9">
        <div ref={stageRef} aria-live="polite" className="grid">
          {quotes.map((q, i) => (
            <figure
              key={q.name}
              data-card
              aria-hidden={i !== active}
              style={initialStyle(i)}
              className="col-start-1 row-start-1 bg-[#FAFAFA] text-black rounded-sm shadow-2xl"
            >
              {/* Set like Subhash Ghai's quote on his page: the ringed quote mark, the quote
                  centred, a short rule, then who said it */}
              <div
                data-content
                className={`flex h-full flex-col items-center justify-center text-center px-6 py-12 md:px-12 md:py-16 lg:py-20 ${
                  i ? "invisible" : ""
                }`}
              >
                <span
                  data-mark
                  aria-hidden="true"
                  className="grid place-items-center size-10 md:size-12 mb-6 md:mb-8 rounded-full border border-black/10 text-[#e2a866]"
                >
                  <svg className="size-4 md:size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </span>

                <blockquote className="max-w-5xl font-['SwitzerM'] text-black text-[22px] sm:text-[26px] md:text-[32px] xl:text-[2.5rem] leading-[1.3] md:leading-[1.22] tracking-tight text-balance">
                  “{q.quote}”
                </blockquote>

                <figcaption className="flex flex-col items-center">
                  <span aria-hidden="true" className="block w-12 h-[2px] bg-black/20 my-8 md:my-10" />
                  <span className="font-['SwitzerSB'] text-black text-sm md:text-base tracking-wider uppercase">{q.name}</span>
                  {/* <span className="mt-1 text-gray-500 text-xs md:text-sm tracking-widest uppercase">
                    {q.role}
                    <span aria-hidden="true"> · </span>
                    <time dateTime={q.date} className="tabular-nums">
                      {longDate(q.date)}
                    </time>
                  </span> */}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>

       <div data-reveal="rise" className="hidden md:block md:pb-2">
          {controls}
        </div>

      <div className="md:hidden mt-6 ">{controls}</div>
    </section>
  );
}
