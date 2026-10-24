"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion";
import useScrollReveal from "@/hooks/useScrollReveal";

const team = [
  {
    name: "Subhash Ghai",
    titles: [
      "Executive Chairman: Mukta Arts Ltd",
      "Founder/Chairman: Whistling Woods International",
      "Director - Mukta A2 Cinemas Private Ltd",
    ],
    image: "/img/final/about_Img/AB3/1_7_11zon_1_11zon.webp",
    profile: "/subhash-ghai",
  },
  {
    name: "Rahul Puri",
    titles: [
      "Managing Director - Mukta Arts Ltd",
      "Director - Academics - Whistling Woods International",
      "Director - Mukta A2 Cinemas Private Ltd",
    ],
    image: "/img/final/about_Img/AB3/web/RAHUL PURI_6_11zon_5_11zon.webp",
  },
  {
    name: "Parvez Farooqui",
    titles: [
      "Director - Mukta Arts Ltd",
      "Executive Director - Mukta A2 Cinemas Private Ltd",
    ],
    image: "/img/final/about_Img/AB3/web/PARVEZ FAROOQUI_5_11zon_4_11zon.webp",
  },
  {
    name: "Kapil Bagla",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/final/about_Img/AB3/KAPIL BAGLA_2_11zon_2_11zon.webp",
  },
  {
    name: "Rajendra Doshi",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/final/about_Img/AB3/web/RAJENDRA DOSHI_4_11zon_6_11zon.webp",
  },
  {
    name: "Madhumati Ramchandra Lele",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/final/about_Img/AB3/MADHUMATI LELE_3_11zon_3_11zon.webp",
  },
  {
    name: "Rentala Chandrashekhar",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/final/about_Img/AB3/RENTALA CHANDRASHEKHAR_1_11zon_7_11zon.webp",
  },
];

// Phones, upright or on their side, see the whole board at once (the Chairman first, full width,
// then the directors in a grid); anything bigger pins the section and scrolls through them.
// Keep DESK in step with the `phone` variant in globals.css.
const DESK = "(min-width: 768px) and (min-height: 501px)";
const [chairman, ...directors] = team;

