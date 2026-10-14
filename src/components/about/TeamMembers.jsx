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
    image: "/img/last/2.avif",
    profile: "/subhash-ghai",
  },
  {
    name: "Rahul Puri",
    titles: [
      "Managing Director - Mukta Arts Ltd",
      "Director - Academics - Whistling Woods International",
      "Director - Mukta A2 Cinemas Private Ltd",
    ],
    image: "/img/last/3.jpg",
  },
  {
    name: "Parvez Farooqui",
    titles: [
      "Director - Mukta Arts Ltd",
      "Executive Director - Mukta A2 Cinemas Private Ltd",
    ],
    image: "/img/last/4.avif",
  },
  {
    name: "Kapil Bagla",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/last/5.png",
  },
  {
    name: "Rajendra Doshi",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/last/6.jpg",
  },
  {
    name: "Madhumati Ramchandra Lele",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/last/7.jpg",
  },
  {
    name: "Rentala Chandrashekhar",
    titles: ["Independent Director - Mukta Arts Ltd"],
    image: "/img/last/1.jpg",
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
            gsap.to(inner, {
              y: targetY > containerHeight / 2 ? -(targetY - containerHeight / 2 + itemHeight) : 0,
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
    <section ref={sectionRef} className="relative w-full h-svh bg-[#FAFAFA] text-black flex items-center overflow-hidden pt-20 pb-6 lg:py-10">
      <div className="w-full mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-4 lg:gap-16 h-full lg:max-h-[700px]">

        {/* Left Column: Heading */}
        <div className="lg:w-3/12 flex flex-col justify-start lg:pt-10 shrink-0">
          <p className="text-[#555] text-xs lg:text-sm tracking-wide uppercase mb-1 lg:mb-3">Board of Directors</p>
          <h5 data-reveal="words" className="text-3xl lg:text-5xl font-semibold text-black leading-tight tracking-tight">
            People Behind<br className="hidden lg:block" /> The Vision
          </h5>
        </div>

        {/* Middle Column: Names List */}
        <div className="lg:w-4/12 relative h-[28svh] lg:h-full lg:max-h-full flex items-start shrink-0">
          {/* Scrollable Container (hidden overflow, controlled by GSAP) */}
          <div className="relative w-full h-full overflow-hidden">
            <div ref={namesInnerRef} className="w-full relative flex flex-col">
              {team.map((person, i) => (
                <div
                  key={person.name}
                  className={`h-12 flex items-center transition-all duration-300 ${activeIndex === i ? "text-black text-lg lg:text-[1.35rem] font-medium" : "text-black/40 text-base lg:text-[1.05rem] font-light"
                    }`}
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right Border Line & Indicator */}
          <div ref={lineTrackRef} className="absolute right-0 top-0 bottom-0 w-px bg-black/15">
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
        <div className="lg:w-5/12 flex-1 flex flex-col justify-start lg:justify-center lg:pl-12 relative min-h-0 mt-4 lg:mt-0">

          {/* Fills the space left on phones; a fixed 4:3 frame from lg */}
          <div className="relative w-full flex-1 min-h-[120px] lg:flex-none lg:aspect-[4/3] mb-4 lg:mb-6 overflow-hidden bg-black/5">
            <Image
              src={activePerson.image}
              alt={activePerson.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>

          <div className="text-[#555] text-xs md:text-[0.95rem] space-y-1 mb-4 lg:mb-8 font-light shrink-0">
            {activePerson.titles.map((title) => (
              <p key={title}>{title}</p>
            ))}
          </div>

          {/* Only Subhash Ghai has a profile page; the row keeps its height so nothing jumps */}
          <div className="flex items-center min-h-9 md:min-h-10 shrink-0 mt-auto lg:mt-0 pb-4 lg:pb-0">
            {activePerson.profile && (
              <Link
                href={activePerson.profile}
                className="inline-flex items-center gap-2 bg-[#0474BA] hover:bg-[#0666a1] text-white px-6 py-2.5 text-xs md:text-sm tracking-wider font-semibold rounded-[3px] transition-colors duration-300 group"
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
