"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { filmBriefs } from "./filmBriefs";

// Categories follow muktaarts.com: E = Entertainment, S = Searchlight, R = Regional, SH = Short
const films = [
  { slug: "kalicharan", title: "Kalicharan", year: 1976, cats: ["E"] },
  { slug: "vishwanath", title: "Vishwanath", year: 1978, cats: ["E"] },
  { slug: "gautam-govinda", title: "Gautam Govinda", year: 1979, cats: ["E"] },
  { slug: "karz", title: "Karz", year: 1980, cats: ["E"] },
  { slug: "krodhi", title: "Krodhi", year: 1981, cats: ["E"] },
  { slug: "vidhaata", title: "Vidhaata", year: 1982, cats: ["E"] },
  { slug: "hero", title: "Hero", year: 1983, cats: ["E"] },
  { slug: "meri-jung", title: "Meri Jung", year: 1985, cats: ["E"] },
  { slug: "karma", title: "Karma", year: 1986, cats: ["E"] },
  { slug: "uttar-dakshin", title: "Uttar Dakshin", year: 1987, cats: ["E"] },
  { slug: "ram-lakhan", title: "Ram Lakhan", year: 1989, cats: ["E"] },
  { slug: "saudagar", title: "Saudagar", year: 1991, cats: ["E"] },
  { slug: "pyar-ki-ganga-bahe", title: "Pyar Ki Ganga Bahe", year: 1993, cats: ["SH"] },
  { slug: "prem-deewane", title: "Prem Deewane", year: 1992, cats: ["E"] },
  { slug: "khalnayak", title: "Khalnayak", year: 1993, cats: ["E"] },
  { slug: "trimurti", title: "Trimurti", year: 1995, cats: ["E"] },
  { slug: "jaan", title: "Jaan", year: 1996, cats: ["E"] },
  { slug: "pardes", title: "Pardes", year: 1997, cats: ["E"] },
  { slug: "shyam-ghanshyam", title: "Shyam Ghanshyam", year: 1998, cats: ["E"] },
  { slug: "taal", title: "Taal", year: 1999, cats: ["E"] },
  { slug: "rahul", title: "Rahul", year: 2001, cats: ["E", "S"] },
  { slug: "yaadein", title: "Yaadein", year: 2001, cats: ["E"] },
  { slug: "badhaai-ho-badhaai", title: "Badhaai Ho Badhaai", year: 2002, cats: ["E"] },
  { slug: "ek-aur-ek-gyarah", title: "Ek Aur Ek Gyarah", year: 2003, cats: ["E"] },
  { slug: "joggers-park", title: "Jogger’s Park", year: 2003, cats: ["E", "S"] },
  { slug: "aitraaz", title: "Aitraaz", year: 2004, cats: ["E"] },
  { slug: "kisna", title: "Kisna", year: 2005, cats: ["E"] },
  { slug: "iqbal", title: "Iqbal", year: 2005, cats: ["E", "S"] },
  { slug: "shaadi-se-pehle", title: "Shaadi Se Pehle", year: 2006, cats: ["E"] },
  { slug: "36-china-town", title: "36 China Town", year: 2006, cats: ["E"] },
  { slug: "apna-sapna-money-money", title: "Apna Sapna Money Money", year: 2006, cats: ["E"] },
  { slug: "good-boy-bad-boy", title: "Good Boy Bad Boy", year: 2007, cats: ["E"] },
  { slug: "bombay-to-bangkok", title: "Bombay to Bangkok", year: 2008, cats: ["S"] },
  { slug: "valu", title: "Valu", year: 2008, cats: ["R"] },
  { slug: "black-and-white", title: "Black and White", year: 2008, cats: ["E", "S"] },
  { slug: "sanai-choughade", title: "Sanai Choughade", year: 2008, cats: ["R"] },
  { slug: "yuvvraaj", title: "Yuvvraaj", year: 2008, cats: ["E"] },
  { slug: "paying-guests", title: "Paying Guests", year: 2009, cats: ["E"] },
  { slug: "right-yaaa-wrong", title: "Right Yaaa Wrong", year: 2010, cats: ["E"] },
  { slug: "hello-darling", title: "Hello Darling", year: 2010, cats: ["E"] },
  { slug: "nouka-dubi", title: "Nouka Dubi / Kashmakash", year: 2011, cats: ["R"] },
  { slug: "love-express", title: "Love Express", year: 2011, cats: ["E"] },
  { slug: "cycle-kick", title: "Cycle Kick", year: 2011, cats: ["E"] },
  { slug: "samhita", title: "Samhita", year: 2013, cats: ["R"] },
  { slug: "nimbehuli", title: "Nimbehuli", year: 2014, cats: ["R"] },
  { slug: "kaanchi", title: "Kaanchi", year: 2014, cats: ["E"] },
  { slug: "double-di-trouble", title: "Double Di Trouble", year: 2014, cats: ["R"] },
  { slug: "36-farmhouse", title: "36 Farmhouse", year: 2022, cats: ["E"] },
  { slug: "vijeta", title: "Vijeta", year: 2020, cats: ["R"] },
  { slug: "jaanki", title: "Jaanki", year: 2023, cats: ["E"] },
  { slug: "gandhi-a-perspective", title: "Gandhi: A Perspective", year: 2020, cats: ["SH"] },
  { slug: "tu-me-ani-amaira", title: "Tu Me Ani Amaira", year: 2025, cats: ["R"] },
].map((film) => ({
  ...film,
  id: film.slug,
  description: `Released in ${film.year}`,
  brief: filmBriefs[film.slug] || "",
  image: `/img/films/${film.slug}.jpg`,
}));

