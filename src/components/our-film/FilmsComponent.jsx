"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useScrollReveal from "@/hooks/useScrollReveal";

// films come from the Films documents in Sanity, already in release order (see our-films/page.jsx)
export default function FilmsComponent({ films = [] }) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const gridRef = useRef(null);
  const containerRef = useRef(null);

  // Heading word by word, then each film rises in as it enters
  useScrollReveal(containerRef, { start: "top 92%" });

  const handleFilmClick = (e, film) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);

    const card = e.currentTarget;
    const imgContainer = card.querySelector(".relative.w-full.aspect-\\[4\\/5\\]");
    const img = imgContainer.querySelector("img");
    const rect = img.getBoundingClientRect();

    const clone = img.cloneNode();
    clone.id = "transition-clone";
    document.body.appendChild(clone);

    gsap.set(clone, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      zIndex: 9999,
      objectFit: "cover",
      margin: 0
    });

    gsap.set(img, { opacity: 0 });

    const elementsToHide = [
      containerRef.current.querySelector("h2"),
      ...gsap.utils.toArray(".film-card").filter((c) => c !== card.parentElement)
    ];

    gsap.to(elementsToHide, { opacity: 0, duration: 0.4, ease: "power2.inOut" });
    gsap.to(card.querySelectorAll("h3, .relative.py-4, .bg-black\\/20"), {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut"
    });

    const containerWidth = window.innerWidth;
    const px = 40;
    const gap = 48;
    const maxW2xl = 672;

    let targetWidth, targetHeight, targetLeft, targetTop;

    if (containerWidth >= 768) {
      const flexContainerInnerWidth = containerWidth - px * 2;
      const availableForFlexItems = flexContainerInnerWidth - gap;
      let leftWidth = availableForFlexItems / 2;
      let rightWidth = availableForFlexItems / 2;

      if (leftWidth > maxW2xl) {
        leftWidth = maxW2xl;
        rightWidth = availableForFlexItems - leftWidth;
      }

      targetWidth = Math.min(600, rightWidth);
      targetHeight = targetWidth * (5 / 4);
      targetLeft = containerWidth - px - targetWidth;
      targetTop = (window.innerHeight - targetHeight) / 2;
    } else {
      targetWidth = Math.min(600, containerWidth - px * 2);
      targetHeight = targetWidth * (5 / 4);
      targetLeft = (containerWidth - targetWidth) / 2;
      targetTop = window.innerHeight * 0.3;
    }

    gsap.to(clone, {
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight,
      duration: 0.7,
      ease: "expo.inOut",
      onComplete: () => {
        router.push(`/our-films/${film.slug}`);
      }
    });
  };

  return (
    <section
      ref={containerRef}
      className=" mx-auto px-4 sm:px-6 sm:pt-[20vh] lg:px-8 py-16 min-h-screen bg-white text-black"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Page Title */}
      <h2
        data-reveal="words"
        className="text-6xl sm:text-7xl md:text-[6rem] lg:text-[7rem] font-bold tracking-tighter mb-12"
      >
        Our Films
      </h2>

      {/* Films Grid: the full list in release order, no filters */}
      <div
        ref={gridRef}
        className="film-grid flex flex-wrap -ml-8 gap-y-16"
      >
        {films.map((film) => (
          <div
            key={film.slug}
            data-reveal="rise"
            className="film-card flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] pl-8"
          >
            <div
              className="flex flex-col group cursor-pointer h-full"
              onClick={(e) => handleFilmClick(e, film)}
              onMouseEnter={() => router.prefetch(`/our-films/${film.slug}`)}
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden ">
                {/* next/image on top of the compressed posters: each card gets a copy sized to its width */}
                <Image
                  src={film.image}
                  alt={film.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col  ">
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide">
                  {film.title}
                </h3>

                <div className="relative py-4 mt-auto">
                  {/* Top animated line (draws left to right) */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-black/20">
                    <div className="absolute top-0 left-0 h-full bg-black w-0 transition-all duration-500 ease-out group-hover:w-full"></div>
                  </div>

                  <p className=" tracking-tighter capitalize opacity-75 ">
                    Released in {film.year}
                  </p>
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
    </section>
  );
}