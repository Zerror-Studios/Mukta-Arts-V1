"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, EASE, DURATION_LONG, STAGGER, RISE, MOTION_OK } from "@/lib/motion";
import useInView from "@/hooks/useInView";
import { smoothScrollTo } from "@/lib/smoothScroll";

// Phones, upright or on their side, read the slides as chapters down the page under a sticky
// row of titles; anything bigger pins the section and scrubs through them. Keep PHONE in step
// with the `phone` variant in globals.css. Phone sizes are in px on purpose: the root font size
// is 14px on an upright phone but follows the width on one turned sideways.
const PHONE = "(max-width: 767.98px), (max-height: 500px)";
const DESK = "(min-width: 768px) and (min-height: 501px)";

const slides = [
  {
    title: "THE FILMMAKER",
    subtitle: "A Legacy Written Into Indian Cinema",
    tag: "Director & Writer",
    desc: "With 19 films as writer-director, Subhash Ghai has created some of Hindi cinema’s most enduring films. His films have delivered 14 major blockbusters, while his work as a producer has further expanded his contribution to Indian cinema.",
    stats: [
      {
        value: "19",
        label: "Films as Writer & Director",
      },
      {
        value: "14",
        label: "Blockbusters",
      },
    ],
    bg: "/img/final/SG/S3/SG_0055_3_11zon.webp",
  },
  {
    title: "THE INDUSTRY PIONEER",
    subtitle: "A Filmmaker Who Built What Didn’t Exist",
    tag: "Industry Pioneer",
    desc: "Subhash Ghai has consistently pushed the Indian film industry forward - from introducing film insurance through the pioneering CineMukta Policy and bringing digital projection to smaller centres, to taking Mukta Arts public as India’s first listed film studio. He also helped bring film producers and financial institutions together, opening new avenues for organised film financing.",
    cards: [
      {
        title: "FIRST FILM STUDIO TO IPO",
        desc: "Mukta Arts became the first Indian film studio to be listed on the major stock exchanges.",
      },
      {
        title: "CINEMUKTA POLICY",
        desc: "India’s first film insurance policy, introduced through Taal.",
      },
      {
        title: "DIGITAL CINEMA",
        desc: "A pioneer in bringing digital projection to smaller centres across India.",
      },
    ],
    bg: "/img/final/SG/S3/pioneer_2_11zon.webp",
  },
  {
    title: "THE HUMANITARIAN",
    subtitle: "Cinema With A Larger Purpose",
    tag: "Social Impact",
    desc: "Beyond the screen, Subhash Ghai has consistently used his influence and platform for social causes. From supporting disaster relief and the armed forces through charity premieres to promoting national integration, organ donation, Swachh Bharat and International Yoga Day, his engagement with society has extended well beyond filmmaking.\n\nHe has also championed media education in India, including the introduction of Media Studies as an academic elective within the CBSE curriculum.",
    cards: [
      {
        title: "NATIONAL INTEGRATION",
        desc: "Pyar Ki Ganga Bahe - a Doordarshan music video promoting unity.",
      },
      {
        title: "EDUCATION",
        desc: "Advocating media studies as part of mainstream education.",
      },
      {
        title: "SOCIAL CAUSES",
        desc: "Supporting disaster relief, organ donation, national campaigns and charitable initiatives.",
      },
    ],
    bg: "/img/final/SG/S3/humanitarian_1_11zon.webp",
  },
  {
    title: "THE HONOURS",
    subtitle: "Recognised At Home And Around The World",
    tag: "Honours & Awards",
    desc: "Five decades of work have earned Subhash Ghai recognition across cinema, education and social leadership. His honours include two Filmfare Awards, the IIFA Lifetime Achievement Award, Star Screen Lifetime Achievement Award, Pune International Film Festival Distinguished Award, and recognition from the United States Senate. He has also served on international juries including the International Emmy Awards and participated in the Cannes anti-piracy panel.",
    cards: [
      {
        title: "FILMFARE AWARDS",
        items: ["Best Director - Saudagar", "Best Screenplay - Pardes"],
      },
      {
        title: "IIFA",
        desc: "Outstanding Contribution to Indian Cinema - 2015",
      },
      {
        title: "LIFETIME ACHIEVEMENT",
        desc: "Star Screen Awards, Amar Ujala & other industry honours",
      },
    ],
    bg: "/img/final/SG/S3/SG_0059_4_11zon.webp",
  },
];

