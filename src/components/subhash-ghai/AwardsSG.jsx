import React from "react";

export default function AwardsSG() {
  return (
    <section className="relative w-full bg-[#f8f9fa] text-black py-24 md:py-36 lg:py-44 px-6 md:px-12 lg:px-20 overflow-hidden font-['SwitzerR']">
      {/* Background Graphic Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
        <img
          src="/img/sg/HeadLogo.png"
          alt=""
          className="w-[500px] h-[500px] md:w-[680px] md:h-[680px] object-contain grayscale"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Subtle Eyebrow */}
        {/* <div className="flex items-center gap-3 mb-8 md:mb-10">
          <span className="w-8 h-[1px] bg-black/25"></span>
          <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-gray-500 font-['SwitzerM']">
            A Guiding Philosophy
          </span>
          <span className="w-8 h-[1px] bg-black/25"></span>
        </div> */}

        {/* Decorative Quote Mark */}
        <div className="w-10 h-10 md:w-12 md:h-12 mb-6 md:mb-8 rounded-full border border-black/10 flex items-center justify-center text-black/40">
          <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* The Quote */}
        <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-medium leading-[1.3] md:leading-[1.22] font-['SwitzerM'] tracking-tight text-black max-w-4xl">
          “Destiny is an exercise in hard work and honesty towards what you want to do.”
        </blockquote>

        {/* Accent Divider */}
        <div className="w-12 h-[2px] bg-black/20 my-8 md:my-10"></div>

        {/* Author Attribution */}
        <div className="flex flex-col items-center">
          {/* Cursive Signature */}
          {/* His own autograph (Autograph_1_11zon.webp with the paper made transparent) */}
          <img
            src="/img/final/SG/S2/Autograph_transparent.webp"
            alt="Subhash Ghai's signature"
            className="w-[150px] md:w-[180px] h-auto mb-3 opacity-90 select-none pointer-events-none"
            draggable={false}
            loading="lazy"
            decoding="async"
          />

          <cite className="not-italic text-sm md:text-base font-semibold tracking-wider uppercase text-black font-['SwitzerSB']">
            Subhash Ghai
          </cite>
          <span className="text-xs md:text-sm tracking-widest uppercase text-gray-500 font-['SwitzerR'] mt-1">
            Founder & Filmmaker, Mukta Arts
          </span>
        </div>
      </div>
    </section>
  );
}
