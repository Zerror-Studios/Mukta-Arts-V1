"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { smoothScrollTo } from "@/lib/smoothScroll";
import useAfterIntro from "@/hooks/useAfterIntro";

// three.js stays out of the page bundle: the canvas arrives in its own chunk
const ProgramsCanvas = dynamic(() => import("./ProgramsCanvas"), { ssr: false });

/* -------------------------------------------------------------------------- */
/*  DATA                                                                      */
/* -------------------------------------------------------------------------- */
const programsData = [
  {
    id: "01",
    title: "University Affiliation",
    description: "01",
    mainImage: "/img/final/sgm_Last/1.webp",
    thumbImage: "/img/final/sgm_Last/1.webp",
  },
  {
    id: "02",
    title: "Global Partnerships",
    description: "02",
    mainImage: "/img/final/sgm_Last/web/2.webp",
    thumbImage: "/img/final/sgm_Last/web/2.webp",
  },
  {
    id: "03",
    title: "Industry Integration",
    description: "03",
    mainImage: "/img/final/sgm_Last/web/3.webp",
    thumbImage: "/img/final/sgm_Last/web/3.webp",
  },
  {
    id: "04",
    title: "SGM Studios 04",
    description: "04",
    mainImage: "/img/final/sgm_Last/web/4.webp",
    thumbImage: "/img/final/sgm_Last/web/4.webp",
  },
  {
    id: "05",
    title: "SGM Studios 05",
    description: "05",
    mainImage: "/img/final/sgm_Last/5.webp",
    thumbImage: "/img/final/sgm_Last/5.webp",
  },
  {
    id: "06",
    title: "SGM Studios 06",
    description: "06",
    mainImage: "/img/final/sgm_Last/6.webp",
    thumbImage: "/img/final/sgm_Last/6.webp",
  },
  {
    id: "07",
    title: "SGM Studios 07",
    description: "07",
    mainImage: "/img/final/sgm_Last/7.webp",
    thumbImage: "/img/final/sgm_Last/7.webp",
  },
  {
    id: "08",
    title: "SGM Studios 08",
    description: "08",
    mainImage: "/img/final/sgm_Last/8.webp",
    thumbImage: "/img/final/sgm_Last/8.webp",
  },
];

const NUM_ITEMS = programsData.length;
const IMAGES = programsData.map((p) => p.mainImage);
const BG = "#FAFAFA"; // same light ground as the schools above, so the two read as one flow
const DEFAULT_INTENSITY = 0.3; // ripple strength: 0 = off, 1 = strong. Kept low so this section is no busier than its neighbours

/* -------------------------------------------------------------------------- */
/*  SECTION                                                                   */
/* -------------------------------------------------------------------------- */
export default function WWAcademicPrograms({ rippleIntensity = DEFAULT_INTENSITY }) {
  const sectionRef = useRef(null);
  const stRef = useRef(null);
  const targetRef = useRef(0); // float 0 .. n-1, driven by scroll
  const invalidateRef = useRef(null); // asks the canvas for a frame (it only draws on demand)
  const prevActive = useRef(0);
  const [active, setActive] = useState(0);
  // Below the fold: the canvas, its three.js chunk and textures load once the page is idle
  const sceneOn = useAfterIntro();

  /* ---- pin + scrub ---- */
  useGSAP(
    () => {
      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * NUM_ITEMS}`,
        pin: true,
        // Sets the pin a moment early on a fast flick, so it doesn't visibly jump as it catches the
        // section (on phones the page scrolls ahead of the script)
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress * (NUM_ITEMS - 1);
          targetRef.current = p;
          invalidateRef.current?.();
          setActive(Math.round(p));
        },
      });
    },
    { scope: sectionRef }
  );

  /* ---- number transitions when the active item changes ---- */
  useEffect(() => {
    const prev = prevActive.current;
    if (prev === active) return;
    const dir = active > prev ? 1 : -1;
    const q = gsap.utils.selector(sectionRef);

    gsap.to(q(`.d-item-${prev}`), {
      autoAlpha: 0,
      y: -20 * dir,
      duration: 0.4,
      ease: "power2.in",
      overwrite: "auto",
    });
    gsap.fromTo(
      q(`.d-item-${active}`),
      { autoAlpha: 0, y: 20 * dir },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        delay: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      }
    );

    prevActive.current = active;
  }, [active]);

  const goTo = (i) => {
    const st = stRef.current;
    if (!st) return;
    smoothScrollTo(st.start + (i / (NUM_ITEMS - 1)) * (st.end - st.start));
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh w-full flex-col justify-center gap-5 overflow-hidden px-5 text-black sm:gap-6 sm:px-8 md:block md:h-screen md:p-0"
      style={{ backgroundColor: BG }}
    >
      {/* ---------------- Center: WebGL image ---------------- */}
      {/* full-bleed: fills the whole pinned section on every breakpoint; the gray shows until the images load */}
      <div className="absolute inset-0 z-10 h-full w-full overflow-hidden bg-[#e5e7eb]">
        {sceneOn && (
          <ProgramsCanvas
            images={IMAGES}
            intensity={rippleIntensity}
            targetRef={targetRef}
            onReady={(invalidate) => {
              invalidateRef.current = invalidate;
            }}
          />
        )}
      </div>

      {/* ---------------- Scroll hint ---------------- */}
      <span className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-white">
        SCROLL
      </span>

      {/* ---------------- Right: description ---------------- */}
      {/* mobile: header row above the image (progress + number) | md+: right of image */}
      <div className="pointer-events-none relative order-1 z-20 flex w-full items-center justify-between md:absolute md:right-[7vw] md:top-1/2 md:block md:w-[17vw] md:-translate-y-1/2">
        {/* mobile progress (thumbnail rail is hidden below md) */}
        <div className="pointer-events-auto flex items-center gap-1 md:hidden">
          {programsData.map((item, i) => (
            <button
              key={`dot-${item.id}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.title}`}
              className="px-0.5 py-3"
            >
              <span
                className={`block h-0.5 transition-all duration-500 ${
                  i === active ? "w-8 bg-black" : "w-4 bg-black/25"
                }`}
              />
            </button>
          ))}
        </div>

        {/* only the first number shows until the scroll swaps them (hidden in the HTML, so none flash before hydration) */}
        <div className="grid">
          {programsData.map((item, i) => (
            <p
              key={`desc-${item.id}`}
              className={`d-item d-item-${i} col-start-1 row-start-1 flex items-end justify-end text-sm font-medium leading-snug text-black ${
                i === 0 ? "" : "invisible opacity-0"
              }`}
            >
              {item.description}
            </p>
          ))}
        </div>
      </div>

      {/* ---------------- Far right: thumbnail rail ---------------- */}
      <div className="absolute right-[1.5vw] top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        {programsData.map((item, i) => {
          const on = i === active;
          return (
            <button
              key={`thumb-${item.id}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.title}`}
              className="flex items-center justify-end gap-3"
            >
              <span
                className={`h-px bg-black transition-all duration-500 ${
                  on ? "w-5 opacity-100" : "w-0 opacity-0"
                }`}
              />
              <span
                className={`block h-7 w-[42px] overflow-hidden transition-opacity duration-500 ${
                  on ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                {/* 42px thumbnails of up-to-8000px sources: Next serves them ~96px wide */}
                <Image
                  src={item.thumbImage}
                  alt=""
                  width={42}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
