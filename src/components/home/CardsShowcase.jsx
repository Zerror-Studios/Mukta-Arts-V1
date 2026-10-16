
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

let arr = [
  {
    year: "2025",
    clr: "#1B123D",
    img: "/img/home/trophy_nb1.jpg",
    title: "Digital Studio M&E Award - Media & Entertainment Education Award for Cinema",
    desc: "Whistling Woods International in 2025"
  },
  {
    year: "2025",
    clr: "#1F1056",
    img: "/img/home/trophy_nb2.jpg",
    title: "Big Cine Awards - Fastest Growing Cinema Chain of the Year",
    desc: "Mukta A2 Cinemas in 2025"
  },
  {
    year: "2024",
    clr: "#1B123D",
    img: "/img/home/trophy_nb3.jpg",
    title: "Navbharat Education Excellence Award - Filmmaking Institute of the Year",
    desc: "Whistling Woods International in 2024"
  },
  {
    year: "2019",
    clr: "#1F1056",
    img: "/img/home/trophy_nb4.jpg",
    title: "FICCI Higher Education Excellence Award - Excellence in Creative & Performing Arts",
    desc: "Whistling Woods International in 2019"
  },
  {
    year: "2019",
    clr: "#1B123D",
    img: "/img/home/trophy_nb1.jpg",
    title: "Big Cine Awards - Best Single-Screen Theatre of the Year",
    desc: "New Excelsior Mukta A2 Cinemas in 2019"
  },
  {
    year: "2017",
    clr: "#1F1056",
    img: "/img/home/trophy_nb2.jpg",
    title: "Screen Award - Lifetime Achievement",
    desc: "Subhash Ghai in 2017"
  },
  {
    year: "2015",
    clr: "#1B123D",
    img: "/img/home/trophy_nb3.jpg",
    title: "IIFA Award - Outstanding Contribution to Indian Cinema",
    desc: "Subhash Ghai in 2015"
  },
  {
    year: "2006",
    clr: "#1F1056",
    img: "/img/home/trophy_nb4.jpg",
    title: "National Film Award - Best Film on Other Social Issues",
    desc: "Iqbal produced by Subhash Ghai / Mukta Arts in 2006"
  },
  {
    year: "1998",
    clr: "#1B123D",
    img: "/img/home/trophy_nb1.jpg",
    title: "Filmfare Award - Best Screenplay",
    desc: "Subhash Ghai for Pardes in 1998"
  },
  {
    year: "1992",
    clr: "#1F1056",
    img: "/img/home/trophy_nb2.jpg",
    title: "Filmfare Award - Best Director",
    desc: "Subhash Ghai for Saudagar in 1992"
  }
];

export default function CardsShowcase() {
  // Initialize with the most recent card (arr[0]) at the front of the visual stack
  const [cardOrder, setCardOrder] = useState(arr.map((_, i) => arr.length - 1 - i));
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Create smooth interpolators for x and y
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  const handleCardClick = (clickedIndex) => {
    const currentVisualIndex = cardOrder.indexOf(clickedIndex);
    const frontVisualIndex = cardOrder.length - 1;

    if (currentVisualIndex === frontVisualIndex) return; // Already at the front

    const newCardOrder = [...cardOrder];
    // Swap the clicked card with the front card
    const temp = newCardOrder[currentVisualIndex];
    newCardOrder[currentVisualIndex] = newCardOrder[frontVisualIndex];
    newCardOrder[frontVisualIndex] = temp;

    setCardOrder(newCardOrder);
  };

  const handleNext = () => {
    setCardOrder((prev) => {
      const newOrder = [...prev];
      const frontCard = newOrder.pop();
      newOrder.unshift(frontCard);
      return newOrder;
    });
  };

  const handlePrev = () => {
    setCardOrder((prev) => {
      const newOrder = [...prev];
      const backCard = newOrder.shift();
      newOrder.push(backCard);
      return newOrder;
    });
  };

  const centerOffset = (arr.length - 1) / 2;

  return (
    <div className="w-full h-[100vh] relative z-[10] mt-[10vh] md:mt-[30vh] overflow-hidden">
      {/* Title */}
      <div className="w-full absolute top-[-5%] md:top-[-10%] left-2 px-4 md:px-10 pt-10 md:pt-20 z-50 pointer-events-none">
        <h2 className="text-[12vw] md:text-[8vw] font-semibold tracking-tighter text-black">Honours.</h2>
      </div>

      {/* 3D Container */}
      <div
        className="absolute inset-0 flex flex-col items-center max-sm:scale-[0.6] justify-center pt-[10vh] md:pt-[15vh] translate-y-20 md:translate-y-30"
        style={{ perspective: "1500px" }}
      >
        <div
          className="relative w-full max-w-6xl h-[70vh] md:h-[65vh] flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {arr.map((item, originalIndex) => {
            const visualIndex = cardOrder.indexOf(originalIndex);

            return (
              <div
                key={originalIndex}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => handleCardClick(originalIndex)}
                className="group absolute w-[75vw] md:w-[40vw] max-w-[90%] h-[90%] md:h-[80%] transition-all duration-500 ease-out cursor-pointer"
                style={{
                  zIndex: visualIndex,
                  // Center the 10 cards using centerOffset (4.5) with proportionate spacing for 3D depth and fan
                  transform: `translateX(${(visualIndex - centerOffset) * 9}%) translateY(-80px) translateZ(${visualIndex * 28}px) rotateY(15deg)`,
                  transformOrigin: "center center",
                }}
              >
                <div
                  className="w-full h-full shadow-[-15px_15px_40px_rgba(0,0,0,0.2)] flex border-l border-white/10 transition-transform duration-300 group-hover:-translate-y-6"
                  style={{ backgroundColor: item.clr }}
                >
                  {/* Content */}
                  <div className="w-full h-full flex flex-col md:flex-row items-center pt-4 md:pt-16">
                    {/* Image Area */}
                    <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center p-4 md:p-8">
                      <div className="relative w-full h-full md:h-[80%]">
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-contain drop-shadow-2xl mix-blend-screen"
                        />
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-[80%] md:w-px h-px md:h-[50%] bg-white/50 my-2 md:my-0"></div>

                    {/* Text Area */}
                    <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center md:justify-start p-6 md:p-12 md:pl-10 text-white text-center md:text-left">
                      {item.year && (
                        <div className="mb-2 md:mb-3">
                          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs md:text-sm font-semibold tracking-wider">
                            {item.year}
                          </span>
                        </div>
                      )}
                      <div className="mt-1 mb-2 md:mb-4">
                        <p className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">{item.title}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm md:text-base text-white/90">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full h-[10vh] bg-white"></div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-[2%] md:left-[5%] top-1/2 -translate-y-1/2 z-[9999] w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/20 text-black flex items-center justify-center hover:bg-[#1B123D] hover:text-white transition-colors cursor-pointer bg-white/50 backdrop-blur-md shadow-lg"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-[2%] md:right-[5%] top-1/2 -translate-y-1/2 z-[9999] w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/20 text-black flex items-center justify-center hover:bg-[#1B123D] hover:text-white transition-colors cursor-pointer bg-white/50 backdrop-blur-md shadow-lg"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[99999] transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        style={{ willChange: 'transform' }}
      >
        <div className={`w-fit h-fit px-5 py-2 bg-black/20 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center  transition-transform duration-300 ease-out ${isHovering ? 'scale-100' : 'scale-50'} -translate-x-1/2 translate-y-4 `}>
          <span className="text-xs font-semibold tracking-widest uppercase">Click</span>
        </div>
      </div>
    </div>
  );
}

