"use client";

import React, { useCallback } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import useEmblaCarousel from "embla-carousel-react";

const films = [
  {
    id: 1,
    title: "YAADEIN",
    director: "SUBASH GHAI",
    producer: "SUBASH GHAI",
    image: `/img/home/C1.png`,
    description: "Memories that last forever. A beautiful journey exploring the bonds of family, love, and friendship in modern times."
  },
  {
    id: 2,
    title: "AITRAAZ",
    director: "SUBASH GHAI",
    producer: "SUBASH GHAI",
    image: `/img/home/C2.png`,
    description: "A gripping tale of ambition and betrayal. When past choices return to haunt the present, one man must fight for his honor."
  },
  {
    id: 3,
    title: "KAANCHI",
    director: "SUBASH GHAI",
    producer: "SUBASH GHAI",
    image: `/img/home/C3.png`,
    description: "The unbreakable spirit of a young woman fighting against power and corruption to seek justice for her loved ones."
  },
  {
    id: 4,
    title: "YAADEIN",
    director: "SUBASH GHAI",
    producer: "SUBASH GHAI",
    image: `/img/home/C1.png`,
    description: "An emotional rollercoaster that touches upon the delicate relationship between a father and his three daughters."
  },
  {
    id: 5,
    title: "AITRAAZ",
    director: "SUBASH GHAI",
    producer: "SUBASH GHAI",
    image: `/img/home/C2.png`,
    description: "Navigating the complexities of corporate life and personal ethics in a thrilling courtroom drama that keeps you guessing."
  },
  {
    id: 6,
    title: "KAANCHI",
    director: "SUBASH GHAI",
    producer: "SUBASH GHAI",
    image: `/img/home/C3.png`,
    description: "A cinematic masterpiece that captures the breathtaking beauty of the mountains and the fierce fire of revolution."
  },
  {
    id: 7,
    title: "YAADEIN",
    director: "SUBASH GHAI",
    producer: "SUBASH GHAI",
    image: `/img/home/C1.png`,
    description: "Experience the magic of true love and the pain of heartbreak in this classic tale of romance and family values."
  },
  {
    id: 8,
    title: "KAANCHI",
    director: "SUBASH GHAI",
    producer: "SUBASH GHAI",
    image: `/img/home/C2.png`,
    description: "A story of courage, resilience, and the relentless pursuit of truth against all odds in a world driven by greed."
  },
];

const FilmsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    duration: 60,
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="relative w-full py-16 px-4 md:px-8 lg:px-12  film-section-wrapper z-[20]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 ">
        <h2 className="text-6xl md:text-8xl font-medium tracking-tight mr-auto">Films.</h2>
        {/* <div className="flex gap-4 pb-2">
          <button
            type="button"
            onClick={scrollPrev}
            className="p-3 border border-gray-300 rounded hover:bg-gray-100 transition-colors relative z-10 cursor-pointer"
          >
            <RiArrowLeftLine size={24} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="p-3 border border-gray-300 rounded hover:bg-gray-100 transition-colors relative z-10 cursor-pointer"
          >
            <RiArrowRightLine size={24} />
          </button>
        </div> */}
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-8">
          {films.map((film) => (
            <div
              key={film.id}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.3333%] pl-8"
            >
              <div className="flex flex-col group cursor-pointer h-full">
                {/* Image */}
                <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden ">
                  <img
                    src={film.image}
                    alt={film.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col  ">
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide ">
                    {film.title}
                  </h3>

                  <div className="relative py-4 mt-auto">
                    {/* Top animated line (draws left to right) */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-black/20">
                      <div className="absolute top-0 left-0 h-full bg-black w-0 transition-all duration-500 ease-out group-hover:w-full"></div>
                    </div>

                    <h3 className=" tracking-tighter capitalize opacity-75 ">
                      {film.description}
                    </h3>
                  </div>

                  {/* Bottom animated line (draws right to left) */}
                  <div className="relative w-full h-[1px] bg-black/20">
                    <div className="absolute top-0 right-0 h-full bg-black w-0 transition-all duration-500 ease-out group-hover:w-full delay-75"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilmsSection;
