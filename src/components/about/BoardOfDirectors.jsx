"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RiAddLine } from "@remixicon/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const directors = [
  {
    name: "Subhash Ghai",
    title: "Executive Chairman - Mukta Arts Ltd",
    image: "/img/last/2.avif",
  },
  {
    name: "Rahul Puri",
    title: "Managing Director - Mukta Arts Ltd",
    image: "/img/last/3.jpg",
  },
  {
    name: "Parvez Farooqui",
    title: "Director - Mukta Arts Ltd",
    image: "/img/last/4.avif",
  },
  {
    name: "Kapil Bagla",
    title: "Independent Director - Mukta Arts Ltd",
    image: "/img/last/5.png",
  },
  {
    name: "Rajendra Doshi",
    title: "Independent Director - Mukta Arts Ltd",
    image: "/img/last/6.jpg",
  },
  {
    name: "Mrs. Madhumati Ramchandra Lele",
    title: "Independent Director - Mukta Arts Ltd",
    image: "/img/last/7.jpg",
  },
  {
    name: "Rentala Chandrashekhar",
    title: "Independent Director - Mukta Arts Ltd",
    // Fallback since we only saw 6 actor images, though we can reuse one
    image: "/img/last/1.jpg",
  },
];

const BoardOfDirectors = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
    });

    tl.fromTo(
      ".director-heading",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    ).fromTo(
      ".director-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "-=0.2"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-24 md:py-32 bg-[#1B123D]">
      {/* Optional: Very faint noise overlay if you want to mimic the texture exactly, but standard solid bg is cleaner */}

      <div className="w-full mx-auto px-4 md:px-8 relative z-10">
        <h2 className="director-heading text-3xl md:text-5xl text-center text-white font-medium mb-16 md:mb-20 tracking-tight">
          Board of Directors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {directors.map((director, index) => (
            <div key={index} className="director-card flex flex-col">
              <div className="relative w-full aspect-[4/5] mb-5 overflow-hidden bg-black/10">
                <Image
                  src={director.image}
                  alt={director.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-white font-medium text-[1.35rem] leading-tight mb-1">
                {director.name}
              </h3>
              <p className="text-white/80 text-[0.85rem] mb-4 font-light tracking-wide">
                {director.title}
              </p>

              <div className="flex gap-2">
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-[#1B123D] transition-colors duration-300"
                  aria-label={`More about ${director.name}`}
                >
                  <RiAddLine size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardOfDirectors;
