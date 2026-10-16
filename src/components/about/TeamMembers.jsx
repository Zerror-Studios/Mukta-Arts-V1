"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    image: "/img/final/about_Img/AB3/RAHUL PURI_6_11zon_5_11zon.webp",
  },
  {
    name: "Parvez Farooqui",
    titles: [
      "Director - Mukta Arts Ltd",
      "Executive Director - Mukta A2 Cinemas Private Ltd",
    ],
    image: "/img/final/about_Img/AB3/PARVEZ FAROOQUI_5_11zon_4_11zon.webp",
  },
  {
    name: "Kapil Bagla",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/final/about_Img/AB3/KAPIL BAGLA_2_11zon_2_11zon.webp",
  },
  {
    name: "Rajendra Doshi",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/final/about_Img/AB3/RAJENDRA DOSHI_4_11zon_6_11zon.webp",
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

const TeamMembers = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const indicatorRef = useRef(null);
  const lineFillRef = useRef(null);
  const lineTrackRef = useRef(null);
  const namesInnerRef = useRef(null);

  // Heading reveal as the section enters
  useScrollReveal(sectionRef);

  // Pinned while the visitor scrolls through the directors
  useGSAP(
    () => {
      let current = 0;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${team.length * 150}`, // Scrolling length to get through all members
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const newIndex = Math.round(progress * (team.length - 1));

          // Draw the line and indicator smoothly and continuously based on raw scroll progress
          const inner = namesInnerRef.current;
          const itemHeight = inner?.firstElementChild?.offsetHeight || 48;
          const trackHeight = lineTrackRef.current ? lineTrackRef.current.offsetHeight : (team.length - 1) * itemHeight;
          const currentLineHeight = progress * trackHeight;
          gsap.set(indicatorRef.current, { y: currentLineHeight });
          gsap.set(lineFillRef.current, { height: currentLineHeight });

          if (newIndex === current) return;
          current = newIndex;
          setActiveIndex(newIndex);

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
    },
    { scope: sectionRef }
  );

  const activePerson = team[activeIndex];

  return (
    <section ref={sectionRef} className="relative w-full h-svh bg-[#FAFAFA] text-black overflow-hidden pt-[calc(5rem+8px)] pb-6 md:pt-[calc(7rem+8px)] lg:pb-12">
      {/* Starts below the fixed header (5rem / 7rem tall) and shares its side padding */}
      <div className="w-full h-full px-6 md:px-8 flex flex-col lg:flex-row gap-5 lg:gap-16">

        {/* Left Column: Heading */}
        <div className="lg:w-3/12 flex flex-col shrink-0">
          <p className="text-[#555] text-[12px]! lg:text-[13px]! leading-none! tracking-wide uppercase mb-2 lg:mb-4">Board of Directors</p>
          <h5 data-reveal="words" className="text-[28px]! lg:text-[clamp(32px,2.6vw,44px)]! leading-[1.1]! font-semibold text-black tracking-tight">
            People Behind<br className="hidden lg:block" /> The Vision
          </h5>
        </div>

        {/* Middle Column: Names List (a three-name scrolling window on phones, the full list from lg) */}
        <div className="lg:w-4/12 relative h-[132px] lg:h-auto lg:self-start flex items-start shrink-0">
          {/* Scrollable Container (hidden overflow, controlled by GSAP) */}
          <div className="relative w-full h-full overflow-hidden">
            <div ref={namesInnerRef} className="w-full relative flex flex-col">
              {team.map((person, i) => (
                <div
                  key={person.name}
                  className={`h-[44px] lg:h-[46px] flex items-center transition-all duration-300 ${activeIndex === i ? "text-black text-[17px] lg:text-[20px] font-medium" : "text-black/40 text-[15px] lg:text-[16px] font-light"
                    }`}
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right Border Line & Indicator, from the first name's centre to the last's */}
          <div ref={lineTrackRef} className="absolute right-0 top-[22px] bottom-[22px] lg:top-[23px] lg:bottom-[23px] w-px bg-black/15">
            {/* Bold solid line that draws down */}
            <div
              ref={lineFillRef}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] bg-black"
              style={{ height: "0px" }}
            ></div>

            {/* Indicator Square */}
            <div
              ref={indicatorRef}
              className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-black top-0 -translate-y-1/2"
            ></div>
          </div>
        </div>

        {/* Right Column: Person Info */}
        <div className="lg:w-5/12 flex-1 flex flex-col lg:pl-12 relative min-h-0">

          {/* The slot takes whatever height the titles and button leave; inside it a 4:5 portrait
              frame takes that height (narrowing to the column if needed), so phones get a portrait, not a crop */}
          <div className="relative flex-1 min-h-0 mb-4 lg:mb-5">
            <div className="relative h-full max-w-full aspect-[4/5] overflow-hidden bg-black/5">
              <Image
                src={activePerson.image}
                alt={activePerson.name}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover object-[50%_20%]"
                priority
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
              <Link
                href={activePerson.profile}
                className="inline-flex items-center gap-2 bg-[#1B123D] hover:bg-[#2A1D5C] text-white px-[22px] py-[11px] text-[13px] leading-none tracking-wider font-semibold rounded-[3px] transition-colors duration-300 group"
              >
                <span>View Full Profile</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default TeamMembers;
