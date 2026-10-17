"use client";

import React, { useRef } from 'react';
import HeadphonesCanvas from './HeadphonesModel';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { whenRevealsReleased } from '@/lib/revealGate';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import { modelIntro, MODEL_OFFSCREEN_Y, whenModelReady, setIntroDone } from '@/lib/homeIntro';

// Seconds the intro waits for the 3D model before it plays without it
const MODEL_WAIT = 2.2;
// When the text starts fading in: once the model has landed and its spin is winding down
const TEXT_AFTER_MODEL = 1.5;

// The model rises from below the fold to the centre, spinning a fast full turn that slows
// into its idle rotation (same direction, so the hand-off has no visible change of speed)
function spinIn(tl, at) {
  tl.fromTo(
    modelIntro,
    { y: MODEL_OFFSCREEN_Y, scale: 0.85, tilt: 0.3 },
    { y: 0, scale: 1, tilt: 0, duration: 1.7, ease: 'power4.out' },
    at
  );
  tl.fromTo(modelIntro, { spin: -Math.PI * 2 }, { spin: 0, duration: 2.2, ease: 'power4.out' }, at);
}

// The title and tagline fade in together, then the button
function fadeIn(tl, text, cta, at) {
  tl.to(text, { autoAlpha: 1, duration: 1, ease: 'power1.out' }, at);
  tl.to(cta, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, at + 0.45);
}

const Hero = () => {
  const heroRef = useRef(null);

  // Home intro: the model rises from below and spins into the centre, then the wordmark and tagline
  // fade in, then the button. It starts once the model is ready, so no loading work runs while it
  // plays, and the page cannot scroll until it has finished.
  useGSAP(
    () => {
      const hero = heroRef.current;
      const title = hero.querySelector('[data-hero="title"]');
      const tagline = hero.querySelector('[data-hero="tagline"]');
      const cta = hero.querySelector('[data-hero="cta"]');
      const parts = [title, tagline, cta];

      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, reduced: MOTION_REDUCED }, (ctx) => {
        // [data-entrance] keeps them hidden (globals.css) until this takes over
        parts.forEach((el) => el.setAttribute('data-entrance-ready', ''));
        if (ctx.conditions.reduced) {
          Object.assign(modelIntro, { y: 0, spin: 0, scale: 1, tilt: 0 });
          return;
        }

        gsap.set(parts, { autoAlpha: 0 });
        Object.assign(modelIntro, { y: MODEL_OFFSCREEN_Y, spin: 0, scale: 1, tilt: 0 });
        lockScroll();
        setIntroDone(false);

        let cancelled = false;
        let started = false;
        let waitTimer = null;
        const cancels = [];

        const release = () => {
          // Back to the site-wide setting (LenisScroll)
          gsap.ticker.lagSmoothing(0);
          unlockScroll();
          setIntroDone(true);
        };

        const fontsReady = document.fonts?.ready ?? Promise.resolve();
        fontsReady.then(() => {
          if (cancelled) return;
          let tl;

          const start = (withModel) => {
            if (started || cancelled) return;
            started = true;
            clearTimeout(waitTimer);
            ctx.add(() => {
              tl = gsap.timeline({ paused: true, onComplete: release });
              if (withModel) {
                spinIn(tl, 0);
                fadeIn(tl, [title, tagline], cta, TEXT_AFTER_MODEL);
              } else {
                // Too slow to wait for: the text goes ahead, and the model rises in whenever it arrives
                fadeIn(tl, [title, tagline], cta, 0);
                cancels.push(whenModelReady(() => !cancelled && ctx.add(() => spinIn(gsap.timeline(), 0))));
              }
            });
            // Waits for the menu panel when arriving from another page
            cancels.push(
              whenRevealsReleased(() => {
                if (cancelled) return;
                // A slow frame now slows the intro down for a moment instead of making it jump
                gsap.ticker.lagSmoothing(250, 33);
                tl.play();
              })
            );
          };

          cancels.push(whenModelReady(() => start(true)));
          waitTimer = setTimeout(() => start(false), MODEL_WAIT * 1000);
        });

        return () => {
          cancelled = true;
          clearTimeout(waitTimer);
          cancels.forEach((cancel) => cancel());
          release();
        };
      });
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative w-full h-[100svh]  bg-white px-5 py-20  sm:px-10 sm:py-10 text-black overflow-hidden flex flex-col items-center justify-between">

      {/* Huge Background Text */}
      <div className="  w-full  text-center flex justify-start   items-start z-0 select-none pointer-events-none">
        <h1 data-hero="title" data-entrance className=" text-[4rem] md:text-[180px] lg:text-[240px]  font-bold leading-none whitespace-nowrap text-black flex items-start">
          <span>Mukta Arts</span>
          <span className="font-['SwitzerSB'] text-[2rem] leading-[2.2rem] min-[651px]:text-[3rem] min-[651px]:leading-[3.2rem] font-normal mb-auto">
            LTD
          </span>
        </h1>

      </div>

      {/* 3D Headphones Model */}
      <HeadphonesCanvas />

      {/* Bottom Left Content */}
      <div className=" z-20  w-full md:w-[34vw] mr-auto ">
        <h3 data-hero="tagline" data-entrance className="mb-6 text-balance text-[1.6rem] md:text-[2.1rem] leading-[1.15] tracking-tight font-['SwitzerM'] font-normal max-w-[30ch]">
          Telling stories across screens, classrooms and theatres.
        </h3>
        <div data-hero="cta" data-entrance className="w-fit">
          <Link href={'/about'}>
            <button className="bg-[black] hover:bg-[black] text-white px-5 py-2.5 text-xs md:text-sm tracking-wide font-medium  flex items-center gap-3 transition-colors cursor-pointer group">
              About Us
              <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
      </div>

    </section>
  );
};

export default Hero;