const FilmLegacy = () => {
  const containerRef = useRef(null);
  const titlesContainerRef = useRef(null);
  const bgRefs = useRef([]);
  // Background images are only fetched once the section is a screen or so away
  const bgReady = useInView(containerRef, "100%", true);
  const titleRefs = useRef([]);
  const indexRefs = useRef([]);
  const tagRefs = useRef([]);
  const descRefs = useRef([]);
  const titlesWrapRef = useRef(null);
  const subtitleRefs = useRef([]);
  const progressRef = useRef(null);
  const hintRef = useRef(null);
  const jumpToRef = useRef(null);
  const barRef = useRef(null);

  useGSAP(() => {
    // The titles row rises in as the section enters
    const riseTitles = (onStart) =>
      gsap.fromTo(
        titlesWrapRef.current,
        { autoAlpha: 0, y: RISE * 2 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION_LONG,
          ease: EASE,
          scrollTrigger: { trigger: containerRef.current, start: "top 70%", once: true },
          onStart,
        }
      );

    // Both layouts share the titles row, counter and backgrounds, and each starts them at the
    // first slide, whatever the other left behind on a resize across the breakpoint
    const startAtFirst = () => {
      gsap.set(titlesContainerRef.current, { x: 0 });
      gsap.set(titleRefs.current, { opacity: (i) => (i ? 0.25 : 1) });
      gsap.set(bgRefs.current, { opacity: (i) => (i ? 0 : 1) });
      gsap.set(indexRefs.current, { opacity: (i) => (i ? 0 : 1), y: (i) => (i ? 20 : 0) });
    };

    // Desktop and tablets: the section pins and the scroll scrubs from one slide to the next
    const pinSlides = (motion, contextSafe) => {
      startAtFirst();

      // Heading reveal, the home page's rise: the titles row and the first panel's heading
      // as the section enters, then each panel's heading as that panel takes over
      let revealHeading = () => {};
      let shown = 0;
      if (motion) {
        const splits = subtitleRefs.current.map((h) => SplitText.create(h, { type: "lines" }));
        revealHeading = contextSafe((i) =>
          gsap.fromTo(
            splits[i].lines,
            { autoAlpha: 0, y: RISE },
            { autoAlpha: 1, y: 0, duration: DURATION_LONG, ease: EASE, stagger: STAGGER, overwrite: true }
          )
        );

        gsap.set(splits[0].lines, { autoAlpha: 0, y: RISE });
        riseTitles(() => revealHeading(0));
      }

      // Later panels wait just below their place until the timeline brings them in
      gsap.set(descRefs.current.slice(1), { y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${slides.length * 1000}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(progressRef.current, { scaleX: self.progress });

            // The scroll hint shows until the reader starts moving through the slides
            const hintOn = self.progress < 0.02;
            if (hintOn !== hintShown) {
              hintShown = hintOn;
              gsap.to(hintRef.current, { autoAlpha: hintOn ? 1 : 0, duration: 0.4, overwrite: true });
            }

            const current = Math.min(slides.length - 1, Math.round(self.progress * (slides.length - 1) + 0.15));
            if (current !== shown) {
              shown = current;
              revealHeading(current);
            }
          },
        },
      });
      let hintShown = true;

      // A title click glides the page to the point where that slide is fully in, so the
      // scrubbed timeline plays the same transition the wheel would. Slide i lands at i / (n - 1).
      jumpToRef.current = contextSafe((index) => {
        const st = tl.scrollTrigger;
        if (!st) return;
        const y = st.start + (index / (slides.length - 1)) * (st.end - st.start);

        if (!window.lenis) {
          smoothScrollTo(y);
          return;
        }
        const steps = Math.abs(index - shown);
        window.lenis.scrollTo(y, {
          duration: gsap.utils.clamp(1, 2.2, 0.8 + steps * 0.45),
          easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
          force: true,
        });
      });

      slides.forEach((slide, i) => {
        if (i === 0) return;

        const prevTitle = titleRefs.current[i - 1];
        const currentTitle = titleRefs.current[i];
        const currentBg = bgRefs.current[i];

        const prevDesc = descRefs.current[i - 1];
        const currentDesc = descRefs.current[i];

        const prevIndex = indexRefs.current[i - 1];
        const currentIndex = indexRefs.current[i];

        const prevTag = tagRefs.current[i - 1];
        const currentTag = tagRefs.current[i];

        tl.addLabel(`slide${i}`)
          // Background crossfade
          .to(currentBg, { opacity: 1, duration: 1, ease: "none" }, `slide${i}`)

          // Move titles container dynamically
          .to(
            titlesContainerRef.current,
            {
              x: () => {
                const firstTitleOffset = titleRefs.current[0]?.offsetLeft || 0;
                const currentTitleOffset = currentTitle?.offsetLeft || 0;
                return -(currentTitleOffset - firstTitleOffset);
              },
              duration: 1,
              ease: "power2.inOut",
            },
            `slide${i}`
          )

          // Title opacities
          .to(prevTitle, { opacity: 0.25, duration: 1, ease: "power2.inOut" }, `slide${i}`)
          .to(currentTitle, { opacity: 1, duration: 1, ease: "power2.inOut" }, `slide${i}`)

          // Animate out previous content
          .to(
            [prevDesc, prevIndex, prevTag],
            {
              opacity: 0,
              y: -20,
              duration: 0.4,
              ease: "power1.in",
            },
            `slide${i}`
          )

          // Animate in current content
          .to(
            [currentDesc, currentIndex, currentTag],
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power1.out",
            },
            `slide${i}+=0.6`
          );
      });

      return () => {
        jumpToRef.current = null;
      };
    };

    // Phones: the slides read as chapters down the page. The titles row and the progress line
    // stick under the header and the backgrounds hold still behind; as each chapter comes up,
    // the row slides to its title and its background fades in.
    const stackChapters = (motion, contextSafe) => {
      const section = containerRef.current;
      const strip = titlesContainerRef.current;
      const titles = titleRefs.current;
      const chapters = descRefs.current;
      const stripX = (i) => -(titles[i].offsetLeft - titles[0].offsetLeft);
      startAtFirst();

      if (motion) {
        riseTitles();

        // Each chapter's heading, then its copy, rises as the chapter comes up the screen
        chapters.forEach((chapter, i) => {
          const split = SplitText.create(subtitleRefs.current[i], { type: "lines" });
          const body = gsap.utils.toArray("[data-rise]", chapter);
          gsap.set([...split.lines, ...body], { autoAlpha: 0, y: RISE });
          ScrollTrigger.create({
            trigger: chapter,
            start: "top 85%",
            once: true,
            onEnter: contextSafe(() => {
              gsap.to(split.lines, {
                autoAlpha: 1,
                y: 0,
                duration: DURATION_LONG,
                ease: EASE,
                stagger: STAGGER,
                // Back to plain text, so turning the phone re-wraps the heading cleanly
                onComplete: () => split.revert(),
              });
              gsap.to(body, { autoAlpha: 1, y: 0, duration: DURATION_LONG, ease: EASE, stagger: STAGGER, delay: 0.15 });
            }),
          });
        });
      }

      // Everything is tweened to where chapter i wants it, overwriting outright so a quick run
      // through several chapters never leaves a delayed tween behind
      let active = 0;
      const activate = contextSafe((i) => {
        if (i === active) return;
        active = i;
        gsap.to(strip, { x: stripX(i), duration: 0.8, ease: "power3.inOut", overwrite: true });
        titles.forEach((title, j) =>
          gsap.to(title, { opacity: j === i ? 1 : 0.25, duration: 0.6, ease: "power2.inOut", overwrite: true })
        );
        bgRefs.current.forEach((bg, j) =>
          gsap.to(bg, { opacity: j <= i ? 1 : 0, duration: 0.8, ease: "none", overwrite: true })
        );
        // Counters before this one lift out, later ones wait below
        indexRefs.current.forEach((el, j) =>
          gsap.to(el, {
            opacity: j === i ? 1 : 0,
            y: j === i ? 0 : j < i ? -20 : 20,
            duration: 0.4,
            delay: j === i ? 0.2 : 0,
            ease: j === i ? "power1.out" : "power1.in",
            overwrite: true,
          })
        );
      });

      // A chapter takes over once its top passes the middle of the screen
      chapters.forEach((chapter, i) => {
        if (i === 0) return;
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 55%",
          onEnter: () => activate(i),
          onLeaveBack: () => activate(i - 1),
        });
      });

      // The line fills as the page reads through the chapters; the titles row keeps its
      // place when a resize moves the titles
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => gsap.set(progressRef.current, { scaleX: self.progress }),
        onRefresh: contextSafe(() => gsap.set(strip, { x: stripX(active) })),
      });

      // A title tap brings that chapter up to sit just under the titles row
      jumpToRef.current = (index) =>
        smoothScrollTo(chapters[index].getBoundingClientRect().top + window.scrollY - barRef.current.offsetHeight);

      return () => {
        jumpToRef.current = null;
      };
    };

    const mm = gsap.matchMedia();
    mm.add({ desk: DESK, phone: PHONE, motion: MOTION_OK }, (context, contextSafe) => {
      const { desk, phone, motion } = context.conditions;
      if (desk) return pinSlides(motion, contextSafe);
      if (phone) return stackChapters(motion, contextSafe);
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-svh w-full overflow-hidden bg-black text-white phone:h-auto phone:overflow-visible"
    >
      {/* Background Images: fill the pinned section, or on phones hold still behind the chapters */}
      <div className="absolute inset-0 z-0 phone:sticky phone:bottom-auto phone:h-svh phone:mb-[-100svh]">
        {slides.map((slide, i) => (
          <div
            key={`bg-${i}`}
            ref={(el) => (bgRefs.current[i] = el)}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: bgReady ? `url(${slide.bg})` : undefined,
              opacity: i === 0 ? 1 : 0,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60 backdrop-blur-[2px]"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full w-full flex flex-col justify-center py-6 md:py-10 phone:block phone:h-auto phone:py-0">
        {/* Titles and progress; on phones they stick under the header while the chapters scroll */}
        <div
          ref={barRef}
          className="phone:sticky phone:top-0 phone:z-10 phone:pt-[76px] short:pt-[64px]! phone:pb-[30px] phone:bg-[linear-gradient(to_bottom,#000_calc(100%-26px),transparent)]"
        >
          {/* Titles Container; the row moves by transform only, so a focused title that peeks
              past the edge must not scroll it sideways as well */}
          <div
            className="w-full overflow-hidden mb-6 md:mb-10 phone:mb-[14px]"
            onScroll={(e) => (e.currentTarget.scrollLeft = 0)}
          >
            <div ref={titlesWrapRef} className="px-6 md:px-12 lg:px-16">
              <div
                className="flex items-center gap-12 md:gap-28 lg:gap-36 whitespace-nowrap w-max relative phone:gap-[36px]"
                ref={titlesContainerRef}
              >
                {slides.map((slide, i) => (
                  <h2
                    key={`title-${i}`}
                    ref={(el) => (titleRefs.current[i] = el)}
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tight text-white uppercase font-['SwitzerB'] leading-none select-none transition-opacity phone:text-[length:min(30px,7.2vw,6.5svh)]! phone:leading-[1.1]!"
                    style={{ opacity: i === 0 ? 1 : 0.25 }}
                  >
                    <button
                      type="button"
                      onClick={() => jumpToRef.current?.(i)}
                      className="group relative cursor-pointer uppercase focus-visible:outline-none"
                    >
                      {slide.title}
                      {/* Hover underline: shows the titles can be clicked */}
                      <span className="absolute left-0 -bottom-2 md:-bottom-3 h-[2px] w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                    </button>
                  </h2>
                ))}
              </div>
            </div>
          </div>

          {/* Horizontal Line & Meta Info */}
          <div className="w-full flex items-center px-6 md:px-12 lg:px-16 mb-6 md:mb-8 phone:mb-0">
            {/* Index Counter */}
            <div className="relative w-14 md:w-16 h-6 overflow-hidden phone:w-[64px] phone:h-[18px]">
              {slides.map((slide, i) => (
                <div
                  key={`index-${i}`}
                  ref={(el) => (indexRefs.current[i] = el)}
                  className="absolute top-0 left-0 text-xs md:text-sm font-mono tracking-widest text-white/70 phone:text-[11px] phone:leading-[18px]"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    transform: i === 0 ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  0{i + 1} / 0{slides.length}
                </div>
              ))}
            </div>

            {/* Progress through the slides, filled by the scroll */}
            <div className="relative flex-1 h-[1px] bg-white/20 mx-4 md:mx-8">
              <div
                ref={progressRef}
                className="absolute inset-0 bg-white origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            {/* Slide Tag / Category */}
            {/* <div className="relative h-6 overflow-hidden text-right min-w-[130px]">
              {slides.map((slide, i) => (
                <div
                  key={`tag-${i}`}
                  ref={(el) => (tagRefs.current[i] = el)}
                  className="absolute top-0 right-0 text-xs md:text-sm font-['SwitzerM'] tracking-widest uppercase text-white/60 whitespace-nowrap"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    transform: i === 0 ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  {slide.tag}
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Descriptions and Details */}
        <div className="relative w-full px-6 md:px-12 lg:px-16 flex justify-start min-h-[360px] md:min-h-[300px]  phone:block phone:min-h-0">
          <div className="relative w-full max-w-6xl phone:max-w-none">
            {slides.map((slide, i) => (
              <div
                key={`desc-${i}`}
                ref={(el) => (descRefs.current[i] = el)}
                className={`absolute top-0 left-0 w-full phone:relative phone:pb-[64px] ${i ? "opacity-0 phone:opacity-100" : ""}`}
              >
                {/* Subtitle */}
                <h3
                  ref={(el) => (subtitleRefs.current[i] = el)}
                  className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-white font-['SwitzerM'] mb-3 md:mb-4 phone:text-[22px] phone:leading-[1.25] phone:mb-[12px]"
                >
                  {slide.subtitle}
                </h3>

                {/* Narrative / Description */}
                <div
                  data-rise
                  className="text-sm sm:text-base md:text-[15px] lg:text-[16px] leading-relaxed text-gray-200/90 font-['SwitzerR'] max-w-4xl mb-6 md:mb-8 space-y-2 phone:max-w-[600px] phone:mb-[24px] phone:space-y-[12px]"
                >
                  {slide.desc.split("\n\n").map((para, pIdx) => (
                    <p key={pIdx} className="phone:text-[15px]! phone:leading-[1.6]!">{para}</p>
                  ))}
                </div>

                {/* Slide 1: Stats */}
                {slide.stats && (
                  <div data-rise className="flex flex-wrap items-center gap-8 md:gap-16 pt-1">
                    {slide.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="flex items-baseline sm:flex-col gap-3 sm:gap-1">
                        <p className=" font-bold font-['SwitzerB'] text-white tracking-tight phone:text-[16px]! phone:leading-[1.3]!">
                          {stat.value}
                        </p>
                        <p className=" uppercase tracking-wider text-gray-400 font-['SwitzerM'] phone:text-[16px]! phone:leading-[1.3]!">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Slides 2, 3, 4: Feature Cards */}
                {slide.cards && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-1">
                    {slide.cards.map((card, cIdx) => (
                      <div
                        key={cIdx}
                        data-rise
                        className="border-l-2 border-white/40 pl-4 py-1.5 bg-white/[0.02] md:bg-transparent rounded-r"
                      >
                        <div className="text-xs md:text-sm font-semibold tracking-wider uppercase text-white font-['SwitzerSB'] mb-1.5 phone:text-[12px]">
                          {card.title}
                        </div>
                        {card.items ? (
                          <div className="space-y-1">
                            {card.items.map((item, itIdx) => (
                              <p
                                key={itIdx}
                                className="text-xs md:text-[13px] leading-relaxed text-gray-300 font-['SwitzerR'] phone:text-[14px]! phone:leading-[1.5]!"
                              >
                                {item}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs md:text-[13px] leading-relaxed text-gray-300 font-['SwitzerR'] phone:text-[14px]! phone:leading-[1.5]!">
                            {card.desc}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll guide; phones scroll the chapters like any page, so they go without */}
      <div
        ref={hintRef}
        className="pointer-events-none absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-[10px] md:text-xs font-['SwitzerM'] tracking-[0.25em] uppercase text-white/60 whitespace-nowrap phone:hidden"
      >
        <p>Scroll to explore · or click a title</p>
        <span className="relative h-8 w-[1px] overflow-hidden bg-white/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white motion-safe:animate-[scroll-hint_1.6s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
};

export default FilmLegacy;
