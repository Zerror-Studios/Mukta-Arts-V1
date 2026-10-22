"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { holdReveals, releaseReveals } from '@/lib/revealGate';

// "The Ecosystem" dropdown (menu index 3) starts expanded
const DEFAULT_OPEN_DROPDOWN = 3;

const Header = () => {
  const containerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuTextRef = useRef(null);
  const magneticAreaRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const bgOverlayRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(DEFAULT_OPEN_DROPDOWN);
  const tl = useRef();
  const router = useRouter();
  const pathname = usePathname();
  const isTransitioningRef = useRef(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const createTimeline = contextSafe(() => {
    if (tl.current) tl.current.kill();
    tl.current = gsap.timeline({ paused: true });

    // autoAlpha: while the menu is closed the overlay is also visibility:hidden, so the browser
    // never works on its full-screen backdrop blur during normal scrolling
    tl.current.to(bgOverlayRef.current, {
      autoAlpha: 1,
      pointerEvents: "auto",
      duration: 0.8,
      ease: "power2.inOut"
    }, 0)
      .to(menuOverlayRef.current, {
        x: '0%',
        duration: 1,
        ease: "expo.inOut"
      }, 0)
      .to('.menu-line', {
        width: '100%',
        duration: 0.8,
        stagger: 0.05,
        ease: "expo.inOut"
      }, "-=0.6")
      .to('.menu-item-text', {
        y: '0%',
        duration: 0.8,
        stagger: 0.05,
        ease: "expo.out"
      }, "-=0.7")
      // Dropdown sub-items (The Ecosystem is open by default) follow the main items
      .to('.menu-subitem-text', {
        y: '0%',
        duration: 0.8,
        stagger: 0.05,
        ease: "expo.out"
      }, "-=0.6");
  });

  useGSAP(() => {
    createTimeline();
  }, { scope: containerRef });

  useEffect(() => {
    if (isMenuOpen) {
      tl.current.play();
    } else {
      tl.current.reverse();
      // Reset dropdown to its default when menu is closed
      setTimeout(() => setOpenDropdown(DEFAULT_OPEN_DROPDOWN), 800);
    }
  }, [isMenuOpen]);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (isTransitioningRef.current) return;

    // If clicking the current page, just close the menu
    if (href === pathname || href === pathname + '/') {
      setIsMenuOpen(false);
      return;
    }

    isTransitioningRef.current = true;
    // The next page's entrance waits until this panel sweeps away
    holdReveals();

    // Fade out menu contents (including dropdown sub-items)
    gsap.to('.menu-item-text, .menu-line, .menu-subitem-text', { opacity: 0, duration: 0.4, ease: 'power2.inOut', stagger: 0.02 });
    gsap.to(bgOverlayRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' });

    // Expand menu to cover screen
    gsap.to(menuOverlayRef.current, {
      width: '100vw',
      duration: 1,
      ease: 'expo.inOut',
      onComplete: () => {
        router.push(href);
      }
    });
  };

  useEffect(() => {
    // If the pathname changed and we are in the middle of a transition, slide it out
    if (isTransitioningRef.current) {
      // Start the new page's entrance as the panel is half way out
      gsap.delayedCall(0.7, releaseReveals);
      gsap.to(menuOverlayRef.current, {
        x: '-100%',
        duration: 1,
        ease: 'expo.inOut',
        delay: 0.2, // brief delay to allow new page to render
        onComplete: () => {
          setIsMenuOpen(false);
          isTransitioningRef.current = false;

          // Reset styles to CSS defaults
          gsap.set(bgOverlayRef.current, { clearProps: 'all' });
          gsap.set(menuOverlayRef.current, { clearProps: 'all' });
          gsap.set('.menu-item-text, .menu-line, .menu-subitem-text', { clearProps: 'all' });

          // Rebuild the menu timeline to prevent GSAP overwrite issues
          createTimeline();
        }
      });
    }
  }, [pathname]);

  const handleMouseMove = contextSafe((e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = magneticAreaRef.current.getBoundingClientRect();

    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    gsap.to(menuButtonRef.current, {
      x: x * 0.4,
      y: y * 0.4,
      duration: 0.6,
      ease: "power2.out"
    });

    gsap.to(menuTextRef.current, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to([menuButtonRef.current, menuTextRef.current], {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.4)"
    });
  });

  return (
    <header ref={containerRef} className="fixed top-0 left-0 w-full z-50 p-6 md:p-8 flex justify-between items-center pointer-events-none z-99999">
      <div className={`${pathname === '/' ? 'pointer-events-none' : 'pointer-events-auto'} relative z-[60]`}>
        {pathname !== '/' ? (
          // Own key so React remounts it: the home dock logo carries inline opacity/visibility from HeadphonesModel.
          // Visible here; the footer's 3D logo swaps with it when it sets off down into the footer.
          <Link key="page-logo" id="header-dock-logo" href="/" aria-label="Mukta Arts home" className="block">
            <img src="/img/logo/logo-4k.png" alt="Mukta Arts" className="h-11 md:h-14 w-auto object-contain" draggable={false} />
          </Link>
        ) : (
          // Home only: the 3D logo docks here once it reaches the top left (HeadphonesModel drives the opacity)
          <Link
            key="dock-logo"
            id="header-dock-logo"
            href="/"
            aria-label="Mukta Arts home"
            className="block opacity-0 invisible pointer-events-none"
          >
            <img src="/img/logo/logo-4k.png" alt="Mukta Arts" className="h-11 md:h-14 w-auto object-contain" draggable={false} />
          </Link>
        )}
      </div>

      {/* Background Blur Overlay */}
      <div
        ref={bgOverlayRef}
        className="fixed inset-0 w-screen h-screen bg-black/70 opacity-0 invisible pointer-events-none z-[40]"
        style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Main Menu Button */}
      <div
        ref={magneticAreaRef}
        className="pointer-events-auto relative p-0 cursor-pointer z-[60] transition-opacity duration-300"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <button
          ref={menuButtonRef}
          className={`relative flex items-center justify-center gap-3 px-7 py-1 overflow-hidden group transition-colors duration-300 ${isMenuOpen ? 'bg-white text-[#1B123D]' : 'bg-[#111] text-white hover:bg-[#222]'}`}
        >
          <div className={`absolute inset-0 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? 'bg-[#111]' : 'bg-[#1B123D]'}`}></div>
          <span
            ref={menuTextRef}
            className={`relative z-10 transition-colors duration-500 delay-100 block min-w-[3rem] text-center ${isMenuOpen ? 'group-hover:text-white' : ''}`}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      {/* Side Menu Overlay */}
      <div
        ref={menuOverlayRef}
        className="fixed top-0 right-0 w-full md:w-[50vw] h-[100svh] bg-[#1B123D] translate-x-full pointer-events-auto flex flex-col justify-center px-8 md:px-20 z-50 shadow-2xl"
      >

        <div className="flex flex-col w-full relative mt-[20vh] mb-auto  gap-2">
          <div className="w-0 h-[1px] bg-white/80 menu-line"></div>
          {[
            { name: "Home", url: '/' },
            {
              name: "About", url: "/about"

            },
            { name: "Subhash Ghai", url: "/subhash-ghai" },
            {
              name: "The Ecosystem",
              dropdown: [
                { name: "Mukta A2 Cinemas", url: "/mukta-a2-cinemas" },
                { name: "SGM Studios", url: "/sgm-studios" },
                { name: "Mukta Arts Productions", url: "/our-films" },
                { name: "Whistling Woods International ", url: "/whistling-woods" },
              ]
            },
            { name: "Submit Script", url: "/submit-script" }
          ].map((item, index) => (
            <React.Fragment key={index}>
              {item.dropdown ? (
                <div className="py-2 md:py-1 block overflow-hidden">
                  {/* Own mask so the heading's slide-up isn't visible over the open dropdown */}
                  <div className="overflow-hidden">
                    <div
                      className="menu-item-text translate-y-full text-white cursor-pointer flex justify-between items-center group"
                      onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    >
                      <h4 className="inline-block font-light! transform origin-left transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-skew-x-12 group-hover:translate-x-4">
                        {item.name}
                      </h4>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transform transition-transform duration-500 mr-2 md:mr-8 ${openDropdown === index ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                  <div
                    className={`flex flex-col gap-1 ml-6 md:ml-8 overflow-hidden transition-all duration-500 ease-in-out ${openDropdown === index ? 'max-h-80 opacity-100 mt-4 mb-2' : 'max-h-0 opacity-0 mt-0 mb-0'}`}
                  >
                    {item.dropdown.map((subItem, subIndex) => (
                      <div key={subIndex} className="overflow-hidden">
                        <a
                          href={subItem.url}
                          onClick={(e) => handleLinkClick(e, subItem.url)}
                          className="block w-fit group menu-subitem-text translate-y-full"
                        >
                          <span className="relative inline-block text-white/70 group-hover:text-white transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-skew-x-12 group-hover:translate-x-5 text-lg md:text-xl font-light transform origin-left">
                            <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                            {subItem.name}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <a href={item.url} onClick={(e) => handleLinkClick(e, item.url)} className="py-2 md:py-1 block overflow-hidden group">
                  <div className="menu-item-text translate-y-full text-white">
                    <h4 className="inline-block font-light! transform origin-left transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-skew-x-12 group-hover:translate-x-4">
                      {item.name}
                    </h4>
                  </div>
                </a>
              )}
              <div className="w-0 h-[1px] bg-white/80 menu-line"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;