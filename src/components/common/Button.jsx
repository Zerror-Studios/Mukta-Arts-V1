"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { MdOutlineArrowOutward } from "react-icons/md";
import { MOTION_REDUCED } from "@/lib/motion";

// The arrows' slide on hover (with reduced motion they swap at once)
const ARROW_MOTION = "transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none";

// The header's Menu button, for every other call to action: it leans towards the cursor
// (the label a little less, like Menu), with an arrow after the label that swaps for a fresh one
// on hover.
// Black on light sections; `onDark` makes it white with black text for dark sections.
// `href` makes it a link (`external` opens it in a new tab), `as="span"` a purely visual one.
// `className` goes on the magnetic area (spacing, `w-full`), `innerClassName` on the button itself.
const Button = ({
  href,
  external = false,
  as,
  onDark = false,
  className = "",
  innerClassName = "",
  type = "button",
  children,
  ...rest
}) => {
  const areaRef = useRef(null);
  const buttonRef = useRef(null);
  const textRef = useRef(null);

  // Wide buttons (the full width submit) would travel far at 0.4, so the pull stays header sized
  const clamp = gsap.utils.clamp(-24, 24);

  const handlePointerMove = (e) => {
    if (e.pointerType !== "mouse" || rest.disabled) return;
    if (window.matchMedia(MOTION_REDUCED).matches) return;

    const { left, top, width, height } = areaRef.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);

    gsap.to(buttonRef.current, { x: clamp(x * 0.4), y: clamp(y * 0.4), duration: 0.6, ease: "power2.out" });
    gsap.to(textRef.current, { x: clamp(x * 0.2), y: clamp(y * 0.2), duration: 0.6, ease: "power2.out" });
  };

  const handlePointerLeave = () => {
    gsap.to([buttonRef.current, textRef.current], { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
  };

  const colors = onDark
    ? "bg-white text-black focus-visible:outline-white"
    : "bg-[#111] text-white focus-visible:outline-[#111]";

  // group/btn, not group: some buttons sit inside hover groups of their own (cards, rows)
  const buttonClass = `group/btn relative flex-1 inline-flex items-center justify-center px-7 py-1 overflow-hidden ${colors} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${innerClassName}`;

  const content = (
    <span ref={textRef} className="relative inline-flex items-center justify-center text-center">
      <span className="inline-flex items-center justify-center gap-2">{children}</span>
      {/* Always shown. On hover it flies off to the top right and a second one rises in from the
          bottom left to take its place; a disabled button keeps the first one still. */}
      <span aria-hidden="true" className="relative inline-flex ml-1.5 overflow-hidden">
        <MdOutlineArrowOutward
          className={`shrink-0 group-hover/btn:translate-x-full group-hover/btn:-translate-y-full group-focus-visible/btn:translate-x-full group-focus-visible/btn:-translate-y-full group-disabled/btn:translate-0 ${ARROW_MOTION}`}
        />
        <MdOutlineArrowOutward
          className={`absolute inset-0 shrink-0 -translate-x-full translate-y-full group-hover/btn:translate-0 group-focus-visible/btn:translate-0 group-disabled/btn:-translate-x-full group-disabled/btn:translate-y-full ${ARROW_MOTION}`}
        />
      </span>
    </span>
  );

  let element;
  if (href && external) {
    element = (
      <a ref={buttonRef} href={href} target="_blank" rel="noopener noreferrer" className={buttonClass} {...rest}>
        {content}
      </a>
    );
  } else if (href) {
    element = (
      <Link ref={buttonRef} href={href} className={buttonClass} {...rest}>
        {content}
      </Link>
    );
  } else if (as === "span") {
    element = (
      <span ref={buttonRef} className={buttonClass} {...rest}>
        {content}
      </span>
    );
  } else {
    element = (
      <button ref={buttonRef} type={type} className={buttonClass} {...rest}>
        {content}
      </button>
    );
  }

  return (
    <div
      ref={areaRef}
      className={`relative inline-flex ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {element}
    </div>
  );
};

export default Button;
