'use client';
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const carouselData = [
  {
    id: 1,
    title: 'Subhash Ghai',
    subtitle: 'Executive Chairman',
    description: 'Executive Chairman: Mukta Arts Ltd • Founder/Chairman: Whistling Woods International • Director - Mukta A2 Cinemas Private Ltd',
    bgImage: '/img/last/1.jpg',
    cardImage: '/img/last/1.jpg',
  },
  {
    id: 2,
    title: 'Rahul Puri',
    subtitle: 'Managing Director',
    description: 'Managing Director: Mukta Arts Ltd • Director - Academics: Whistling Woods International • Director: Mukta A2 Cinemas Private Ltd',
    bgImage: '/img/last/2.avif',
    cardImage: '/img/last/2.avif',
  },
  {
    id: 3,
    title: 'Parvez Farooqui',
    subtitle: 'Director',
    description: 'Director: Mukta Arts Ltd • Executive Director: Mukta A2 Cinemas Private Ltd',
    bgImage: '/img/last/3.jpg',
    cardImage: '/img/last/3.jpg',
  },
  {
    id: 4,
    title: 'Kapil Bagla',
    subtitle: 'Independent Director',
    description: 'Independent Director: Mukta Arts Ltd',
    bgImage: '/img/last/4.avif',
    cardImage: '/img/last/4.avif',
  },
  {
    id: 5,
    title: 'Rajendra Doshi',
    subtitle: 'Independent Director',
    description: 'Independent Director: Mukta Arts Ltd',
    bgImage: '/img/last/5.png',
    cardImage: '/img/last/5.png',
  },
  {
    id: 6,
    title: 'Madhumati Ramchandra Lele',
    subtitle: 'Independent Director',
    description: 'Independent Director: Mukta Arts Ltd',
    bgImage: '/img/last/6.jpg',
    cardImage: '/img/last/6.jpg',
  },
  {
    id: 7,
    title: 'Rentala Chandrashekhar',
    subtitle: 'Independent Director',
    description: 'Independent Director: Mukta Arts Ltd',
    bgImage: '/img/last/7.jpg',
    cardImage: '/img/last/7.jpg',
  }
];

const WorkCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const bgRef = useRef(null);

  const SLIDE_DURATION = 5; // seconds

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1));
  };

  // Generate the upcoming cards (shifting the array so it starts from activeIndex + 1)
  const upcomingCards = Array.from({ length: carouselData.length }, (_, i) => {
    return carouselData[(activeIndex + i + 1) % carouselData.length];
  });

  // Animation for text and background when activeIndex changes
  useGSAP(() => {
    // Kill any existing tweens to prevent overlapping animations if clicked rapidly
    gsap.killTweensOf(progressRef.current);
    gsap.killTweensOf(textRef.current);
    gsap.killTweensOf(bgRef.current);

    // Progress bar animation
    gsap.fromTo(progressRef.current,
      { width: "0%" },
      {
        width: "100%",
        duration: SLIDE_DURATION,
        ease: "none",
        onComplete: nextSlide
      }
    );

    // Text transition
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Background transition
    gsap.fromTo(bgRef.current,
      { scale: 1.05, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
    );
  }, [activeIndex]);

  const activeItem = carouselData[activeIndex];

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#1a1a1a] text-white overflow-hidden font-sans">

      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${activeItem.bgImage})` }}
      />

      {/* Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent w-full md:w-3/4" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent h-full" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end pb-24 md:pb-32 px-10  mx-auto">

        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 w-full">

          {/* Left Text Content */}
          <div ref={textRef} className="flex-1 w-full max-w-xl">
            <h3 className="text-[4rem] md:text-[6rem] lg:text-[7rem] font-bold leading-none  uppercase origin-bottom-left"
            >
              {activeItem.title}
            </h3>
            <p className="text-xl md:text-2xl font-bold mb-4">
              {activeItem.subtitle}
            </p>
            <p className="text-sm md:text-base text-gray-300 max-w-lg leading-relaxed ">
              {activeItem.description}
            </p>
          </div>

          {/* Right Carousel Cards (Upcoming Items) */}
          <div className="flex-1 w-full flex gap-4 overflow-x-hidden pt-12 lg:pt-0 pl-0 lg:pl-12">
            {upcomingCards.map((item, idx) => {
              return (
                <div
                  key={`${item.id}-${activeIndex}`} // Force re-render on activeIndex change for clean animation
                  onClick={() => {
                    // Find the original index of this clicked item
                    const originalIndex = carouselData.findIndex(d => d.id === item.id);
                    setActiveIndex(originalIndex);
                  }}
                  className="relative flex-shrink-0 w-44 md:w-56 aspect-[3/4] cursor-pointer group overflow-hidden bg-gray-900"
                >
                  <img
                    src={item.cardImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-xl md:text-2xl leading-tight text-white">{item.title.split(' ')[0]}</h3>
                    <p className="text-xs md:text-sm text-gray-300 mt-1 truncate font-bold">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Navigation & Progress */}
        <div className="absolute bottom-8 right-10 flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="text-white/70 hover:text-white transition-colors p-2 flex items-center justify-center cursor-pointer relative z-50"
              aria-label="Previous Slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="text-white/70 hover:text-white transition-colors p-2 flex items-center justify-center cursor-pointer relative z-50"
              aria-label="Next Slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div className="w-48 md:w-80 h-[2px] bg-white/20 relative overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 bottom-0 bg-white w-0"
            />
          </div>

          <span className="font-bold text-lg md:text-xl ml-2 uppercase tracking-wide">Board of Directors</span>
        </div>

      </div>
    </div>
  );
};

export default WorkCarousel;
