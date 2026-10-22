// 'use client'


// import React, { useRef, useEffect, Suspense } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";


// gsap.registerPlugin(ScrollTrigger);


// function FilmReelSS({ running, loadImages }) {
//     const marqueeRef = useRef();
//     const tweenRef = useRef(null);

//     useGSAP(() => {
//         if (marqueeRef.current) {
//             // Infinite horizontal scrolling from left to right (or right to left)
//             tweenRef.current = gsap.to(marqueeRef.current, {
//                 x: "-50%", // Move half the width
//                 duration: 25,
//                 repeat: -1,
//                 ease: "none",
//             });
//         }
//     });

//     // Only runs while the section is near the screen
//     useEffect(() => {
//         tweenRef.current?.paused(!running);
//     }, [running]);

//     // Section 9 of the home page content doc: five frames, one figure each, on the client's own photos
//     // (the behind-the-scenes stills, Whistling Woods and Topiwala; strip/ holds 800px copies of the big files)
//     const content = [
//         { value: "45+", label: "Years of Legacy", image: "/img/final/home/home2/SG_0067.webp" },
//         { value: "50+", label: "Films Produced", image: "/img/final/home/home2/SG_0054.webp" },
//         { value: "35", label: "Blockbusters", image: "/img/final/home/home2/SG_0044.webp" },
//         { value: "4500+", label: "Alumni", image: "/img/final/home/strip/WWI_0R2A9902.webp" },
//         { value: "37", label: " Mukta A2 Cinemas", image: "/img/final/home/strip/TOPIWALA_MA2_28.webp" },
//     ];

//     // Duplicate multiple times for a seamless scroll effect
//     const loopContent = [...content, ...content, ...content, ...content, ...content, ...content];

//     return (
//         <div className=" max-sm:bottom-0 sm:-bottom-40 left-1/2 -translate-x-1/2 w-[120vw] z-[100] transform -rotate-[3deg] pointer-events-none">
//             <div className="bg-[#111] py-6 relative flex shadow-2xl overflow-hidden">
//                 {/* Top holes */}
//                 <div
//                     className="absolute top-2 left-0 w-full h-3 z-10"
//                     style={{
//                         backgroundImage: 'repeating-linear-gradient(to right, #ffffff 0, #ffffff 16px, transparent 16px, transparent 32px)'
//                     }}
//                 ></div>

//                 {/* Scrolling content */}
//                 <div className="flex w-max gap-2 px-2" ref={marqueeRef}>
//                     {loopContent.map((item, i) => (
//                         <div
//                             key={i}
//                             className="relative flex flex-col items-center justify-center min-w-[200px] md:min-w-[280px] h-[120px] md:h-[160px] px-4 md:px-8 rounded-sm overflow-hidden"
//                         >
//                             {/* Background Image for each frame */}
//                             <div
//                                 className="absolute inset-0 bg-cover bg-center z-0 opacity-100"
//                                 style={loadImages ? { backgroundImage: `url("${encodeURI(item.image)}")` } : undefined}
//                             ></div>
//                             {/* Overlay for text readability */}
//                             <div className="absolute inset-0 bg-black/50 z-0"></div>

//                             {/* Text Content */}
//                             <div className="relative z-10 text-center">
//                                 <h3 className="text-[#f97316] text-3xl! md:text-5xl! leading-none! font-bold tracking-tight whitespace-nowrap drop-shadow-md">{item.value}</h3>
//                                 <p className="mt-1 md:mt-2 text-white text-xs md:text-base font-semibold uppercase tracking-wide whitespace-nowrap drop-shadow-md">{item.label}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Bottom holes */}
//                 <div
//                     className="absolute bottom-2 left-0 w-full h-3 z-10 opacity-40 "
//                     style={{
//                         backgroundImage: 'repeating-linear-gradient(to right, #ffffff 0, #ffffff 16px, transparent 16px, transparent 32px)'
//                     }}
//                 ></div>
//             </div>
//         </div>
//     );
// }



// const FilmReel = () => {
//   return (
//      <FilmReelSS   />
//   )
// }

// export default FilmReel
