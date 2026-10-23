"use client";

import React, { useRef } from 'react';
import HeadphonesCanvas from './HeadphonesModel';
import Button from '@/components/common/Button';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText, EASE, DURATION, STAGGER, RISE, MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { whenRevealsReleased } from '@/lib/revealGate';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import { modelIntro, MODEL_OFFSCREEN_Y, IDLE_SPEED, whenModelReady, setIntroDone } from '@/lib/homeIntro';

// Seconds the intro waits for the 3D model before it plays without it
const MODEL_WAIT = 2.2;
// When the text starts coming in: as the model is landing
const TEXT_AFTER_MODEL = 1.7;
// The rise from the bottom of the screen, and the one full turn the model makes on the way up
const SPIN = 2.4;
const TURN = Math.PI * 2;

// The turn's ease: it sets off quickly (the model is already turning as it comes into view), slows
// as it reaches the centre, and lands facing front still turning at exactly the idle speed. The idle
// rotation takes over from that moment, so the model never stops: the two are one continuous turn.
// A cubic Hermite curve from 0 to 1, leaving at slope START and arriving at slope END.
const SPIN_START = 1.6;
const SPIN_END = (IDLE_SPEED * SPIN) / TURN;
function spinEase(u) {
  const u2 = u * u;
  const u3 = u2 * u;
  return SPIN_START * (u3 - 2 * u2 + u) + (3 * u2 - 2 * u3) + SPIN_END * (u3 - u2);
}

// The model rises from below the fold to the centre of the screen, making one full turn that starts
// and ends facing front, and carries straight on into its own endless rotation
function spinIn(tl, at) {
  modelIntro.idle = 0;
  tl.fromTo(
    modelIntro,
    { y: MODEL_OFFSCREEN_Y, scale: 0.85, tilt: 0.25 },
    { y: 0, scale: 1, tilt: 0, duration: SPIN, ease: 'power3.out' },
    at
  );
  tl.fromTo(modelIntro, { spin: -TURN }, { spin: 0, duration: SPIN, ease: spinEase }, at);
  // The hand-off: the turn above arrives at the idle speed, so the idle rotation picks up from it
  tl.set(modelIntro, { idle: 1 }, at + SPIN);
}

// The wordmark and tagline rise in gently, then the button: the same entrance as the other pages'
// heroes (useEntrance), with half the rise, so it stays quiet next to the 3D logo
const SOFT_RISE = RISE / 2;
function textIn(tl, { title, tagline, cta }, at, splits) {
  const words = SplitText.create(title, { type: 'words' });
  const lines = SplitText.create(tagline, { type: 'lines' });
  splits.push(words, lines);
  gsap.set([title, tagline], { autoAlpha: 1 });

  // Fresh objects for every tween: GSAP writes into the vars it is given, so they can't be shared
  const from = () => ({ autoAlpha: 0, y: SOFT_RISE });
  const to = (stagger) => ({ autoAlpha: 1, y: 0, duration: DURATION, ease: EASE, stagger });
  tl.fromTo(words.words, from(), to(STAGGER), at);
  tl.fromTo(lines.lines, from(), to(STAGGER), at + 0.2);
  tl.fromTo(cta, from(), to(0), at + 0.45);
}

const Hero = () => {
  const heroRef = useRef(null);

  // Home intro: the model rises from below and turns into the centre, then the wordmark and tagline
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
          Object.assign(modelIntro, { y: 0, spin: 0, scale: 1, tilt: 0, idle: 1 });
          return;
        }

        gsap.set(parts, { autoAlpha: 0 });
        // Facing front and still until the intro lets it turn
        Object.assign(modelIntro, { y: MODEL_OFFSCREEN_Y, spin: 0, scale: 1, tilt: 0, idle: 0 });
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
              const splits = [];
              tl = gsap.timeline({
                paused: true,
                onComplete: () => {
                  // Hand the text back to normal layout so it reflows on resize
                  splits.forEach((split) => split.revert());
                  release();
                },
              });
              const text = { title, tagline, cta };
              if (withModel) {
                spinIn(tl, 0);
                textIn(tl, text, TEXT_AFTER_MODEL, splits);
              } else {
                // Too slow to wait for: the text goes ahead, and the model rises in whenever it arrives
                textIn(tl, text, 0, splits);
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
          // A late intro (the model arrived after the text) runs outside the timeline: stop it, and
          // leave the model turning
          gsap.killTweensOf(modelIntro);
          modelIntro.idle = 1;
          release();
        };
      });
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative w-full h-[100svh] overflow-x-hidden  bg-white px-5 py-20  sm:px-10 sm:py-10 md:max-lg:pt-20 text-black overflow-hidden flex flex-col items-center justify-between">

      {/* Huge Background Text */}
      <div className="  w-full  text-center flex justify-start   items-start z-0 select-none pointer-events-none">
        <h1 data-hero="title" data-entrance className=" text-[4rem] md:text-[min(15vw,240px)] lg:text-[min(16.5vw,240px)]  font-bold leading-none whitespace-nowrap text-black flex items-start">
          <span>Mukta Arts</span>
          <span className="font-['SwitzerSB'] text-[2rem] leading-[2.2rem] min-[651px]:text-[3rem] min-[651px]:leading-[3.2rem] font-normal mb-auto">
            LTD
          </span>
        </h1>

      </div>

      {/* 3D Headphones Model */}
      <HeadphonesCanvas />

      {/* Bottom Left Content */}
      <div className=" z-20  w-full md:w-[55vw] lg:w-[34vw] mr-auto ">
        <h3 data-hero="tagline" data-entrance className="mb-6 text-balance text-[1.6rem] md:text-[2.1rem] leading-[1.15] tracking-tight font-['SwitzerM'] font-normal max-w-[30ch]">
         Telling stories across cinema, screens and classrooms.
        </h3>
        <div data-hero="cta" data-entrance className="w-fit">
          <Button href="/about">
            About Us
          </Button>
        </div>
      </div>

    </section>
  );
};

export default Hero;