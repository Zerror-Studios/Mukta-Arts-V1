"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RiFacebookFill, RiTwitterXLine } from "@remixicon/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const team = [
  {
    name: "Subhash Ghai",
    titles: [
      "Executive Chairman: Mukta Arts Ltd",
      "Founder/Chairman: Whistling Woods International",
      "Director - Mukta A2 Cinemas Private Ltd",
    ],
    image: "/img/last/2.avif",
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

  useGSAP(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${team.length * 150}`, // Scrolling length to get through all members
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          let progress = self.progress;
          let newIndex = Math.round(progress * (team.length - 1));

          const itemHeight = 48; // Corresponds to h-12
          const trackHeight = lineTrackRef.current ? lineTrackRef.current.offsetHeight : (team.length - 1) * itemHeight;
          const currentLineHeight = progress * trackHeight;

          // Draw the line and indicator smoothly and continuously based on raw scroll progress
          gsap.set(indicatorRef.current, { y: currentLineHeight });
          gsap.set(lineFillRef.current, { height: currentLineHeight });

          setActiveIndex((prev) => {
            if (prev !== newIndex) {
              const targetY = newIndex * itemHeight;

              // Auto-scroll the names list up if it goes beyond the visible container
              if (namesInnerRef.current && namesInnerRef.current.parentElement) {
                const containerHeight = namesInnerRef.current.parentElement.offsetHeight;
                if (targetY > containerHeight / 2) {
                  gsap.to(namesInnerRef.current, {
                    y: -(targetY - containerHeight / 2 + itemHeight),
                    duration: 0.3,
                    ease: "power2.out"
                  });
                } else {
                  gsap.to(namesInnerRef.current, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }
              }

              return newIndex;
            }
            return prev;
          });
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const activePerson = team[activeIndex];

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] bg-[#00609C] flex items-center overflow-hidden py-6 lg:py-10">
      <div className="w-full mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-4 lg:gap-16 w-full h-full lg:max-h-[700px]">

        {/* Left Column: Heading */}
        <div className="lg:w-3/12 flex flex-col justify-start lg:pt-10 shrink-0">
          <p className="text-white/80 text-xs lg:text-sm tracking-wide uppercase mb-1 lg:mb-3">Board Of Directors</p>
          <h5 className="text-3xl lg:text-5xl font-semibold text-white leading-tight tracking-tight">
            People Behind<br className="hidden lg:block" /> The Vision
          </h5>
        </div>

        {/* Middle Column: Names List */}
        <div className="lg:w-4/12 relative h-[30vh] lg:h-full lg:max-h-full flex items-start shrink-0">
          {/* Scrollable Container (hidden overflow, controlled by GSAP) */}
          <div className="relative w-full h-full overflow-hidden">
            <div ref={namesInnerRef} className="w-full relative flex flex-col">
              {team.map((person, i) => (
                <div
                  key={i}
                  className={`h-12 flex items-center transition-all duration-300 ${activeIndex === i ? 'text-white text-lg lg:text-[1.35rem] font-medium' : 'text-white/50 text-base lg:text-[1.05rem] font-light'
                    }`}
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right Border Line & Indicator */}
          <div ref={lineTrackRef} className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/20">
            {/* Bold solid line that draws down */}
            <div
              ref={lineFillRef}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] bg-white"
              style={{ height: '0px' }}
            ></div>

            {/* Indicator Square */}
            <div
              ref={indicatorRef}
              className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-white top-0 -translate-y-1/2"
            ></div>
          </div>
        </div>

        {/* Right Column: Person Info */}
        <div className="lg:w-5/12 flex-1 flex flex-col justify-start lg:justify-center lg:pl-12 relative min-h-0 mt-4 lg:mt-0">

          <div className="relative w-full shrink-0 aspect-[16/9] lg:aspect-[4/3] mb-4 lg:mb-6 overflow-hidden bg-black/10 shadow-xl transition-all duration-500">
            <Image
              src={activePerson.image}
              alt={activePerson.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>

          <div className="text-white text-xs md:text-[0.95rem] space-y-1 mb-4 lg:mb-8 opacity-90 font-light overflow-y-auto">
            {activePerson.titles.map((title, i) => (
              <p key={i}>{title}</p>
            ))}
          </div>

          <div className="flex gap-3 lg:gap-4 items-center mt-auto lg:mt-0 pb-4 lg:pb-0">
            <a href="#" className="w-[30px] h-[30px] lg:w-[34px] lg:h-[34px] border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#00609C] transition-colors shrink-0">
              <RiFacebookFill size={14} className="lg:w-4 lg:h-4" />
            </a>
            <a href="#" className="w-[30px] h-[30px] lg:w-[34px] lg:h-[34px] border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#00609C] transition-colors shrink-0">
              <RiTwitterXLine size={14} className="lg:w-4 lg:h-4" />
            </a>
            <a href="#" className="px-3 py-[6px] lg:px-5 lg:py-[7px] border border-white/30 text-[0.6rem] lg:text-xs font-semibold tracking-widest text-white hover:bg-white hover:text-[#00609C] transition-colors uppercase whitespace-nowrap">
              View Full Profile
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TeamMembers;
