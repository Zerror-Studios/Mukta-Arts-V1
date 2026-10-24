"use client";

import React, { useRef } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

// The 7 schools, then the IIM MBA and the short courses (as on the home page).
// Each row gets its own text color, all dark enough to read on the off-white background.
const schoolsData = [
  {
    id: "01",
    color: "#C2410C",
    name: "School of Filmmaking",
    programs: [
      { name: "BFA (Filmmaking)", duration: "3 Years" },
      { name: "Diploma (Screenwriting)", duration: "1 Year" },
      { name: "MFA (Filmmaking)", duration: "2 Years" },
    ],
  },
  {
    id: "02",
    color: "#2B6AAB",
    name: "School of Media & Communication",
    programs: [
      { name: "BBA (Media & Communication)", duration: "3 Years" },
      { name: "MBA (Media & Entertainment)", duration: "2 Years" },
    ],
  },
  {
    id: "03",
    color: "#7E22CE",
    name: "Actors’ Studio",
    programs: [
      { name: "BFA (Acting)", duration: "3 Years" },
      { name: "MA (Acting)", duration: "2 Years" },
    ],
  },
  {
    id: "04",
    color: "#047857",
    name: "School of Music",
    programs: [{ name: "BFA (Music Production & Composition)", duration: "3 Years" }],
  },
  {
    id: "05",
    color: "#BE123C",
    name: "School of Design",
    programs: [{ name: "B.Des. (Visual Communication Design)", duration: "4 Years" }],
  },
  {
    id: "06",
    color: "#0E7490",
    name: "School of Animation & Game Design",
    programs: [
      { name: "B.Des. (Animation)", duration: "4 Years" },
      { name: "B.Des. (Game Design)", duration: "4 Years" },
    ],
  },
  {
    id: "07",
    color: "#A16207",
    name: "School of Fashion & Costume Design",
    programs: [{ name: "B.Des. (Fashion Design)", duration: "4 Years" }],
  },
  {
    id: "08",
    color: "#1B123D",
    name: "WWI – IIM Mumbai",
    programs: [{ name: "MBA in Creative Industries", duration: "2 Years" }],
  },
  {
    id: "09",
    color: "#4D7C0F",
    name: "Short Course Unit",
    programs: [{ name: "Short-term programmes across specialised areas including filmmaking, production design and other creative disciplines.", duration: "" }],
    
  },
];

