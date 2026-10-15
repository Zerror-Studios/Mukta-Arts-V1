"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import Image from "next/image";
import useScrollReveal from "@/hooks/useScrollReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(Draggable);
}

const carouselItems = [
    { src: "/img/last/1.jpg" },
    { src: "/img/last/3.jpg" },
    { src: "/img/last/5.png" },
    { src: "/img/last/6.jpg" },
    { src: "/img/last/7.jpg" },
];

const itemSize = "w-[260px] h-[195px] sm:w-[320px] sm:h-[240px] md:w-[420px] md:h-[300px]";

const WWlast = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const sectionRef = useRef(null);

    // Heading reveal as the section enters
    useScrollReveal(sectionRef);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // We animate from 0 to -50% because the track contains two identical sets of items.
        let tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });

        tl.to(track, {
            xPercent: -50,
            duration: 35, // Smooth slow scrolling
        });

        let dragStartProgress = 0;
        let dragStartX = 0;

        const dragInstance = Draggable.create(document.createElement("div"), {
            trigger: containerRef.current,
            type: "x",
            onPress: function () {
                tl.pause();
                dragStartProgress = tl.progress();
                dragStartX = this.x;
            },
            onDrag: function () {
                const trackWidth = track.scrollWidth;
                const movementWidth = trackWidth / 2;

                const deltaX = this.x - dragStartX;
                const progressDelta = -(deltaX / movementWidth);

                let newProgress = dragStartProgress + progressDelta;

                // Wrap progress between 0 and 1
                newProgress = newProgress % 1;
                if (newProgress < 0) newProgress += 1;

                tl.progress(newProgress);
            },
            onRelease: function () {
                tl.play();
            },
        });

        return () => {
            tl.kill();
            dragInstance[0]?.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full pt-20 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-[#FAFAFA]">
            <div className=" px-4 md:px-8 mb-12 md:mb-24 ">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-5 md:gap-8 lg:gap-16 ">
                    <h4 data-reveal="words" className="text-5xl capitalize md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-black max-w-3xl leading-[1.05]">
                        whistling woods <br /> gallery
                    </h4>

                </div>
            </div>

            <div
                ref={containerRef}
                className="w-full cursor-grab active:cursor-grabbing overflow-hidden"
            >
                <div
                    ref={trackRef}
                    className="flex items-center  w-max px-4 md:px-8"
                >
                    {/* Double the array for seamless infinite looping */}
                    {[...carouselItems, ...carouselItems].map((item, index) => (
                        <div
                            key={index}
                            className={`relative flex-shrink-0 ${itemSize}`}
                        >
                            <Image
                                src={item.src}
                                alt={`Hero image ${index}`}
                                fill
                                sizes="(max-width: 768px) 80vw, 33vw"
                                className="object-cover"
                                quality={90}
                                priority={index < 4}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WWlast; 