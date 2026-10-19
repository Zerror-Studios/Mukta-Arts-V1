"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, EASE, DURATION_LONG, STAGGER, RISE, MOTION_OK } from "@/lib/motion";
import useInView from "@/hooks/useInView";

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

  useGSAP(() => {
    // Heading reveal, the home page's rise: the titles row and the first panel's heading
    // as the section enters, then each panel's heading as that panel takes over
    let revealHeading = () => {};
    let shown = 0;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const splits = subtitleRefs.current.map((h) => SplitText.create(h, { type: "lines" }));
      revealHeading = (i) =>
        gsap.fromTo(
          splits[i].lines,
          { autoAlpha: 0, y: RISE },
          { autoAlpha: 1, y: 0, duration: DURATION_LONG, ease: EASE, stagger: STAGGER, overwrite: true }
        );

      gsap.set(splits[0].lines, { autoAlpha: 0, y: RISE });
      gsap.fromTo(
        titlesWrapRef.current,
        { autoAlpha: 0, y: RISE * 2 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION_LONG,
          ease: EASE,
          scrollTrigger: { trigger: containerRef.current, start: "top 70%", once: true },
          onStart: () => revealHeading(0),
        }
      );
      return () => {
        revealHeading = () => {};
      };
    });

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
          const current = Math.min(slides.length - 1, Math.round(self.progress * (slides.length - 1) + 0.15));
          if (current !== shown) {
            shown = current;
            revealHeading(current);
          }
        },
      },
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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
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
      <div className="relative z-20 h-full w-full flex flex-col justify-center py-6 md:py-10">
        {/* Titles Container */}
        <div className="w-full overflow-hidden mb-6 md:mb-10">
          <div ref={titlesWrapRef} className="px-6 md:px-12 lg:px-16">
            <div
              className="flex items-center gap-12 md:gap-28 lg:gap-36 whitespace-nowrap w-max relative"
              ref={titlesContainerRef}
            >
              {slides.map((slide, i) => (
                <h2
                  key={`title-${i}`}
                  ref={(el) => (titleRefs.current[i] = el)}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tight text-white uppercase font-['SwitzerB'] leading-none select-none transition-opacity"
                  style={{ opacity: i === 0 ? 1 : 0.25 }}
                >
                  {slide.title}
                </h2>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Line & Meta Info */}
        <div className="w-full flex items-center px-6 md:px-12 lg:px-16 mb-6 md:mb-8">
          {/* Index Counter */}
          <div className="relative w-14 md:w-16 h-6 overflow-hidden">
            {slides.map((slide, i) => (
              <div
                key={`index-${i}`}
                ref={(el) => (indexRefs.current[i] = el)}
                className="absolute top-0 left-0 text-xs md:text-sm font-mono tracking-widest text-white/70"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateY(0)" : "translateY(20px)",
                }}
              >
                0{i + 1} / 0{slides.length}
              </div>
            ))}
          </div>

          <div className="flex-1 h-[1px] bg-white/20 mx-4 md:mx-8"></div>

          {/* Slide Tag / Category */}
          <div className="relative h-6 overflow-hidden text-right min-w-[130px]">
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
          </div>
        </div>

        {/* Descriptions and Details */}
        <div className="relative w-full px-6 md:px-12 lg:px-16 flex justify-center min-h-[360px] md:min-h-[300px]">
          <div className="relative w-full max-w-6xl">
            {slides.map((slide, i) => (
              <div
                key={`desc-${i}`}
                ref={(el) => (descRefs.current[i] = el)}
                className="absolute top-0 left-0 w-full"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateY(0)" : "translateY(20px)",
                }}
              >
                {/* Subtitle */}
                <h3
                  ref={(el) => (subtitleRefs.current[i] = el)}
                  className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-white font-['SwitzerM'] mb-3 md:mb-4"
                >
                  {slide.subtitle}
                </h3>

                {/* Narrative / Description */}
                <div className="text-sm sm:text-base md:text-[15px] lg:text-[16px] leading-relaxed text-gray-200/90 font-['SwitzerR'] max-w-4xl mb-6 md:mb-8 space-y-2">
                  {slide.desc.split("\n\n").map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {/* Slide 1: Stats */}
                {slide.stats && (
                  <div className="flex flex-wrap items-center gap-8 md:gap-16 pt-1">
                    {slide.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="flex items-baseline sm:flex-col gap-3 sm:gap-1">
                        <span className="text-4xl sm:text-5xl md:text-6xl font-bold font-['SwitzerB'] text-white tracking-tight">
                          {stat.value}
                        </span>
                        <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-400 font-['SwitzerM']">
                          {stat.label}
                        </span>
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
                        className="border-l-2 border-white/40 pl-4 py-1.5 bg-white/[0.02] md:bg-transparent rounded-r"
                      >
                        <div className="text-xs md:text-sm font-semibold tracking-wider uppercase text-white font-['SwitzerSB'] mb-1.5">
                          {card.title}
                        </div>
                        {card.items ? (
                          <div className="space-y-1">
                            {card.items.map((item, itIdx) => (
                              <div
                                key={itIdx}
                                className="text-xs md:text-[13px] leading-relaxed text-gray-300 font-['SwitzerR']"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs md:text-[13px] leading-relaxed text-gray-300 font-['SwitzerR']">
                            {card.desc}
                          </div>
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
    </section>
  );
};

export default FilmLegacy;
