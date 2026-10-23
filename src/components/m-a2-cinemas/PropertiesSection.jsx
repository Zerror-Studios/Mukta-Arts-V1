"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";
import { gsap, EASE, MOTION_REDUCED } from "@/lib/motion";

// `about` explains each category in one line, so visitors know what it means
export const propertiesCategories = [
  {
    id: "operational",
    title: "Operational",
    about: "Cinemas run by Mukta A2 Cinemas.",
    properties: [
      { name: "Jaihind", location: "Mumbai, Maharashtra" },
      { name: "Nakshatra Mall", location: "Banswara, Rajasthan" },
      { name: "Vizag Central Mall", location: "Vizag, Andhra Pradesh" },
      { name: "SFC Mall", location: "Sangli, Maharashtra" },
      { name: "Peoples Mall", location: "Bhopal, Madhya Pradesh" },
      { name: "Topiwala Centre", location: "Mumbai, Maharashtra" },
      { name: "Orion", location: "Mumbai, Maharashtra" },
      { name: "Babyloon", location: "Bhilai, Chhattisgarh" },
      { name: "Rajyash Rise", location: "Ahmedabad, Gujarat" },
      { name: "TRP Bopal", location: "Ahmedabad, Gujarat" },
      { name: "Rani Padmani Mall", location: "Chittorgarh, Rajasthan" },
      { name: "Vinuss One", location: "Samastipur, Bihar" },
      { name: "Parv Plaza", location: "Behror, Rajasthan" },
      { name: "Triveni Grande", location: "Kalyan, Maharashtra" },
      { name: "Emperor Mall", location: "Baroda, Gujarat" },
      { name: "Citi Centre", location: "Bettiah, Bihar" },
    ],
  },
  {
    id: "management",
    title: "Management",
    about: "Cinemas owned by partners and managed by Mukta A2 Cinemas.",
    properties: [
      { name: "Srinivasa", location: "Karimnagar, Telangana" },
      { name: "Giriraj Cinema", location: "Navsari, Gujarat" },
      { name: "RSS Square", location: "Kadapa, Andhra Pradesh" },
      { name: "Aamrakunj", location: "Chandkheda, Ahmedabad, Gujarat" },
      { name: "Ratnanjali", location: "Ahmedabad, Gujarat" },
      { name: "Orbit Plaza", location: "Surat, Gujarat" },
      { name: "SN Mall", location: "Karimnagar, Telangana" },
      { name: "Bharatmata", location: "Mumbai, Maharashtra" },
      { name: "Star Mall", location: "Gurgaon, Haryana" },
      { name: "Signature Mall", location: "Mehsana, Gujarat" },
      { name: "New Excelsior", location: "Mumbai, Maharashtra" },
    ],
  },
  {
    id: "joint-venture",
    title: "Joint Venture",
    about: "Cinemas run together with a joint-venture partner.",
    properties: [
      { name: "Sri Sai Ram 70 MM", location: "Khammam, Telangana" },
      { name: "Konark Theatre", location: "Hyderabad, Telangana" },
      { name: "MJR Mall", location: "Narapally, Hyderabad, Telangana" },
      { name: "VMR Mall", location: "Aganampudi, Visakhapatnam, Andhra Pradesh" },
    ],
  },
  {
    id: "international",
    title: "International",
    about: "Mukta A2 Cinemas outside India.",
    properties: [
      { name: "Juffair Mall", location: "Manama, Bahrain" },
      { name: "Noir Cinemas", location: "Various Cities, Saudi Arabia" },
    ],
  },
];

const pad = (n) => String(n).padStart(2, "0");
const total = propertiesCategories.reduce((n, c) => n + c.properties.length, 0);

/* ---------- one category: a row that drops down to show its cinemas ---------- */

