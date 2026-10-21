"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Eye, Download, FileText, FileSpreadsheet, X } from "lucide-react";
import { gsap, MOTION_REDUCED } from "@/lib/motion";
import useScrollReveal from "@/hooks/useScrollReveal";
import { investorCategories, unclaimedDividend } from "@/data/investorRelations";

// Every document lives on this site (public/investor-relations/), so viewing or downloading
// one never sends the visitor to another website.

const formatSize = (bytes) =>
  bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`;

const TYPE_LABEL = { pdf: "PDF", doc: "Word", docx: "Word", xls: "Excel", xlsx: "Excel" };

const countDocs = (category) =>
  category.sections.reduce(
    (n, s) => n + (s.docs ? s.docs.length : s.years.reduce((m, y) => m + y.docs.length, 0)),
    0
  );

// "Annual General Meeting - 2026" reads better as a chip
const yearLabel = (title) => title.replace(/^Annual General Meeting\s*-\s*/i, "AGM ");

const fileName = (href) => decodeURIComponent(href.split("/").pop());

// Browsers that can show a PDF inside the page; phones mostly can't, so there it opens on its own
const canEmbedPdf = () =>
  typeof navigator !== "undefined" &&
  navigator.pdfViewerEnabled !== false &&
  window.matchMedia("(min-width: 768px)").matches;

/* ---------- one document ---------- */

// `compact` keeps the buttons under the title, for the narrow column beside the contact details
const DocRow = ({ doc, onView, compact = false }) => {
  const isPdf = doc.type === "pdf";
  const Icon = doc.type.startsWith("xls") ? FileSpreadsheet : FileText;

  return (
    <li
      className={`group/row flex flex-col gap-3 py-4 border-b border-black/10 last:border-b-0 ${
        compact ? "" : "sm:flex-row sm:items-center sm:gap-6"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span className="mt-0.5 grid place-items-center w-9 h-9 shrink-0 rounded-[3px] bg-[#1B123D]/[0.06] text-[#1B123D]">
          <Icon strokeWidth={1.5} className="w-4.5 h-4.5" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px]! md:text-[16px]! leading-snug! text-black font-medium">{doc.title}</p>
          <p className="mt-1 text-[12px]! leading-none! text-[#777] tracking-wide uppercase">
            {doc.date && <span>{doc.date} · </span>}
            {TYPE_LABEL[doc.type] ?? doc.type} · {formatSize(doc.size)}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-2 pl-12 shrink-0 ${compact ? "" : "sm:pl-0"}`}>
        {isPdf && (
          <button
            type="button"
            onClick={() => onView(doc)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[3px] border border-[#1B123D]/25 text-[#1B123D] text-xs font-semibold tracking-wide hover:border-[#1B123D] hover:bg-[#1B123D]/[0.04] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B123D]"
          >
            <Eye strokeWidth={1.75} className="w-4 h-4" />
            View
          </button>
        )}
        <a
          href={doc.href}
          download={fileName(doc.href)}
          aria-label={`Download ${doc.title}`}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[3px] bg-[#1B123D] hover:bg-[#2A1D5C] text-white text-xs font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B123D]"
        >
          <Download strokeWidth={1.75} className="w-4 h-4" />
          Download
        </a>
      </div>
    </li>
  );
};

/* ---------- a section of documents (optionally split into years) ---------- */

const Section = ({ section, defaultOpen, isFirst, onView }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [yearIndex, setYearIndex] = useState(0);
  const contentRef = useRef(null);
  const mounted = useRef(false);

  const docs = section.docs ?? section.years[yearIndex].docs;
  const total = section.docs ? section.docs.length : section.years.reduce((n, y) => n + y.docs.length, 0);

  useEffect(() => {
    const el = contentRef.current;
    // First render: just take the right state, no animation
    if (!mounted.current) {
      mounted.current = true;
      gsap.set(el, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
      return;
    }
    const instant = window.matchMedia(MOTION_REDUCED).matches;
    gsap.to(el, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: instant ? 0 : 0.5,
      ease: isOpen ? "power3.out" : "power2.inOut",
    });
  }, [isOpen]);

  return (
    <div className={`border-b border-[#c2c2c2] ${isFirst ? "border-t" : ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center gap-6 py-5 md:py-6 text-left focus:outline-none group cursor-pointer"
      >
        <span className="text-lg md:text-2xl font-medium text-black tracking-tight group-hover:text-gray-600 transition-colors">
          {section.title}
        </span>
        <span className="flex items-center gap-4 shrink-0">
          <span className="text-xs md:text-sm text-[#888] tabular-nums">{String(total).padStart(2, "0")}</span>
          <ChevronDown
            strokeWidth={1.5}
            className={`w-5 h-5 text-black transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <div ref={contentRef} className="overflow-hidden">
        <div className="pb-8">
          {section.years && (
            <div role="tablist" aria-label={`${section.title} by year`} className="flex flex-wrap gap-2 mb-3">
              {section.years.map((year, i) => (
                <button
                  key={year.title}
                  type="button"
                  role="tab"
                  aria-selected={i === yearIndex}
                  onClick={() => setYearIndex(i)}
                  className={`h-8 px-3 rounded-full text-xs font-semibold tabular-nums tracking-wide border transition-colors cursor-pointer ${
                    i === yearIndex
                      ? "bg-[#1B123D] border-[#1B123D] text-white"
                      : "border-black/15 text-[#444] hover:border-[#1B123D] hover:text-[#1B123D]"
                  }`}
                >
                  {yearLabel(year.title)}
                </button>
              ))}
            </div>
          )}
          <DocList docs={docs} onView={onView} />
        </div>
      </div>
    </div>
  );
};

// Board Meetings and Postal Ballot have nothing published yet, as on the original page
const DocList = ({ docs, onView, compact }) =>
  docs.length ? (
    <ul className="flex flex-col">
      {docs.map((doc) => (
        <DocRow key={doc.href} doc={doc} onView={onView} compact={compact} />
      ))}
    </ul>
  ) : (
    <p className="py-4 text-[14px]! leading-relaxed! text-[#888]">No documents have been published yet.</p>
  );

/* ---------- Unclaimed Dividend: linked under the contact details, as on the original page ---------- */

const UnclaimedDividend = ({ onView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!mounted.current) {
      mounted.current = true;
      gsap.set(el, { height: 0, opacity: 0 });
      return;
    }
    const instant = window.matchMedia(MOTION_REDUCED).matches;
    gsap.to(el, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: instant ? 0 : 0.5,
      ease: isOpen ? "power3.out" : "power2.inOut",
    });
  }, [isOpen]);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="inline-flex w-fit items-center gap-2 bg-[#1B123D] hover:bg-[#2A1D5C] text-white px-6 py-2.5 text-xs md:text-sm tracking-wider font-semibold rounded-[3px] transition-colors duration-300 cursor-pointer"
      >
        <span>{unclaimedDividend.title}</span>
        <ChevronDown
          strokeWidth={2}
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div ref={contentRef} className="overflow-hidden">
        <div className="pt-[20px]">
          <p className="text-[14px]! font-medium text-black mb-1">Refund to claimants from Fund</p>
          {unclaimedDividend.intro && (
            <p className="text-[#555] text-[14px]! leading-relaxed!">
              {unclaimedDividend.intro}{" "}
              {unclaimedDividend.introLink && (
                <a
                  href={unclaimedDividend.introLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline underline-offset-2 break-all hover:text-[#1B123D]"
                >
                  {unclaimedDividend.introLink.replace(/^https?:\/\//, "")}
                </a>
              )}
            </p>
          )}
          <DocList docs={unclaimedDividend.docs} onView={onView} compact />
        </div>
      </div>
    </div>
  );
};

/* ---------- the in-page PDF viewer ---------- */

const PdfViewer = ({ doc, onClose }) => {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    // The page stays put behind the viewer
    window.lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const opener = document.activeElement;
    closeRef.current?.focus();

    if (!window.matchMedia(MOTION_REDUCED).matches) {
      gsap.fromTo(panelRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
    }

    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      window.lenis?.start();
      opener?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
      data-lenis-prevent
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={panelRef} className="flex flex-col w-full max-w-6xl h-full bg-white rounded-[4px] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-black/10">
          <div className="min-w-0">
            <p className="text-[15px]! md:text-[16px]! leading-snug! font-medium text-black truncate">{doc.title}</p>
            <p className="text-[12px]! leading-none! mt-1 text-[#777] uppercase tracking-wide">
              {doc.date && <span>{doc.date} · </span>}PDF · {formatSize(doc.size)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={doc.href}
              download={fileName(doc.href)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[3px] bg-[#1B123D] hover:bg-[#2A1D5C] text-white text-xs font-semibold tracking-wide transition-colors"
            >
              <Download strokeWidth={1.75} className="w-4 h-4" />
              <span className="max-sm:hidden">Download</span>
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="grid place-items-center w-9 h-9 rounded-[3px] border border-black/15 text-black hover:bg-black/[0.04] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B123D]"
            >
              <X strokeWidth={1.75} className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        <iframe src={`${doc.href}#view=FitH`} title={doc.title} className="flex-1 w-full bg-[#525659]" />
      </div>
    </div>,
    document.body
  );
};

