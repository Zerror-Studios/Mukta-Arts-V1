"use client";

import React, { useState } from "react";
import {
  Film,
  Building2,
  Handshake,
  Globe,
  MapPin,
  LayoutGrid,
  List,
  ArrowUpRight,
} from "lucide-react";

export const propertiesCategories = [
  {
    id: "01",
    title: "Operational Properties",
    count: 16,
    badge: "16 Properties",
    icon: Film,
    properties: [
      { id: 1, name: "Jaihind", location: "Mumbai, Maharashtra" },
      { id: 2, name: "Nakshatra Mall", location: "Banswara, Rajasthan" },
      { id: 3, name: "Vizag Central Mall", location: "Vizag, Andhra Pradesh" },
      { id: 4, name: "SFC Mall", location: "Sangli, Maharashtra" },
      { id: 5, name: "Peoples Mall", location: "Bhopal, Madhya Pradesh" },
      { id: 6, name: "Topiwala Centre", location: "Mumbai, Maharashtra" },
      { id: 7, name: "Orion", location: "Mumbai, Maharashtra" },
      { id: 8, name: "Babyloon", location: "Bhilai, Chhattisgarh" },
      { id: 9, name: "Rajyash Rise", location: "Ahmedabad, Gujarat" },
      { id: 10, name: "TRP Bopal", location: "Ahmedabad, Gujarat" },
      { id: 11, name: "Rani Padmani Mall", location: "Chittorgarh, Rajasthan" },
      { id: 12, name: "Vinuss One", location: "Samastipur, Bihar" },
      { id: 13, name: "Parv Plaza", location: "Behror, Rajasthan" },
      { id: 14, name: "Triveni Grande", location: "Kalyan, Maharashtra" },
      { id: 15, name: "Emperor Mall", location: "Baroda, Gujarat" },
      { id: 16, name: "Citi Centre", location: "Bettiah, Bihar" },
    ],
  },
  {
    id: "02",
    title: "Management Properties",
    count: 11,
    badge: "11 Properties",
    icon: Building2,
    properties: [
      { id: 1, name: "Srinivasa", location: "Karimnagar, Telangana" },
      { id: 2, name: "Giriraj Cinema", location: "Navsari, Gujarat" },
      { id: 3, name: "RSS Square", location: "Kadapa, Andhra Pradesh" },
      { id: 4, name: "Aamrakunj", location: "Chandkheda, Ahmedabad, Gujarat" },
      { id: 5, name: "Ratnanjali", location: "Ahmedabad, Gujarat" },
      { id: 6, name: "Orbit Plaza", location: "Surat, Gujarat" },
      { id: 7, name: "SN Mall", location: "Karimnagar, Telangana" },
      { id: 8, name: "Bharatmata", location: "Mumbai, Maharashtra" },
      { id: 9, name: "Star Mall", location: "Gurgaon, Haryana" },
      { id: 10, name: "Signature Mall", location: "Mehsana, Gujarat" },
      { id: 11, name: "New Excelsior", location: "Mumbai, Maharashtra" },
    ],
  },
  {
    id: "03",
    title: "JV Properties",
    count: 4,
    badge: "4 Properties",
    icon: Handshake,
    properties: [
      { id: 1, name: "Sri Sai Ram 70 MM", location: "Khammam, Telangana" },
      { id: 2, name: "Konrak Theatre", location: "Hyderabad, Telangana" },
      { id: 3, name: "MJR Mall", location: "Narapally, Hyderabad, Telangana" },
      { id: 4, name: "VMR Mall", location: "Aganampudi, Visakhapatnam, Andhra Pradesh" },
    ],
  },
  {
    id: "04",
    title: "International Properties",
    count: 2,
    badge: "2 Properties",
    icon: Globe,
    properties: [
      { id: 1, name: "Juffair Mall", location: "Manama, Bahrain" },
      { id: 2, name: "Noir Cinemas", location: "Various Cities, Saudi Arabia" },
    ],
  },
];

