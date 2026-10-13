"use client";

import React, { useState } from "react";
import {
  Film,
  Tv,
  UserCheck,
  Music,
  Palette,
  Gamepad2,
  Scissors,
  Briefcase,
  Sparkles,
  Clock,
  ArrowUpRight,
  LayoutGrid,
  List,
  GraduationCap,
} from "lucide-react";

const schoolsData = [
  {
    id: "01",
    name: "School of Filmmaking",
    icon: Film,
    programCount: "3 Programmes",
    programs: [
      { name: "BFA (Filmmaking)", duration: "3 Years" },
      { name: "Diploma (Screenwriting)", duration: "1 Year" },
      { name: "MFA (Filmmaking)", duration: "2 Years" },
    ],
  },
  {
    id: "02",
    name: "School of Media & Communication",
    icon: Tv,
    programCount: "2 Programmes",
    programs: [
      { name: "BBA (Media & Communication)", duration: "3 Years" },
      { name: "MBA (Media & Entertainment)", duration: "2 Years" },
    ],
  },
  {
    id: "03",
    name: "Actors’ Studio",
    icon: UserCheck,
    programCount: "2 Programmes",
    programs: [
      { name: "BFA (Acting)", duration: "3 Years" },
      { name: "MA (Acting)", duration: "2 Years" },
    ],
  },
  {
    id: "04",
    name: "School of Music",
    icon: Music,
    programCount: "1 Programme",
    programs: [
      { name: "BFA (Music Production & Composition)", duration: "3 Years" },
    ],
  },
  {
    id: "05",
    name: "School of Design",
    icon: Palette,
    programCount: "1 Programme",
    programs: [
      { name: "B.Des. (Visual Communication Design)", duration: "4 Years" },
    ],
  },
  {
    id: "06",
    name: "School of Animation & Game Design",
    icon: Gamepad2,
    programCount: "2 Programmes",
    programs: [
      { name: "B.Des. (Animation)", duration: "4 Years" },
      { name: "B.Des. (Game Design)", duration: "4 Years" },
    ],
  },
  {
    id: "07",
    name: "School of Fashion & Costume Design",
    icon: Scissors,
    programCount: "1 Programme",
    programs: [
      { name: "B.Des. (Fashion Design)", duration: "4 Years" },
    ],
  },
  {
    id: "08",
    name: "WWI – IIM Mumbai",
    icon: Briefcase,
    programCount: "1 Programme",
    programs: [
      { name: "MBA in Creative Industries", duration: "2 Years" },
    ],
  },
  {
    id: "09",
    name: "Short Course Unit",
    icon: Sparkles,
    programCount: "Specialised Disciplines",
    isSpecialUnit: true,
    programs: [
      {
        description:
          "Short-term programmes across specialised areas including filmmaking, production design and other creative disciplines.",
      },
    ],
  },
];

export default function WWSchools() {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

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

      <div className="max-w-[92%]  mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6 pb-8 border-b border-neutral-200/90">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {/* <span className="w-2 h-2 rounded-full bg-black" /> */}
              {/* <span className="text-xs uppercase font-semibold tracking-[0.2em] text-neutral-500">
                Academic Disciplines
              </span> */}
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.12]">
              Academic Schools
              <br />
              <span className="text-neutral-500 font-normal">&amp; Programmes</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-neutral-800 border border-neutral-200/90 shadow-xs tabular-nums">
              9 Specialized Schools
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-neutral-200/90 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${viewMode === "grid"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${viewMode === "list"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* GRID VIEW (3x3 symmetrical layout)                       */}
        {/* ======================================================== */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {schoolsData.map((school) => {
              const Icon = school.icon;

              return (
                <div
                  key={school.id}
                  className={`group relative bg-white rounded-2xl p-7 lg:p-8 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)] hover:border-black/40 transition-all duration-300 flex flex-col justify-between overflow-hidden ${school.isSpecialUnit ? "md:col-span-2 lg:col-span-1" : ""
                    }`}
                >
                  {/* Subtle hover accent line at top */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top content */}
                  <div>
                    {/* Index Number & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold tracking-widest text-neutral-400 group-hover:text-black transition-colors">
                          {school.id}
                        </span>
                        <span className="w-4 h-px bg-neutral-200" />
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-xs">
                        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    {/* School Name */}
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-black mb-5 leading-snug min-h-[56px] flex items-center">
                      {school.name}
                    </h3>

                    {/* Divider */}
                    <div className="h-px w-full bg-neutral-100 mb-5" />

                    {/* Programs List */}
                    <div className="space-y-2.5">
                      {school.programs.map((item, idx) => {
                        if (item.description) {
                          return (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-neutral-50/90 border border-neutral-150/70 flex items-start gap-3 hover:bg-neutral-100/80 transition-colors"
                            >
                              <span className="text-neutral-800 font-bold text-sm leading-none mt-1">
                                ●
                              </span>
                              <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                                {item.description}
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-50/90 border border-neutral-150/70 hover:bg-neutral-100 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-neutral-800 font-bold text-sm leading-none shrink-0">
                                ●
                              </span>
                              <span className="font-semibold text-sm text-neutral-900 leading-snug">
                                {item.name}
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-neutral-800 border border-neutral-200/90 shadow-xs shrink-0 whitespace-nowrap">
                              <Clock className="w-3 h-3 text-neutral-500" />
                              {item.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Bottom / Footer */}
                  <div className="mt-7 pt-5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-neutral-600" />
                      {school.programCount}
                    </span>

                    <span className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-black group-hover:text-white transition-all duration-300">
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
            {schoolsData.map((school) => {
              const Icon = school.icon;

              return (
                <div
                  key={school.id}
                  className="p-6 md:p-8 hover:bg-neutral-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                >
                  {/* Left: Number, Icon, School Name */}
                  <div className="flex items-center gap-4 lg:w-1/3">
                    <span className="font-mono text-xs font-semibold tracking-widest text-neutral-400 group-hover:text-black transition-colors w-7 shrink-0">
                      {school.id}
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 group-hover:text-black">
                      {school.name}
                    </h3>
                  </div>

                  {/* Right: Programs List */}
                  <div className="lg:w-2/3 flex flex-wrap items-center gap-2.5">
                    {school.programs.map((item, idx) => {
                      if (item.description) {
                        return (
                          <div
                            key={idx}
                            className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-150/70 flex items-start gap-2.5 text-sm text-neutral-700"
                          >
                            <span className="text-neutral-800 font-bold text-sm leading-none mt-1">
                              ●
                            </span>
                            <p className="leading-relaxed">{item.description}</p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:bg-white hover:border-neutral-300 transition-all shadow-xs"
                        >
                          <span className="text-neutral-800 font-bold text-xs leading-none">
                            ●
                          </span>
                          <span className="font-semibold text-xs md:text-sm text-neutral-900">
                            {item.name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-neutral-700 border border-neutral-200 shadow-2xs">
                            <Clock className="w-2.5 h-2.5 text-neutral-500" />
                            {item.duration}
                          </span>
                        </div>
                      );
                    })}
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