const categories = [
  { category: "ALL", key: null },
  { category: "ENTERTAINMENT FILMS", key: "E" },
  { category: "SEARCHLIGHT FILMS", key: "S" },
  { category: "SHORT FILMS", key: "SH" },
  { category: "REGIONALS FILMS", key: "R" },
];

export const filmsData = categories.map(({ category, key }) => ({
  category,
  items: key ? films.filter((film) => film.cats.includes(key)) : films,
}));

export default function FilmsComponent() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [displayCategory, setDisplayCategory] = useState("ALL");
  const [isAnimating, setIsAnimating] = useState(false);

  const gridRef = useRef(null);
  const containerRef = useRef(null);

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
      containerRef.current.querySelector(".flex.flex-wrap"),
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

  const handleCategoryChange = (category) => {
    if (category === activeCategory || isAnimating) return;

    setIsAnimating(true);
    setActiveCategory(category);

    // Animate out current cards
    const cards = gsap.utils.toArray(".film-card", gridRef.current);

    gsap.to(cards, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      stagger: { amount: Math.min(0.03 * cards.length, 0.4) }, // Cap total stagger so long lists don't stall
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        setDisplayCategory(category); // Swap data after animation finishes
      },
    });
  };

  // Animate in new cards whenever displayCategory changes
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gsap.utils.toArray(".film-card", gridRef.current);

    // Kill any ongoing tweens to prevent conflicts
    gsap.killTweensOf(cards);

    gsap.fromTo(cards,
      { opacity: 0, y: -20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: { amount: Math.min(0.05 * cards.length, 0.8) }, // Cap total stagger so long lists don't stall
        duration: 0.6,
        ease: "power3.out",
        onComplete: () => {
          setIsAnimating(false);
        },
      }
    );
  }, [displayCategory]);

  return (
    <section
      ref={containerRef}
      className=" mx-auto px-4 sm:px-6 pt-[20vh] lg:px-8 py-16 min-h-screen bg-white text-black"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Page Title */}
      <h2
        className="text-6xl sm:text-7xl md:text-[6rem] lg:text-[7rem] font-bold tracking-tighter mb-10"

      >
        Our Films
      </h2>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-12">
        {filmsData.map(({ category }) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            disabled={isAnimating}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${activeCategory === category
              ? "bg-[#1c2c44] text-white border-[#1c2c44]" // Active state
              : "bg-transparent text-gray-600 border-gray-400 hover:bg-gray-100 hover:text-black hover:border-gray-500"
              }`}
          >
            <p>

              {category}
            </p>
          </button>
        ))}
      </div>

      {/* Films Grid */}
      <div
        ref={gridRef}
        className="flex flex-wrap -ml-8 gap-y-16"
      >
        {filmsData.find(cat => cat.category === displayCategory)?.items.map((film) => (
          <div
            key={film.id}
            className="film-card opacity-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] pl-8"
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