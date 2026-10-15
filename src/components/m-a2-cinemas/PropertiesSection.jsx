"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { MapPin } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";
import { gsap, EASE, DURATION, MOTION_OK } from "@/lib/motion";

export const propertiesCategories = [
  {
    id: "01",
    title: "Operational",
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
    id: "02",
    title: "Management",
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
    id: "03",
    title: "Joint Venture",
    properties: [
      { name: "Sri Sai Ram 70 MM", location: "Khammam, Telangana" },
      { name: "Konrak Theatre", location: "Hyderabad, Telangana" },
      { name: "MJR Mall", location: "Narapally, Hyderabad, Telangana" },
      { name: "VMR Mall", location: "Aganampudi, Visakhapatnam, Andhra Pradesh" },
    ],
  },
  {
    id: "04",
    title: "International",
    properties: [
      { name: "Juffair Mall", location: "Manama, Bahrain" },
      { name: "Noir Cinemas", location: "Various Cities, Saudi Arabia" },
    ],
  },
];

const pad = (n) => String(n).padStart(2, "0");

export default function PropertiesSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const tabRefs = useRef([]);
  const tabChanged = useRef(false);

  // Heading, rule and category counters reveal once as the section enters
  useScrollReveal(sectionRef);

  // Rows rise in one after another: on first view as the list scrolls in, then on every tab change
  useGSAP(
    () => {
      const rows = listRef.current?.querySelectorAll("[data-row]");
      if (!rows?.length) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          rows,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION,
            ease: EASE,
            stagger: 0.04,
            scrollTrigger: tabChanged.current
              ? undefined
              : { trigger: listRef.current, start: "top 85%", once: true },
          }
        );
      });
    },
    { scope: listRef, dependencies: [active] }
  );

  const selectTab = (i) => {
    tabChanged.current = true;
    setActive(i);
  };

  // Arrow keys move between tabs (WAI-ARIA tabs pattern)
  const onTabKeyDown = (e) => {
    const last = propertiesCategories.length - 1;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  const category = propertiesCategories[active];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="a2-properties-heading"
      className="relative w-full bg-white text-black py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
        <div>
          <p data-reveal="rise" className="font-mono text-[11px]! md:text-xs! uppercase tracking-[0.25em] text-[#0474BA] mb-5">
            Exhibition Network
          </p>
          <h2
            id="a2-properties-heading"
            data-reveal="words"
            className="font-['SwitzerB'] text-4xl! md:text-6xl! lg:text-7xl! tracking-tight leading-[1.02]"
          >
            Cinema Properties
          </h2>
        </div>
        <p data-reveal="rise" className="text-[#555] text-sm! md:text-base! max-w-[360px] leading-relaxed">
          Choose a category to see its cinemas.
        </p>
      </div>

      {/* Category tabs: number, count and name, the active one underlined in the accent blue */}
      <div
        role="tablist"
        aria-label="Property categories"
        className="grid grid-cols-2 lg:grid-cols-4 border-t border-[#D4D4D4]"
      >
        {propertiesCategories.map((cat, i) => {
          const selected = i === active;
          return (
            <button
              key={cat.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`a2-tab-${cat.id}`}
              aria-selected={selected}
              aria-controls="a2-properties-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(i)}
              onKeyDown={onTabKeyDown}
              className={`group relative text-left pt-6 pb-7 md:pt-8 md:pb-10 pr-4 cursor-pointer transition-colors duration-300 outline-none focus-visible:bg-[#0474BA]/[0.06] border-b border-[#D4D4D4] ${
                i % 2 === 1 ? "border-l pl-4 md:pl-8" : ""
              } ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            >
              {/* Active indicator */}
              <span
                aria-hidden="true"
                className={`absolute left-0 right-0 -top-px h-[2px] bg-[#0474BA] origin-left transition-transform duration-500 ease-out ${
                  selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-[0.25]"
                }`}
              />
              <span
                className={`block font-mono text-[11px] tracking-[0.2em] mb-4 md:mb-6 transition-colors ${
                  selected ? "text-[#0474BA]" : "text-neutral-400"
                }`}
              >
                {cat.id}
              </span>
              <span
                data-reveal="count"
                data-count-to={cat.properties.length}
                className={`block font-['SwitzerB'] text-5xl md:text-7xl leading-none tracking-tight tabular-nums transition-colors duration-300 ${
                  selected ? "text-black" : "text-neutral-300 group-hover:text-neutral-500"
                }`}
              >
                {cat.properties.length}
              </span>
              <span
                className={`mt-3 md:mt-4 block text-sm md:text-base transition-colors duration-300 ${
                  selected ? "text-black" : "text-neutral-500 group-hover:text-black"
                }`}
              >
                {cat.title} <span className="text-neutral-400">properties</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Directory for the selected category */}
      <div
        id="a2-properties-panel"
        role="tabpanel"
        aria-labelledby={`a2-tab-${category.id}`}
        tabIndex={0}
        className="pt-12 md:pt-16 outline-none"
      >
        <div className="flex items-baseline justify-between gap-4 mb-6 md:mb-8">
          <h3 className="font-['SwitzerB'] text-2xl md:text-4xl tracking-tight">
            {category.title}
          </h3>
          <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-neutral-500 tabular-nums">
            {pad(category.properties.length)} {category.properties.length === 1 ? "property" : "properties"}
          </span>
        </div>

        <ol
          key={category.id}
          ref={listRef}
          className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 lg:gap-x-20 border-t border-[#D4D4D4] md:border-t-0"
        >
          {category.properties.map((item, i) => (
            <li
              key={item.name}
              data-row
              className="group relative flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6 py-5 md:py-6 border-b border-[#D4D4D4] md:first:border-t md:[&:nth-child(2)]:border-t"
            >
              {/* Hover rule draws in along the bottom edge */}
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-px h-px bg-[#0474BA] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400 group-hover:text-[#0474BA] transition-colors w-8 shrink-0 tabular-nums">
                {pad(i + 1)}
              </span>
              <span className="font-['SwitzerB'] text-xl md:text-2xl tracking-tight leading-tight transition-transform duration-500 ease-out group-hover:translate-x-1.5 min-w-0">
                {item.name}
              </span>
              <span className="sm:ml-auto flex items-center gap-1.5 text-[13px] md:text-sm text-neutral-500 sm:text-right">
                <MapPin aria-hidden="true" className="w-3.5 h-3.5 shrink-0 text-neutral-400 group-hover:text-[#0474BA] transition-colors" />
                {item.location}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
