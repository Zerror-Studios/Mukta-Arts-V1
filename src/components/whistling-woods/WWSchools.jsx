"use client";

import React, { useState, useId } from "react";
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
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  ChevronDown,
  ExternalLink,
  BookOpen,
} from "lucide-react";

const schoolsData = [
  {
    id: "01",
    name: "School of Filmmaking",
    shortName: "Filmmaking",
    category: "film",
    categoryLabel: "Cinema & Directing",
    tagline: "Comprehensive screen craft from script to final cut",
    description:
      "World-class cinematic training in direction, cinematography, screenwriting, editing, and sound with hands-on access to 35mm, digital 8K cameras, soundstages, and post-production suites.",
    icon: Film,
    levelTag: "UG · PG · Diploma",
    totalPrograms: "3 Programs",
    programs: [
      {
        name: "BFA (Filmmaking)",
        duration: "3 Years",
        degreeType: "Undergraduate Degree",
        specializations: "Direction, Cinematography, Editing & Sound",
      },
      {
        name: "Diploma (Screenwriting)",
        duration: "1 Year",
        degreeType: "Specialized Diploma",
        specializations: "Dramatic Narrative, Character & Screen Structure",
      },
      {
        name: "MFA (Filmmaking)",
        duration: "2 Years",
        degreeType: "Postgraduate Degree",
        specializations: "Advanced Auteurship, Cinematic Research & Studio Craft",
      },
    ],
    highlights: [
      "Shooting on industry-standard ARRI, RED, and Sony Venice camera systems",
      "Dedicated 250-seat Dolby Atmos mixing theatre and 5.1 editing labs",
      "Regular masterclasses with India's celebrated filmmakers and screenwriters",
    ],
  },
  {
    id: "02",
    name: "School of Media & Communication",
    shortName: "Media & Comm",
    category: "media",
    categoryLabel: "Media & Business",
    tagline: "Strategic leadership in modern entertainment ecosystems",
    description:
      "Prepares visionary media managers and creative entrepreneurs to lead across entertainment marketing, digital broadcasting, film distribution, talent representation, and public relations.",
    icon: Tv,
    levelTag: "UG · PG",
    totalPrograms: "2 Programs",
    programs: [
      {
        name: "BBA (Media & Communication)",
        duration: "3 Years",
        degreeType: "Undergraduate Degree",
        specializations: "Digital Media, Advertising, PR & Events",
      },
      {
        name: "MBA (Media & Entertainment)",
        duration: "2 Years",
        degreeType: "Postgraduate Degree",
        specializations: "IP Strategy, Content Monetization & Studio Management",
      },
    ],
    highlights: [
      "Industry immersion with major production houses, OTT platforms, and agencies",
      "Comprehensive curriculum spanning broadcast economics and digital monetization",
      "Live event management and festival curation experience on campus",
    ],
  },
  {
    id: "03",
    name: "Actors’ Studio",
    shortName: "Actors' Studio",
    category: "film",
    categoryLabel: "Performing Arts",
    tagline: "Method acting, psychological realism & screen presence",
    description:
      "An intensive conservatory training actors in Stanislavski and Meisner techniques, camera auditioning, voice culture, physical theatre, and stunt choreography.",
    icon: UserCheck,
    levelTag: "UG · PG",
    totalPrograms: "2 Programs",
    programs: [
      {
        name: "BFA (Acting)",
        duration: "3 Years",
        degreeType: "Undergraduate Degree",
        specializations: "Screen Acting, Voice, Dialect & Movement",
      },
      {
        name: "MA (Acting)",
        duration: "2 Years",
        degreeType: "Postgraduate Degree",
        specializations: "Advanced Psychological Realism & Directorial Collaboration",
      },
    ],
    highlights: [
      "On-camera scene work integrated with School of Filmmaking student projects",
      "Voice modulation, diction, and Kalaripayattu movement training",
      "Annual graduation showcase attended by leading casting directors and agents",
    ],
  },
  {
    id: "04",
    name: "School of Music",
    shortName: "Music",
    category: "film",
    categoryLabel: "Sound & Composition",
    tagline: "Music production, cinematic scoring & sonic arts",
    description:
      "Fosters modern composer-producers who master the intricacies of film scoring, contemporary songwriting, multi-track recording, synthesizers, and Dolby Atmos audio engineering.",
    icon: Music,
    levelTag: "UG",
    totalPrograms: "1 Program",
    programs: [
      {
        name: "BFA (Music Production & Composition)",
        duration: "3 Years",
        degreeType: "Undergraduate Degree",
        specializations: "Film Scoring, Electronic Music & Sound Engineering",
      },
    ],
    highlights: [
      "State-of-the-art recording studios with analog consoles and Avid Pro Tools HD",
      "Direct collaboration scoring student short films, animations, and games",
      "Masterclasses with top Bollywood composers, lyricists, and mixing engineers",
    ],
  },
  {
    id: "05",
    name: "School of Design",
    shortName: "Design",
    category: "design",
    categoryLabel: "Visual Communication",
    tagline: "Visual communication, brand strategy & interaction design",
    description:
      "Nurtures critical design thinkers who craft impactful visual identities, publication designs, typography systems, and immersive digital UI/UX experiences.",
    icon: Palette,
    levelTag: "UG (4 Years)",
    totalPrograms: "1 Program",
    programs: [
      {
        name: "B.Des. (Visual Communication Design)",
        duration: "4 Years",
        degreeType: "Undergraduate Degree",
        specializations: "Typography, UI/UX, Brand Systems & Visual Narrative",
      },
    ],
    highlights: [
      "Studio-driven pedagogy focusing on conceptual research and human-centered design",
      "Advanced prototyping labs, digital print workshops, and motion design suites",
      "Industry live briefs addressing real-world brand and social communication challenges",
    ],
  },
  {
    id: "06",
    name: "School of Animation & Game Design",
    shortName: "Animation & Games",
    category: "design",
    categoryLabel: "CGI & Interactive",
    tagline: "3D animation, Unreal Engine gaming & virtual production",
    description:
      "Bridges cinematic 2D/3D animation with real-time interactive game design, featuring virtual production pipelines, motion capture stages, and high-performance render farms.",
    icon: Gamepad2,
    levelTag: "UG (4 Years)",
    totalPrograms: "2 Programs",
    programs: [
      {
        name: "B.Des. (Animation)",
        duration: "4 Years",
        degreeType: "Undergraduate Degree",
        specializations: "Character Animation, 3D Asset Modeling & VFX Storytelling",
      },
      {
        name: "B.Des. (Game Design)",
        duration: "4 Years",
        degreeType: "Undergraduate Degree",
        specializations: "Unreal Engine 5, Level Design, Mechanics & AR/VR",
      },
    ],
    highlights: [
      "Epic Games Academic Partner with accredited Unreal Engine curriculum",
      "State-of-the-art optical motion capture studio and VR development labs",
      "Student teams build complete playable indie games and cinematic animation shorts",
    ],
  },
  {
    id: "07",
    name: "School of Fashion & Costume Design",
    shortName: "Fashion & Costume",
    category: "design",
    categoryLabel: "Apparel & Styling",
    tagline: "Cinematic period costume craft & contemporary runway couture",
    description:
      "Founded in association with 4-time National Award-winning designer Neeta Lulla, fusing cinematic period costume history with contemporary haute couture and garment manufacturing.",
    icon: Scissors,
    levelTag: "UG (4 Years)",
    totalPrograms: "1 Program",
    programs: [
      {
        name: "B.Des. (Fashion Design)",
        duration: "4 Years",
        degreeType: "Undergraduate Degree",
        specializations: "Costume for Cinema, Apparel Construction & Textile Styling",
      },
    ],
    highlights: [
      "Hands-on mentorship by industry icon Neeta Lulla and veteran costume stylists",
      "Live film costume design assignments for campus film shoots and theatre productions",
      "Annual runway showcase featuring graduate collections for fashion editors and buyers",
    ],
  },
  {
    id: "08",
    name: "WWI – IIM Mumbai",
    shortName: "WWI – IIM Mumbai",
    category: "media",
    categoryLabel: "Executive Management",
    tagline: "Elite executive business leadership for the creative economy",
    description:
      "A prestigious collaborative initiative uniting the premier management rigor of IIM Mumbai with Whistling Woods' unmatched entertainment media ecosystem.",
    icon: Briefcase,
    levelTag: "Executive PG",
    totalPrograms: "1 Program",
    programs: [
      {
        name: "MBA in Creative Industries",
        duration: "2 Years",
        degreeType: "Postgraduate Degree",
        specializations: "Creative Economy, Media Finance, Studio Ops & Strategic IP",
      },
    ],
    highlights: [
      "Dual institutional academic pedigree: IIM Mumbai & Whistling Woods International",
      "Tailored for media executives, studio heads, tech disruptors, and creative leaders",
      "Blended executive curriculum with masterclasses from global industry stalwarts",
    ],
  },
  {
    id: "09",
    name: "Short Course Unit",
    shortName: "Short Courses",
    category: "specialized",
    categoryLabel: "Continuing Education",
    tagline: "Accelerated professional bootcamps & modular creative masterclasses",
    description:
      "Short-term programmes across specialised areas including filmmaking, production design and other creative disciplines.",
    icon: Sparkles,
    levelTag: "Modular · Certificate",
    totalPrograms: "Flexible Modules",
    isSpecialUnit: true,
    programs: [
      {
        name: "Short-term Programmes",
        duration: "Flexible / Modular",
        degreeType: "Professional Certificate",
        specializations:
          "Specialised areas including filmmaking, production design and other creative disciplines.",
      },
    ],
    highlights: [
      "Fast-track immersive weekend and evening modules for working professionals",
      "Direct hands-on access to WWI studio infrastructure and equipment",
      "Curricula updated quarterly to reflect evolving media tech and industry needs",
    ],
  },
];