const Category = ({ category, index, isOpen, onToggle }) => {
  const panelRef = useRef(null);
  const mounted = useRef(false);

  // Opens and closes with the same height tween as the other dropdowns on the site
  useEffect(() => {
    const panel = panelRef.current;
    const items = panel.querySelectorAll("[data-cinema]");
    if (!mounted.current) {
      mounted.current = true;
      gsap.set(panel, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
      return;
    }
    const instant = window.matchMedia(MOTION_REDUCED).matches;
    gsap.to(panel, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: instant ? 0 : 0.6,
      ease: isOpen ? "power3.out" : "power2.inOut",
      overwrite: "auto",
    });
    if (isOpen && !instant) {
      gsap.fromTo(items, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.025, delay: 0.1 });
    }
  }, [isOpen]);

  const panelId = `a2-category-${category.id}`;

  return (
    <div className="border-b border-black/15">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group w-full grid grid-cols-[2rem_minmax(0,1fr)_auto] md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-x-4 md:gap-x-8 py-7 md:py-10 text-left cursor-pointer outline-none focus-visible:bg-[#1B123D]/[0.04]"
      >
        <h4
          className={`font-mono text-[11px] md:text-xs  tabular-nums transition-colors ${
            isOpen ? "text-[#1B123D]" : "text-neutral-400"
          }`}
        >
          {pad(index + 1)}
        </h4>

        <span className="block min-w-0">
          <h4
            className={`block font-['SwitzerB'] text-[30px] md:text-[48px] lg:text-[60px] leading-none tracking-tight transition-colors duration-300 ${
              isOpen ? "text-black" : "text-neutral-400 group-hover:text-black"
            }`}
          >
            {category.title}
          </h4>
          {/* The meaning sits under the name on phones */}
          <p className="md:hidden block mt-2 text-[14px] leading-snug text-[#555]">{category.about}</p>
        </span>

        <p className="hidden md:block text-[15px] lg:text-[16px] leading-relaxed text-[#555] max-w-[34ch]">
          {category.about}
        </p>

        <span className="flex items-center gap-4 md:gap-6">
          <span className="block text-right">
            <p className="block text-[26px] md:text-[36px] font-light leading-none tabular-nums text-black">
              {pad(category.properties.length)}
            </p>
            <p className="hidden md:block mt-1 font-mono text-[10px] uppercase  text-neutral-500">
              Cinemas
            </p>
          </span>
          <p
            className={`grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full border transition-colors duration-300 ${
              isOpen
                ? "bg-[#1B123D] border-[#1B123D] text-white"
                : "border-black/20 text-black group-hover:border-[#1B123D] group-hover:bg-[#1B123D] group-hover:text-white"
            }`}
          >
            <Plus
              strokeWidth={1.5}
              className={`w-5 h-5 transition-transform duration-500 ease-out ${isOpen ? "rotate-45" : ""}`}
            />
          </p>
        </span>
      </button>

      {/* The cinemas, in a lined grid lined up with the category name */}
      <div ref={panelRef} id={panelId} role="region" aria-label={`${category.title} cinemas`} className="overflow-hidden">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 pb-10 md:pb-14 pl-[calc(2rem+1rem)] md:pl-[calc(4rem+2rem)]">
          {category.properties.map((item) => {
            const parts = item.location.split(",").map((s) => s.trim());
            return (
              <li
                key={item.name}
                data-cinema
                className="group/item py-4 md:py-5 border-t border-[#D4D4D4] hover:border-[#1B123D] transition-colors duration-300"
              >
                {/* Hover only changes colour: the rule above and the name turn navy */}
                <p className="block text-[18px] md:text-[20px] font-medium tracking-tight leading-tight text-black group-hover/item:text-[#1B123D] transition-colors duration-300">
                  {item.name}
                </p>
                <p className="block mt-1.5 text-[13px] md:text-[14px] leading-snug text-[#666]">
                  {parts.slice(0, -1).join(", ")}
                  {parts.length > 1 && <span className="text-neutral-400"> · </span>}
                  {parts.at(-1)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/* ---------- the section ---------- */

export default function PropertiesSection() {
  const sectionRef = useRef(null);
  // One category open at a time; all start closed
  const [openId, setOpenId] = useState(null);

  // Heading, intro and the category rows reveal once as the section enters
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="a2-properties-heading"
      className="relative w-full bg-white text-black py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
        <div>
         
          <h2
            id="a2-properties-heading"
            data-reveal="words"
            className="font-['SwitzerB'] text-4xl! md:text-6xl! lg:text-7xl! tracking-tight leading-[1.02]"
          >
            Cinema Properties
          </h2>
        </div>
        <p data-reveal="rise" className="text-[#555]  max-w-[380px] ">
          {total} cinemas in {propertiesCategories.length} categories. Open a category to see its cinemas and
          where they are.
        </p>
      </div>

      {/* Categories */}
      <div data-reveal="rise" className="border-t border-black/15">
        {propertiesCategories.map((category, index) => (
          <Category
            key={category.id}
            category={category}
            index={index}
            isOpen={openId === category.id}
            onToggle={() => setOpenId(openId === category.id ? null : category.id)}
          />
        ))}
      </div>
    </section>
  );
}