const TeamMembers = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const indicatorRef = useRef(null);
  const lineFillRef = useRef(null);
  const lineTrackRef = useRef(null);
  const namesInnerRef = useRef(null);

  // Heading reveal as the section enters
  useScrollReveal(sectionRef);

  // Pinned while the visitor scrolls through the directors (not on phones)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESK, () => {
        let current = 0;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${team.length * 150}`, // Scrolling length to get through all members
          pin: true,
          // Sets the pin a moment early on a fast flick, so it doesn't visibly jump as it catches the
          // section (on touch screens the page scrolls ahead of the script)
          anticipatePin: 1,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.round(progress * (team.length - 1));

            // Draw the line and indicator smoothly and continuously based on raw scroll progress.
            // Both by transform (the line is scaled down its full height), so no scroll frame
            // makes the browser lay the section out again.
            const inner = namesInnerRef.current;
            const trackHeight = lineTrackRef.current?.offsetHeight ?? 0;
            gsap.set(indicatorRef.current, { y: progress * trackHeight });
            gsap.set(lineFillRef.current, { scaleY: progress });

            if (newIndex === current) return;
            current = newIndex;
            setActiveIndex(newIndex);
            const itemHeight = inner?.firstElementChild?.offsetHeight || 48;

            // Auto-scroll the names list up if it goes beyond the visible container
            if (inner && inner.parentElement) {
              const targetY = newIndex * itemHeight;
              const containerHeight = inner.parentElement.offsetHeight;
              const maxShift = Math.max(0, inner.offsetHeight - containerHeight);
              // Keep the active name centred in the window
              gsap.to(inner, {
                y: -Math.min(maxShift, Math.max(0, targetY - (containerHeight - itemHeight) / 2)),
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
        });
      });
    },
    { scope: sectionRef }
  );

  const activePerson = team[activeIndex];

  return (
    <section ref={sectionRef} className="relative w-full h-svh bg-[#FAFAFA] text-black overflow-hidden pt-[calc(5rem+8px)] pb-6 md:pt-[calc(7rem+8px)] lg:pb-12 phone:h-auto phone:overflow-visible phone:pt-4 phone:pb-10">
      {/* Starts below the fixed header (5rem / 7rem tall) and shares its side padding; on phones
          the section isn't pinned, so it just follows the one above */}
      <div className="w-full h-full px-6 md:px-8 flex flex-col lg:flex-row gap-5 lg:gap-16">

        {/* Left Column: Heading */}
        <div className="lg:w-3/12 flex flex-col shrink-0">
          <p className="text-[#555] text-[12px]! lg:text-[13px]! leading-none! tracking-wide uppercase mb-2 lg:mb-4">Board of Directors</p>
          <h4 data-reveal="words" className="text-[28px]! lg:text-[clamp(32px,2.6vw,44px)]! leading-[1.1]! font-semibold text-black tracking-tight">
            People Behind<br className="hidden lg:block" /> The Vision
          </h4>
        </div>

        {/* Middle Column: Names List (a three-name scrolling window on tablets, the full list from lg) */}
        <div className="lg:w-4/12 relative h-[132px] lg:h-auto lg:self-start flex items-start shrink-0 sm:mt-8 phone:hidden">
          {/* Scrollable Container (hidden overflow, controlled by GSAP) */}
          <div className="relative w-full h-full overflow-hidden">
            <div ref={namesInnerRef} className="w-full relative flex flex-col gap-2">
              {team.map((person, i) => (
                <h5
                  key={person.name}
                  className={`h-[44px] lg:h-[46px] flex items-center transition-all duration-300 ${activeIndex === i ? "text-black text-[17px] lg:text-[20px] font-medium" : "text-black/40 text-[15px] lg:text-[16px] font-light"
                    }`}
                >
                  {person.name}
                </h5>
              ))}
            </div>
          </div>

          {/* Right Border Line & Indicator, from the first name's centre to the last's */}
          <div ref={lineTrackRef} className="absolute right-0 top-[22px] bottom-[22px] lg:top-[23px] lg:bottom-[23px] w-px bg-black/15">
            {/* Bold solid line that draws down */}
            <div
              ref={lineFillRef}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full origin-top bg-black"
              style={{ transform: "scaleY(0)" }}
            ></div>

            {/* Indicator Square */}
            <div
              ref={indicatorRef}
              className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-black top-0 -translate-y-1/2"
            ></div>
          </div>
        </div>

        {/* Right Column: Person Info */}
        <div className="lg:w-5/12 flex-1 flex flex-col lg:pl-12 relative min-h-0 phone:hidden">

          {/* The slot takes whatever height the titles and button leave; inside it a 4:5 portrait
              frame takes that height (narrowing to the column if needed), so tablets get a portrait, not a crop */}
          <div className="relative flex-1 min-h-0 mb-4 lg:mb-5">
            <div className="relative h-full max-w-full aspect-[4/5] overflow-hidden bg-black/5">
              <Image
                src={activePerson.image}
                alt={activePerson.name}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
          </div>

          {/* Three lines tall for everyone, so the photo doesn't resize between directors */}
          <div className="text-[#555] min-h-[57px] md:min-h-[61px] lg:min-h-[66px] mb-4 lg:mb-5 font-light shrink-0">
            {activePerson.titles.map((title) => (
              <p key={title} className="text-[13px]! md:text-[14px]! lg:text-[15px]! leading-[1.45]!">{title}</p>
            ))}
          </div>

          {/* Only Subhash Ghai has a profile page; the row keeps its height so nothing jumps */}
          <div className="flex items-center min-h-[42px] shrink-0">
            {activePerson.profile && (
              <Button href={activePerson.profile}>
                View Full Profile
              </Button>
            )}
          </div>

        </div>

        {/* Phones: the Chairman full width, then the directors two to a row (three on a phone
            turned sideways), each with their photo, name and titles */}
        <div className="hidden phone:block mt-3">
          <article data-reveal="rise" className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-8">
            <div className="relative w-full sm:w-2/5 aspect-[4/5] overflow-hidden bg-black/5 shrink-0">
              <Image
                src={chairman.image}
                alt={chairman.name}
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
            <div>
              <h5 className="text-[24px]! leading-[1.15]! text-black tracking-tight mb-2">{chairman.name}</h5>
              <div className="text-[#555] mb-5">
                {chairman.titles.map((title) => (
                  <p key={title} className="text-[13px]! leading-[1.45]!">{title}</p>
                ))}
              </div>
              <Button href={chairman.profile}>View Full Profile</Button>
            </div>
          </article>

          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-8 mt-10 pt-10 border-t border-black/10">
            {directors.map((person) => (
              <li key={person.name} data-reveal="rise">
                <div className="relative aspect-[4/5] overflow-hidden bg-black/5 mb-3">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(min-width: 640px) 30vw, 45vw"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
                <h5 className="text-[15px]! leading-[1.25]! text-black mb-1">{person.name}</h5>
                {person.titles.map((title) => (
                  <p key={title} className="text-[12px]! leading-[1.4]! text-[#555]">{title}</p>
                ))}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};

export default TeamMembers;
