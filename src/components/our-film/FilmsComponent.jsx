"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import useScrollReveal from "@/hooks/useScrollReveal";
import { filmBriefs } from "./filmBriefs";

// The full catalogue, shown in release order (the client will confirm the years)
const films = [
  { slug: "kalicharan", title: "Kalicharan", year: 1976 },
  { slug: "vishwanath", title: "Vishwanath", year: 1978 },
  { slug: "gautam-govinda", title: "Gautam Govinda", year: 1979 },
  { slug: "karz", title: "Karz", year: 1980 },
  { slug: "krodhi", title: "Krodhi", year: 1981 },
  { slug: "vidhaata", title: "Vidhaata", year: 1982 },
  { slug: "hero", title: "Hero", year: 1983 },
  { slug: "meri-jung", title: "Meri Jung", year: 1985 },
  { slug: "karma", title: "Karma", year: 1986 },
  { slug: "uttar-dakshin", title: "Uttar Dakshin", year: 1987 },
  { slug: "ram-lakhan", title: "Ram Lakhan", year: 1989 },
  { slug: "saudagar", title: "Saudagar", year: 1991 },
  { slug: "pyar-ki-ganga-bahe", title: "Pyar Ki Ganga Bahe", year: 1993 },
  { slug: "prem-deewane", title: "Prem Deewane", year: 1992 },
  { slug: "khalnayak", title: "Khalnayak", year: 1993 },
  { slug: "trimurti", title: "Trimurti", year: 1995 },
  { slug: "jaan", title: "Jaan", year: 1996 },
  { slug: "pardes", title: "Pardes", year: 1997 },
  { slug: "shyam-ghanshyam", title: "Shyam Ghanshyam", year: 1998 },
  { slug: "taal", title: "Taal", year: 1999 },
  { slug: "rahul", title: "Rahul", year: 2001 },
  { slug: "yaadein", title: "Yaadein", year: 2001 },
  { slug: "badhaai-ho-badhaai", title: "Badhaai Ho Badhaai", year: 2002 },
  { slug: "ek-aur-ek-gyarah", title: "Ek Aur Ek Gyarah", year: 2003 },
  { slug: "joggers-park", title: "Joggerâ€™s Park", year: 2003 },
  { slug: "aitraaz", title: "Aitraaz", year: 2004 },
  { slug: "kisna", title: "Kisna", year: 2005 },
  { slug: "iqbal", title: "Iqbal", year: 2005 },
  { slug: "shaadi-se-pehle", title: "Shaadi Se Pehle", year: 2006 },
  { slug: "36-china-town", title: "36 China Town", year: 2006 },
  { slug: "apna-sapna-money-money", title: "Apna Sapna Money Money", year: 2006 },
  { slug: "good-boy-bad-boy", title: "Good Boy Bad Boy", year: 2007 },
  { slug: "bombay-to-bangkok", title: "Bombay to Bangkok", year: 2008 },
  { slug: "valu", title: "Valu", year: 2008 },
  { slug: "black-and-white", title: "Black and White", year: 2008 },
  { slug: "sanai-choughade", title: "Sanai Choughade", year: 2008 },
  { slug: "yuvvraaj", title: "Yuvvraaj", year: 2008 },
  { slug: "paying-guests", title: "Paying Guests", year: 2009 },
  { slug: "right-yaaa-wrong", title: "Right Yaaa Wrong", year: 2010 },
  { slug: "hello-darling", title: "Hello Darling", year: 2010 },
  { slug: "nouka-dubi", title: "Nouka Dubi / Kashmakash", year: 2011 },
  { slug: "love-express", title: "Love Express", year: 2011 },
  { slug: "cycle-kick", title: "Cycle Kick", year: 2011 },
  { slug: "samhita", title: "Samhita", year: 2013 },
  { slug: "nimbehuli", title: "Nimbehuli", year: 2014 },
  { slug: "kaanchi", title: "Kaanchi", year: 2014 },
  { slug: "double-di-trouble", title: "Double Di Trouble", year: 2014 },
  { slug: "36-farmhouse", title: "36 Farmhouse", year: 2022 },
  { slug: "vijeta", title: "Vijeta", year: 2020 },
  { slug: "jaanki", title: "Jaanki", year: 2023 },
  { slug: "gandhi-a-perspective", title: "Gandhi: A Perspective", year: 2020 },
  { slug: "tu-me-ani-amaira", title: "Tu Me Ani Amaira", year: 2025 },
].map((film) => ({
  ...film,
  id: film.slug,
  description: `Released in ${film.year}`,
  brief: filmBriefs[film.slug] || "",
  image: `/img/films/${film.slug}.jpg`,
}))
  // Release order; the sort is stable, so films from the same year keep the order above
  .sort((a, b) => a.year - b.year);

export default function FilmsComponent() {
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

    localStorage.setItem("selectedFilmImage", film.image);
    localStorage.setItem("selectedFilmTitle", film.title);
    localStorage.setItem("selectedFilmDesc", film.brief);
    localStorage.setItem("selectedFilmYear", film.year);

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
        router.push("/work-in-progress");
      }
    });
  };

  return (
    <section
      ref={containerRef}
      className=" mx-auto px-4 sm:px-6 pt-[20vh] lg:px-8 py-16 min-h-screen bg-white text-black"
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
            key={film.id}
            data-reveal="rise"
            className="film-card flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] pl-8"
          >
            <div
              className="flex flex-col group cursor-pointer h-full"
              onClick={(e) => handleFilmClick(e, film)}
              onMouseEnter={() => router.prefetch("/work-in-progress")}
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden ">
                <img
                  src={film.image}
                  alt={film.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
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
    </section>
  );
}