"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div id="footer" className="min-h-screen bg-[#0474BA] text-white flex flex-col font-sans relative overflow-hidden">

      {/* Top Navigation / Stats Bar */}
      <div className="w-full flex flex-wrap justify-between items-center px-4 md:px-8 py-4 text-[10px] md:text-xs font-semibold tracking-wider uppercase opacity-90">
        <span className="flex items-center gap-2"><span className="text-sm">★</span> MUKTA PRODUCTIONS </span>
        <span className="flex items-center gap-2"><span className="text-sm">★</span> WHISTLING WOODS INTERNATIONAL</span>
        <span className="flex items-center gap-2"><span className="text-sm">★</span> MUKTA A2 CINEMAS </span>
        <span className="flex items-center gap-2"><span className="text-sm">★</span> MUKTA VN FILMS </span>
        <span className="flex items-center gap-2"><span className="text-sm">★</span> SGM STUDIOS </span>
        <span className="flex items-center gap-2"><span className="text-sm">★</span> SUBHASH GHAI </span>
      </div>

      {/* Main Content (a div: the page already has its <main>, and this sits inside <footer>) */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 md:px-20 lg:px-32 py-12 lg:py-20 ">

        {/* HEADPHONE or Fallback Image */}
        {isHome ? (
          <div id="footer-headphone" className="w-full bg- lg:w-2/3 flex justify-center lg:justify-center mb-12 lg:mb-0 min-h-[300px]">
          </div>
        ) : (
          <div className="w-full lg:w-2/3 flex justify-center lg:justify-center mb-12 lg:mb-0 min-h-[300px] items-center">
            <img
              src="/img/sg/HeadLogo.png"
              alt="Mukta Arts Logo"
              className="object-contain opacity-100"
            />
          </div>
        )}

        {/* Right Column - Text & Call to Action */}
        <div className="w-full lg:w-1/3 flex flex-col items-start max-w-xl relative z-20">
          <h4 className="text-4xl md:text-5xl lg:text-[54px] font-medium leading-tight mb-6">
            Have a story<br />
            worth telling?<br />
            We want to<br />
            hear it.
          </h4>

          <h3 className=" tracking-tighter  capitalize mb-6">
            Have a script or story you believe in? Share it with
            Mukta Arts. We’re always looking for compelling stories
            and fresh voices with the potential to become powerful
            cinematic experiences.
          </h3>

          <Link href={'/submit-script'} >
          
          <button className="bg-white cursor-pointer text-[#22385b] px-6 py-2.5 text-sm font-semibold  shadow-md hover:bg-gray-100 transition-colors mb-16">
            Submit Script
          </button>
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            {/* Instagram */}
            <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-gray-300 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white hover:text-gray-300 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            {/* YouTube */}
            <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-gray-300 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
            {/* Facebook */}
            <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-gray-300 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Huge Background Bottom Text */}
      <div className=" -bottom-8 md:-bottom-16 left-4 md:left-12 z-0 overflow-visible pointer-events-none px-10">
        {/* div + span, not h1 + h4: a heading inside a heading is invalid HTML and broke hydration.
            The span keeps the h4 look from fonts.css (SwitzerSB, 3rem/3.2rem; 2rem/2.2rem at 650px and below). */}
        <div className="text-[15vw] md:text-[180px] lg:text-[240px] font-bold leading-none  whitespace-nowrap text-white flex items-start">
          Mukta Arts
          <span className="font-['SwitzerSB'] text-[2rem] leading-[2.2rem] min-[651px]:text-[3rem] min-[651px]:leading-[3.2rem] font-normal mb-auto">
            LTD
          </span>
        </div>
      </div>
    </div>
  );
}