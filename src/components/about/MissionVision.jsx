"use client";

import { useRef } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

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
    endValue: 37,
    suffix: "",
    label: "Mukta A2 Cinemas",
    text: "Mukta A2 Cinemas brings diverse cinematic experiences to audiences through its exhibition network.",
  },
];

const MissionVision = () => {
  const sectionRef = useRef(null);

  // The headline reveals line by line; each number counts up once, when it enters the viewport
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-[#FAFAFA]"
    >
      <div className="mx-auto px-4 md:px-8">
        {/* Top Content */}
        <div className="flex flex-col items-center justify-center mb-24 md:mb-32">
          <h5
            data-reveal="lines"
            className="text-3xl md:text-5xl lg:text-[3.25rem] text-center text-black max-w-[1050px] leading-[1.25] md:leading-[1.3] font-normal tracking-tight"
          >
            Building an enduring ecosystem for Indian entertainment by creating compelling stories, nurturing creative talent and bringing the magic of cinema to audiences across generations.
          </h5>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-between border-l border-black/10 pl-6 md:pl-10 sm:min-h-[300px] md:min-h-[350px]"
            >
              <div>
                {/* Server-rendered at the final value; counts up from 0 once it scrolls into view */}
                <h3
                  data-reveal="count"
                  data-count-to={stat.endValue}
                  data-count-suffix={stat.suffix}
                  className="text-5xl lg:text-[4rem] font-normal text-black tracking-tight tabular-nums"
                >
                  {`${stat.endValue}${stat.suffix}`}
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