export default function WWSchools() {
  const sectionRef = useRef(null);

  // Heading word by word, the intro line by line, then each school rises in as it enters
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="bg-[#FAFAFA] text-black py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10 overflow-hidden">
      {/* Heading */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-16 mb-16 md:mb-24">
        <h2 data-reveal="words" className="tracking-tight max-w-4xl">
          Academic Schools &amp; Programmes
        </h2>
        <p data-reveal="lines" className="text-[#555] text-base! md:text-lg! leading-relaxed! max-w-md lg:pb-3">
          7 specialised schools under one roof, spanning filmmaking, acting, animation, design, fashion, media and music.
        </p>
      </div>

      {/* One row per school: number, name, programmes */}
      <div className="border-b border-black/10">
        {schoolsData.map((school) => (
          <div
            key={school.id}
            data-reveal="rise"
            style={{ color: school.color }}
            className="grid grid-cols-12 gap-x-4 gap-y-5 md:gap-x-8 border-t border-black/10 py-8 md:py-10 lg:py-12"
          >
            <span className="h2 col-span-3 md:col-span-2 font-['SwitzerL'] text-[3rem] md:text-[4.5rem] leading-[0.9] tracking-tighter tabular-nums">
              {school.id}
            </span>

            <h3 className="h4 col-span-9 md:col-span-10 lg:col-span-5 tracking-tight text-balance">
              {school.name}
            </h3>

            <div className="col-span-12 md:col-start-3 md:col-span-10 lg:col-start-auto lg:col-span-5 lg:pt-2">
              {school.description ? (
                <p className="text-[#555] text-base! md:text-lg! leading-relaxed!">{school.description}</p>
              ) : (
                <ul>
                  {school.programs.map((program) => (
                    <li
                      key={program.name}
                      className="flex items-baseline justify-between gap-6 py-3 border-b border-black/10 last:border-b-0 first:pt-0"
                    >
                      <span className="text-base md:text-lg">{program.name}</span>
                      <span className="shrink-0 text-sm md:text-base text-[#555] tabular-nums">{program.duration}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


// --------------------------- Without COLOR ------------------------

// "use client";

// import React, { useRef } from "react";
// import useScrollReveal from "@/hooks/useScrollReveal";

// // The 7 schools, then the IIM MBA and the short courses (as on the home page)
// const schoolsData = [
//   {
//     id: "01",
//     name: "School of Filmmaking",
//     programs: [
//       { name: "BFA (Filmmaking)", duration: "3 Years" },
//       { name: "Diploma (Screenwriting)", duration: "1 Year" },
//       { name: "MFA (Filmmaking)", duration: "2 Years" },
//     ],
//   },
//   {
//     id: "02",
//     name: "School of Media & Communication",
//     programs: [
//       { name: "BBA (Media & Communication)", duration: "3 Years" },
//       { name: "MBA (Media & Entertainment)", duration: "2 Years" },
//     ],
//   },
//   {
//     id: "03",
//     name: "Actors’ Studio",
//     programs: [
//       { name: "BFA (Acting)", duration: "3 Years" },
//       { name: "MA (Acting)", duration: "2 Years" },
//     ],
//   },
//   {
//     id: "04",
//     name: "School of Music",
//     programs: [{ name: "BFA (Music Production & Composition)", duration: "3 Years" }],
//   },
//   {
//     id: "05",
//     name: "School of Design",
//     programs: [{ name: "B.Des. (Visual Communication Design)", duration: "4 Years" }],
//   },
//   {
//     id: "06",
//     name: "School of Animation & Game Design",
//     programs: [
//       { name: "B.Des. (Animation)", duration: "4 Years" },
//       { name: "B.Des. (Game Design)", duration: "4 Years" },
//     ],
//   },
//   {
//     id: "07",
//     name: "School of Fashion & Costume Design",
//     programs: [{ name: "B.Des. (Fashion Design)", duration: "4 Years" }],
//   },
//   {
//     id: "08",
//     name: "WWI – IIM Mumbai",
//     programs: [{ name: "MBA in Creative Industries", duration: "2 Years" }],
//   },
//   {
//     id: "09",
//     name: "Short Course Unit",
//     description:
//       "Short-term programmes across specialised areas including filmmaking, production design and other creative disciplines.",
//   },
// ];

// export default function WWSchools() {
//   const sectionRef = useRef(null);

//   // Heading word by word, the intro line by line, then each school rises in as it enters
//   useScrollReveal(sectionRef);

//   return (
//     <section ref={sectionRef} className="bg-[#FAFAFA] text-black py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10 overflow-hidden">
//       {/* Heading */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-16 mb-16 md:mb-24">
//         <h2 data-reveal="words" className="tracking-tight max-w-4xl">
//           Academic Schools &amp; Programmes
//         </h2>
//         <p data-reveal="lines" className="text-[#555] text-base! md:text-lg! leading-relaxed! max-w-md lg:pb-3">
//           7 specialised schools under one roof, spanning filmmaking, acting, animation, design, fashion, media and music.
//         </p>
//       </div>

//       {/* One row per school: number, name, programmes */}
//       <div className="border-b border-black/10">
//         {schoolsData.map((school) => (
//           <div
//             key={school.id}
//             data-reveal="rise"
//             className="grid grid-cols-12 gap-x-4 gap-y-5 md:gap-x-8 border-t border-black/10 py-8 md:py-10 lg:py-12"
//           >
//             <h2 className="col-span-3 md:col-span-2 font-['SwitzerL'] text-[3rem] md:text-[4.5rem] leading-[0.9] tracking-tighter text-black tabular-nums">
//               {school.id}
//             </h2>

//             <h4 className="col-span-9 md:col-span-10 lg:col-span-5 tracking-tight text-balance">
//               {school.name}
//             </h4>

//             <div className="col-span-12 md:col-start-3 md:col-span-10 lg:col-start-auto lg:col-span-5 lg:pt-2">
//               {school.description ? (
//                 <p className="text-[#555] text-base! md:text-lg! leading-relaxed!">{school.description}</p>
//               ) : (
//                 <ul>
//                   {school.programs.map((program) => (
//                     <li
//                       key={program.name}
//                       className="flex items-baseline justify-between gap-6 py-3 border-b border-black/10 last:border-b-0 first:pt-0"
//                     >
//                       <span className="text-base md:text-lg text-black">{program.name}</span>
//                       <span className="shrink-0 text-sm md:text-base text-[#555] tabular-nums">{program.duration}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
