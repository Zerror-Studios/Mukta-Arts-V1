"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  {
    endValue: 50,
    suffix: "+",
    label: "Films produced",
    text: "A cinematic legacy spanning iconic films, memorable music and stories that have shaped popular culture.",
  },
  {
    endValue: 4500,
    suffix: "+",
    label: "Creative Alumni in the industry",
    text: "Whistling Woods International empowers the next generation through professional education across film, media and creative arts.",
  },
  {
    endValue: 45,
    suffix: "+",
    label: "Screens",
    text: "Mukta A2 Cinemas brings diverse cinematic experiences to audiences through its exhibition network.",
  },
];

const MissionVision = () => {
  const sectionRef = useRef(null);
  const numbersRef = useRef([]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    tl.fromTo(
      ".mission-headline",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".stat-item",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.4"
    );

    // Animate numbers from 0 in parallel
    const label = "numbersStart";
    tl.addLabel(label, "-=0.8");

    numbersRef.current.forEach((el, index) => {
      const target = { val: 0 };
      const endVal = stats[index].endValue;
      const suffix = stats[index].suffix;

      tl.to(
        target,
        {
          val: endVal,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            if (el) {
              el.innerText = Math.floor(target.val).toLocaleString("en-US") + suffix;
            }
          },
        },
        label
      );
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-[#FAFAFA]"
    >
      <div className="mx-auto px-4 md:px-8">
        {/* Top Content */}
        <div className="flex flex-col items-center justify-center mb-24 md:mb-32">
          <h5 className="mission-headline text-3xl md:text-5xl lg:text-[3.25rem] text-center text-black max-w-[1050px] leading-[1.25] md:leading-[1.3] font-normal tracking-tight">
            Building an enduring ecosystem for Indian entertainment by creating compelling stories, nurturing creative talent and bringing the magic of cinema to audiences across generations.
          </h5>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item flex flex-col justify-between border-l border-black/10 pl-6 md:pl-10 min-h-[300px] md:min-h-[350px]"
            >
              <div>
                <h3
                  ref={(el) => (numbersRef.current[index] = el)}
                  className="text-5xl lg:text-[4rem] font-normal text-black tracking-tight"
                >
                  0{stat.suffix}
                </h3>
                {stat.label && (
                  <p className="text-black font-medium text-base md:text-lg tracking-tight mt-2">
                    {stat.label}
                  </p>
                )}
              </div>
              <p className="text-[#555] text-base md:text-lg leading-relaxed mt-10 md:mt-auto pr-4">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
