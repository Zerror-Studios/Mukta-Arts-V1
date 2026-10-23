"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Button from '@/components/common/Button';
import { siteConfig } from '@/config/site';
// A plain import, not next/dynamic: the lazy wrapper remounted the canvas once the model loaded,
// and R3F's unmount throws away the WebGL context of the canvas it then reuses
import HeadphonesCanvas from '@/components/home/HeadphonesModel';

// The same routes as the header menu; Mukta VN Films has no page of its own yet, so it stays plain text
const FOOTER_LINKS = [
  { label: "MUKTA PRODUCTIONS", href: "/our-films" },
  { label: "WHISTLING WOODS INTERNATIONAL", href: "/whistling-woods" },
  { label: "MUKTA A2 CINEMAS", href: "/mukta-a2-cinemas" },
  // { label: "MUKTA VN FILMS", href: null },
  { label: "SGM STUDIOS", href: "/sgm-studios" },
  { label: "SUBHASH GHAI", href: "/subhash-ghai" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: siteConfig.socials.instagram,
    size: 22,
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: siteConfig.socials.linkedin,
    size: 22,
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </>
    ),
  },
  {
    label: "YouTube",
    href: siteConfig.socials.youtube,
    size: 24,
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </>
    ),
  },
  {
    label: "Facebook",
    href: siteConfig.socials.facebook,
    size: 22,
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>,
  },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div id="footer" className="min-h-screen bg-[#1B123D] text-white flex flex-col font-sans relative overflow-hidden">

      {/* Top Navigation / Stats Bar */}
      {/* <nav aria-label="Footer" className="w-full flex flex-wrap justify-between items-center px-4 md:px-8 py-4 text-[10px] md:text-xs font-semibold tracking-wider uppercase z-999 opacity-90">
        {FOOTER_LINKS.map(({ label, href }) =>
          href ? (

            <div className=' flex justify-center items-center gap-2'>
              <span className="text-sm">★</span>

              <span className="relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-current after:origin-right after:scale-x-0 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:after:origin-left group-hover:after:scale-x-100 group-focus-visible:after:origin-left group-focus-visible:after:scale-x-100">
                {label}
              </span>
            </div>
          ) : (
            <span key={label} className="flex items-center gap-2"><span className="text-sm">★</span> {label}</span>
          )
        )}
      </nav> */}

      {/* Main Content (a div: the page already has its <main>, and this sits inside <footer>).
          Two columns on wide screens on their side (the `wide` variant); phones and tablets, and tablets
          held upright, stack the model over the text. */}
      <div className="flex-1 flex flex-col wide:flex-row items-center justify-center wide:justify-between gap-10 md:gap-14 wide:gap-0 px-6 md:px-20 wide:px-32 py-12 md:py-16 wide:py-2">

        {/* The 3D logo (HeadphonesModel) settles over this spot and can be turned by dragging it;
            touch-pan-y keeps vertical swipes scrolling the page while sideways ones turn the model.
            Stacked, the model is sized by the screen's height, so the spot is too (a little over the model). */}
        <div id="footer-headphone" className="w-full h-[32svh] min-h-[120px] wide:w-2/3 wide:h-[300px] shrink-0 cursor-grab active:cursor-grabbing touch-pan-y select-none">
        </div>
        {/* On the home page the hero's model makes this trip; every other page gets its own, which
            comes down from the header logo. Keyed by page so its scroll trigger starts fresh. */}
        {!isHome && <HeadphonesCanvas key={pathname} footerOnly />}

        {/* Right Column - Text & Call to Action (centred under the model on tablets) */}
        <div className="w-full wide:w-1/3 flex flex-col items-start md:items-center md:text-center wide:items-start wide:text-left max-w-xl relative z-20">
          {/* Sized by the h4 rule in fonts.css, which wins over Tailwind's text sizes */}
          <h4 className="font-medium mb-6 text-balance wide:text-wrap">
            Have a story
            worth telling?
            We want to
            hear it.
          </h4>

          <p className="mb-6 text-pretty">
            Have a script or story you believe in? Share it with
            Mukta Arts. We’re always looking for compelling stories
            and fresh voices with the potential to become powerful
            cinematic experiences.
          </p>

          <Button onDark href="/submit-script" className="mb-10 md:mb-12 wide:mb-16">
            Submit Script
          </Button>

          {/* Social Icons (each padded out to a full size tap target; the negative margin keeps them in place) */}
          <div className="flex items-center gap-6">
            {SOCIALS.map(({ label, href, size, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="-m-3 p-3 text-white hover:text-gray-300 transition-colors">
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Huge Background Bottom Text: as wide as the screen allows on phones and tablets, capped on desktops */}
      <div className="pointer-events-none px-6 md:px-10 pb-3 md:pb-4 lg:pb-0">
        {/* div + span, not h1 + h4: a heading inside a heading is invalid HTML and broke hydration.
            LTD keeps to the same share of the wordmark as on desktops (never under 12px), and takes
            the h4 size from fonts.css (SwitzerSB, 3rem/3.2rem) from 1024px up. */}
        <div className="text-[16vw] md:text-[min(16.5vw,240px)] font-bold leading-none whitespace-nowrap text-white flex items-start">
          Mukta Arts
          <span className="font-['SwitzerSB'] text-[max(0.18em,12px)] leading-none lg:text-[3rem] lg:leading-[3.2rem] font-normal mb-auto">
            LTD
          </span>
        </div>
      </div>
    </div>
  );
}