/* ---------- the section ---------- */

const InvestorRelations = () => {
  const sectionRef = useRef(null);
  const [activeId, setActiveId] = useState(investorCategories[0].id);
  const [viewing, setViewing] = useState(null);
  useScrollReveal(sectionRef);

  const active = investorCategories.find((c) => c.id === activeId);

  const onView = useCallback((doc) => {
    if (canEmbedPdf()) setViewing(doc);
    // Phones: the browser's own PDF viewer, still on this site
    else window.open(doc.href, "_blank", "noopener");
  }, []);
  const closeViewer = useCallback(() => setViewing(null), []);


  return (
    <section  ref={sectionRef} id="investor-relations" className="w-full bg-[#FAFAFA] py-24 md:py-32 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left: heading and contact for investor grievances */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 flex flex-col gap-8">
            <h5 data-reveal="words" className="text-3xl! lg:text-5xl! leading-tight! font-semibold text-black tracking-tight">
              Investor Relations
            </h5>

            <div data-reveal="rise" className="flex flex-col gap-2 ">
              <p className="text-black text-[15px]! leading-relaxed! font-medium">
                Contact information for assisting and handling investor grievances:
              </p>
              <p className="text-[#555] text-[15px]! leading-relaxed!">
                Ms. Pratiksha Panchal,<br />
                Company Secretary and Compliance Officer<br />
                Tel: Board line — 3364 9400;
              </p>
              <p className="text-[#555] text-[15px]! leading-relaxed!">
                Email:{" "}
                <a href="mailto:investorrelations@muktaarts.com" className="font-medium text-black hover:underline">
                  investorrelations@muktaarts.com
                </a>
              </p>
              <UnclaimedDividend onView={onView} />
            </div>
          </div>
        </div>

        {/* Right: the documents, by category */}
        <div data-reveal="rise" className="lg:col-span-8 min-w-0">
          <div
            role="tablist"
            aria-label="Investor documents"
            className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap [scrollbar-width:none]"
          >
            {investorCategories.map((category) => {
              const selected = category.id === activeId;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(category.id)}
                  className={`shrink-0 inline-flex items-center gap-2 h-10 px-4  text-sm font-medium border transition-colors cursor-pointer ${
                    selected
                      ? "bg-[#1B123D] border-[#1B123D] text-white"
                      : "border-black/15 text-[#333] hover:border-[#1B123D] hover:text-[#1B123D]"
                  }`}
                >
                  {category.title}
                  <span className={`text-xs tabular-nums ${selected ? "text-white/60" : "text-[#999]"}`}>
                    {countDocs(category)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Keyed by category, so each tab starts with its first section open */}
          <div key={active.id} role="tabpanel" aria-label={active.title}>
            {active.intro && (
              <p className="text-[#555] text-[15px]! md:text-[16px]! leading-relaxed! max-w-3xl mb-8">{active.intro}</p>
            )}
            {active.sections.map((section, index) =>
              // A section without a title is listed straight under the heading, as on the original page
              section.title ? (
                <Section
                  key={section.title}
                  section={section}
                  isFirst={index === 0}
                  defaultOpen={index === 0}
                  onView={onView}
                />
              ) : (
                <div key={index} className="border-t border-[#c2c2c2]">
                  <DocList docs={section.docs} onView={onView} />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {viewing && <PdfViewer doc={viewing} onClose={closeViewer} />}
    </section>
  );
};

export default InvestorRelations;
