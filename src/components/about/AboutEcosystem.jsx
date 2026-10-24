"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

const ecosystemItems = [
  {
    title: "Whistling Woods",
    description:
      "20-acre Film City campus recognized globally by The Hollywood Reporter, educating 1,300+ annual students across direction, cinematography, animation, and media business.",
    image: "/img/ma/WhistlingWoods.jpg",
  },
  {
    title: "Mukta A2 Cinemas",
    description:
      "Premium screens operating across Tier 1 & Tier 2 metropolitan hubs and the Kingdom of Bahrain, featuring 4K digital projection, Dolby Atmos sound, and premium hospitality.",
    image: "/img/ma/MuktaA2Cinemas.jpg",
  },
  {
    title: "Production & Distribution",
    description:
      "Stewardship of 42+ iconic cinematic master titles alongside contemporary co-productions, commanding perpetual worldwide streaming and broadcast monetization rights.",
    image: "/img/ma/MuktaArtProduction.png",
  },
  {
    title: "Mukta VN Films & Studios",
    description:
      "Audeus post-production suites offering state-of-the-art Dolby Atmos mixing, color grading, mastering, and audio restoration facilities for leading Indian and global filmmakers.",
    image: "/img/ma/MuktaVNFilms.jpg",
  },
];

const AboutEcosystem = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!imageRef.current || !containerRef.current) return;

    // Use GSAP quickTo for highly performant, smooth follow-cursor animations
    const xTo = gsap.quickTo(imageRef.current, "x", {
      duration: 0.7,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(imageRef.current, "y", {
      duration: 0.7,
      ease: "power3.out",
    });
    const rotateTo = gsap.quickTo(imageRef.current, "rotation", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handleMouseMove = (e) => {
      // We position absolute relative to the container
      const rect = containerRef.current.getBoundingClientRect();

      // Image dimensions (used to center the cursor inside the image)
      const imageWidth = 280;
      const imageHeight = 340;

      const x = e.clientX - rect.left - imageWidth / 2;
      const y = e.clientY - rect.top - imageHeight / 2;
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const rotation = normalizedX * 12;

      xTo(x);
      yTo(y);
      rotateTo(rotation);
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 md:py-32 bg-[#FAFAFA]"
    >
      <div className="w-full mx-auto px-4 md:px-8 ">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left: Heading */}
          <div className="lg:w-1/3">
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-black sticky top-32 leading-[1.1]">
              The Ecosystem
            </h2>
          </div>

          {/* Right: List */}
          <div className="lg:w-2/3 flex flex-col">
            {ecosystemItems.map((item, index) => (
              <div
                key={index}
                className="group border-t border-black/15 py-10 md:py-14 flex flex-col md:flex-row justify-between gap-6 md:gap-12 cursor-pointer transition-colors"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="md:w-5/12">
                  <h5 className="text-2xl md:text-3xl font-medium text-black group-hover:text-gray-700 transition-colors">
                    {item.title}
                  </h5>
                </div>
                <div className="md:w-7/12">
                  <p className="text-[#555] text-base md:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
            {/* Bottom border for the last item */}
            <div className="border-t border-black/15"></div>
          </div>
        </div>
      </div>

      {/* Floating Image */}
      <div
        ref={imageRef}
        className="pointer-events-none absolute left-0 top-0 z-50 w-[280px] h-[340px] hidden lg:block"
      >
        <div
          className={`w-full h-full relative overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${hoveredIndex !== null
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90"
            }`}
        >
          {ecosystemItems.map((item, idx) => (
            <Image
              key={idx}
              src={item.image}
              alt={item.title}
              fill
              className={`object-cover transition-opacity duration-500 ${hoveredIndex === idx ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutEcosystem;