const categoryFilters = [
  { id: "all", label: "All Schools", count: 9 },
  { id: "film", label: "Film & Performance", count: 3 },
  { id: "design", label: "Design & Animation", count: 3 },
  { id: "media", label: "Media & Business", count: 2 },
  { id: "specialized", label: "Short Courses", count: 1 },
];

export default function WWSchools() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedSchoolId, setExpandedSchoolId] = useState(null);
  const [selectedSchoolModal, setSelectedSchoolModal] = useState(null);

  const filteredSchools =
    activeCategory === "all"
      ? schoolsData
      : schoolsData.filter((school) => school.category === activeCategory);

  const toggleExpand = (id) => {
    setExpandedSchoolId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative w-full bg-[#f7f8f9] text-black py-20 md:py-28 overflow-hidden">
      {/* Subtle decorative background gradient accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-neutral-200/40 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-gradient-to-tl from-neutral-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[90%] mx-auto relative z-10">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-14 md:mb-16 gap-6">
          <div className="w-full md:w-3/5">
            {/* <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-8 h-[2px] bg-black" />
              <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-neutral-500 uppercase">
                Schools of Creative Excellence
              </span>
            </div> */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.12]">
              Academic Schools
              <br />
              <span className="text-neutral-500 font-normal">& Disciplines</span>
            </h2>
          </div>

          <div className="w-full md:w-[38%] flex flex-col justify-between pt-2">
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-normal">
              Whistling Woods International is home to nine specialized schools
              offering accredited degrees, postgraduate qualifications, and
              hands-on industry diplomas in media, filmmaking, design, and the
              creative arts.
            </p>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-neutral-300/80 text-xs md:text-sm text-neutral-700 font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-800" />
                9 Specialized Schools
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-800" />
                Degree & Diploma Tracks
              </span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mb-12">
          {categoryFilters.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`relative px-4 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${isActive
                  ? "bg-black text-white shadow-md shadow-black/15 scale-[1.02]"
                  : "bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200/90"
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full tabular-nums font-semibold ${isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-600"
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 9 Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredSchools.map((school) => {
            const Icon = school.icon;
            const isExpanded = expandedSchoolId === school.id;

            return (
              <div
                key={school.id}
                className="group relative bg-white rounded-2xl p-7 lg:p-8 border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] hover:border-black/30 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Header Card */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold tracking-widest text-neutral-400 group-hover:text-black transition-colors">
                        {school.id}
                      </span>
                      <span className="inline-block w-3 h-px bg-neutral-300" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
                        {school.categoryLabel}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* School Name */}
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-black mb-2.5">
                    {school.name}
                  </h3>

                  {/* School Tagline */}
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                    {school.tagline}
                  </p>

                  {/* School Description */}
                  <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3 mb-6">
                    {school.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px w-full bg-neutral-100 mb-5" />

                  {/* Programs List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                      <span>Programs Offered</span>
                      <span>Duration</span>
                    </div>

                    {school.programs.map((program, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 hover:bg-neutral-100/90 transition-colors flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-sm text-neutral-900 leading-snug">
                            {program.name}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-neutral-800 border border-neutral-200/80 shadow-xs shrink-0">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            {program.duration}
                          </span>
                        </div>
                        {program.specializations && (
                          <span className="text-[11px] text-neutral-500 line-clamp-1">
                            {program.specializations}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Collapsible Key Highlights */}
                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-neutral-100 animate-fadeIn">
                      <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2.5">
                        School Highlights
                      </span>
                      <ul className="space-y-2">
                        {school.highlights.map((item, hIdx) => (
                          <li
                            key={hIdx}
                            className="text-xs text-neutral-600 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Bottom / Footer */}
                <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-700" />
                    {school.levelTag}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleExpand(school.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-black cursor-pointer transition-colors"
                  >
                    <span>{isExpanded ? "Less Details" : "Highlights"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Accreditation & Global Affiliations */}
        {/* <div className="mt-16 md:mt-20 p-8 md:p-10 rounded-3xl bg-neutral-900 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Academic Accreditations
              </span>
            </div>
            <h4 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-2">
              Degrees Accredited by Premier University Partners
            </h4>
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              Bachelor&apos;s and Master&apos;s degree programmes at Whistling Woods
              International are offered in collaboration with Tata Institute of
              Social Sciences (TISS) (a Category 1 University) and leading
              global institutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-left">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-medium">
                Affiliation Partner
              </span>
              <span className="text-sm font-semibold text-white">
                TISS (Category 1)
              </span>
            </div>

            <div className="px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-left">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-medium">
                Global Network
              </span>
              <span className="text-sm font-semibold text-white">
                16+ International Alliances
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
