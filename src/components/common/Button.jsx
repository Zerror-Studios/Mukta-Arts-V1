"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { MdOutlineArrowOutward } from "react-icons/md";
import { MOTION_REDUCED } from "@/lib/motion";

// The header's Menu button, for every other call to action: it leans towards the cursor
// (the label a little less, like Menu) and on hover an arrow slides in after the label.
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
      {/* Takes no room until hover, then opens up and the arrow rises in from the bottom left */}
      <span
        aria-hidden="true"
        className="inline-flex overflow-hidden max-w-0 opacity-0 group-hover/btn:max-w-[1.5em] group-hover/btn:ml-1.5 group-hover/btn:opacity-100 group-focus-visible/btn:max-w-[1.5em] group-focus-visible/btn:ml-1.5 group-focus-visible/btn:opacity-100 group-disabled/btn:max-w-0 group-disabled/btn:ml-0 group-disabled/btn:opacity-0 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
      >
        <MdOutlineArrowOutward className="shrink-0 -translate-x-full translate-y-full group-hover/btn:translate-0 group-focus-visible/btn:translate-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
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