export default function PropertiesSection() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const filteredCategories =
    activeCategory === "ALL"
      ? propertiesCategories
      : propertiesCategories.filter((cat) => cat.title === activeCategory);

  return (
    <section className="relative w-full bg-[#f8f9fa] text-neutral-900 py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Subtle architectural dot grid ambient texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.45]"
        style={{
          backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-[92%] mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6 pb-8 border-b border-neutral-200/90">
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.12]">
              Cinema Properties
              <br />
              <span className="text-neutral-500 font-normal">
                &amp; Exhibition Network
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-neutral-800 border border-neutral-200/90 shadow-xs tabular-nums">
              33 Properties
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-neutral-200/90 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#0474BA] text-white shadow-xs"
                    : "text-neutral-500 hover:text-[#0474BA] hover:bg-neutral-100"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#0474BA] text-white shadow-xs"
                    : "text-neutral-500 hover:text-[#0474BA] hover:bg-neutral-100"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-10">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
              activeCategory === "ALL"
                ? "bg-[#0474BA] text-white border-[#0474BA] shadow-xs"
                : "bg-white text-neutral-700 border-neutral-200/90 hover:border-[#0474BA] hover:text-[#0474BA]"
            }`}
          >
            All Categories
            <span
              className={`ml-2 text-xs font-mono font-bold ${
                activeCategory === "ALL" ? "text-white/80" : "text-neutral-500"
              }`}
            >
              33
            </span>
          </button>

          {propertiesCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.title)}
              className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                activeCategory === cat.title
                  ? "bg-[#0474BA] text-white border-[#0474BA] shadow-xs"
                  : "bg-white text-neutral-700 border-neutral-200/90 hover:border-[#0474BA] hover:text-[#0474BA]"
              }`}
            >
              {cat.title}
              <span
                className={`ml-2 text-xs font-mono font-bold ${
                  activeCategory === cat.title
                    ? "text-white/80"
                    : "text-neutral-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* GRID VIEW                                                */}
        {/* ======================================================== */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {filteredCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.id}
                  className="group relative bg-white rounded-2xl p-7 lg:p-8 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(4,116,186,0.12)] hover:border-[#0474BA] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle hover accent line at top in signature #0474BA blue */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#0474BA] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top content */}
                  <div>
                    {/* Index Number & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold tracking-widest text-neutral-400 group-hover:text-[#0474BA] transition-colors">
                          {category.id}
                        </span>
                        <span className="w-4 h-px bg-neutral-200 group-hover:bg-[#0474BA]/40 transition-colors" />
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-[#0474BA] group-hover:text-white transition-all duration-300 shadow-xs">
                        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    {/* Category Title & Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-[#0474BA] leading-snug transition-colors">
                        {category.title}
                      </h3>
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200/90 shadow-2xs group-hover:border-[#0474BA]/30 group-hover:text-[#0474BA] transition-colors">
                        {category.badge}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-neutral-100 mb-5" />

                    {/* Properties List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {category.properties.map((item) => (
                        <div
                          key={item.id}
                          className="group/item flex items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50/90 border border-neutral-150/70 hover:border-[#0474BA] hover:bg-[#0474BA]/[0.05] hover:shadow-xs transition-all duration-200"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[11px] font-semibold text-neutral-400 group-hover/item:text-[#0474BA] transition-colors shrink-0">
                              {item.id.toString().padStart(2, "0")}.
                            </span>
                            <span className="font-semibold text-xs md:text-sm text-neutral-900 group-hover/item:text-[#0474BA] transition-colors truncate">
                              {item.name}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white text-neutral-600 border border-neutral-200/90 shadow-2xs group-hover/item:border-[#0474BA]/30 shrink-0 whitespace-nowrap transition-colors">
                            <MapPin className="w-2.5 h-2.5 text-neutral-400 group-hover/item:text-[#0474BA] shrink-0 transition-colors" />
                            {item.location}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom / Footer */}
                  <div className="mt-7 pt-5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500">
                      {category.properties.length} Active Properties
                    </span>

                    <span className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-[#0474BA] group-hover:text-white transition-all duration-300">
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* LIST / DIRECTORY VIEW                                    */}
        {/* ======================================================== */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm divide-y divide-neutral-100 overflow-hidden">
            {filteredCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.id}
                  className="p-6 md:p-8 hover:bg-[#0474BA]/[0.02] transition-colors group"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold tracking-widest text-neutral-400 group-hover:text-[#0474BA] transition-colors w-7 shrink-0">
                        {category.id}
                      </span>

                      <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-[#0474BA] group-hover:text-white transition-all duration-300 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 group-hover:text-[#0474BA] transition-colors">
                        {category.title}
                      </h3>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 shadow-2xs group-hover:border-[#0474BA]/30 group-hover:text-[#0474BA] transition-colors">
                      {category.badge}
                    </span>
                  </div>

                  {/* Properties List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {category.properties.map((item) => (
                      <div
                        key={item.id}
                        className="group/item flex items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50/90 border border-neutral-150/70 hover:border-[#0474BA] hover:bg-[#0474BA]/[0.05] hover:shadow-xs transition-all duration-200"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[11px] font-semibold text-neutral-400 group-hover/item:text-[#0474BA] transition-colors shrink-0">
                            {item.id.toString().padStart(2, "0")}.
                          </span>
                          <span className="font-semibold text-xs md:text-sm text-neutral-900 group-hover/item:text-[#0474BA] transition-colors truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white text-neutral-700 border border-neutral-200 shadow-2xs group-hover/item:border-[#0474BA]/30 shrink-0 whitespace-nowrap transition-colors">
                          <MapPin className="w-2.5 h-2.5 text-neutral-400 group-hover/item:text-[#0474BA] shrink-0 transition-colors" />
                          {item.location}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
