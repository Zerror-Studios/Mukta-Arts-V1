"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import useScrollReveal from "@/hooks/useScrollReveal";

// Stand-ins until the client's own SGM visuals arrive: the six Unsplash stills this reel used,
// now served locally, cropped to the 16:9 frame and compressed (1800x1013 WebP)
const reelItems = [1, 2, 3, 4, 5, 6].map((n) => ({
    src: `/img/final/SGM/showreel/sgm-showreel-${String(n).padStart(2, "0")}.webp`,
}));

const pad = (n) => String(n).padStart(2, "0");

const arrowClass =
    "w-12 h-12 rounded-full border border-black/20 text-black flex items-center justify-center transition-colors cursor-pointer hover:bg-[#1B123D] hover:border-[#1B123D] hover:text-white disabled:opacity-30 disabled:pointer-events-none";

// The showreel is the main event of this short page: large frames the visitor moves through
// at their own pace (drag, swipe or arrows), snapping to each, with the next one peeking in.
const SGMShowreel = () => {
    const sectionRef = useRef(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", duration: 32 });
    const [index, setIndex] = useState(0);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);

    useScrollReveal(sectionRef);

    const onSelect = useCallback((api) => {
        setIndex(api.selectedScrollSnap());
        setCanPrev(api.canScrollPrev());
        setCanNext(api.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        // Initial state (first image, no previous) already matches; keep it in sync from here
        emblaApi.on("select", onSelect).on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect).off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section ref={sectionRef} className="relative w-full pt-32 pb-24 md:pb-32 overflow-hidden bg-[#FAFAFA]">
            <div className="px-4 md:px-8 mb-12 md:mb-16">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-16">
                    <h4
                        data-reveal="words"
                        className="text-5xl capitalize md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-black max-w-3xl leading-[1.05]"
                    >
                        sgm studios <br /> showreel
                    </h4>

                    <div data-reveal="rise" className="flex items-center gap-6 md:gap-8">
                        <span className="font-mono text-sm tracking-widest text-[#555] tabular-nums">
                            {pad(index + 1)} / {pad(reelItems.length)}
                        </span>
                        <div className="hidden md:flex items-center gap-3">
                            <button type="button" aria-label="Previous image" className={arrowClass} disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()}>
                                <RiArrowLeftLine size={20} />
                            </button>
                            <button type="button" aria-label="Next image" className={arrowClass} disabled={!canNext} onClick={() => emblaApi?.scrollNext()}>
                                <RiArrowRightLine size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div data-reveal="rise" className="cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex touch-pan-y pl-4 md:pl-8">
                    {reelItems.map((item, i) => (
                        <div
                            key={item.src}
                            className="relative shrink-0 grow-0 basis-[86vw] md:basis-[70vw] mr-4 md:mr-6 last:mr-4 md:last:mr-8 aspect-[16/10] md:aspect-video overflow-hidden bg-neutral-200"
                        >
                            <img
                                src={item.src}
                                alt={`SGM Studios still ${i + 1}`}
                                className="w-full h-full object-cover pointer-events-none select-none"
                                loading={i < 2 ? "eager" : "lazy"}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SGMShowreel;
