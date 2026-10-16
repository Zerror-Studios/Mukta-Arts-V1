"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import Image from "next/image";
import useScrollReveal from "@/hooks/useScrollReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(Draggable);
}

const W2 = "/img/final/WW/W2/";

// Campaign portraits interleaved with film stills
const carouselItems = [
    "WHISTLING WOODS CAMPAIGN 09.04.jpg",
    "110.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_1.jpg",
    "1L0.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_2.jpg",
    "220.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_3.jpg",
    "30.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_4.jpg",
    "330.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_5.jpg",
    "440.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_6.jpg",
    "50.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_7.jpg",
    "55..tiff0.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_8.jpg",
    "6L0.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_9.jpg",
    "7L0.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_10.jpg",
    "90.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_11.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_12.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_13.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_14.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_15.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_16.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_17.jpg",
    "WHISTLING WOODS CAMPAIGN 09.04_18.jpg",
].map((file) => ({ src: encodeURI(W2 + file) }));

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
            duration: carouselItems.length * 7, // Smooth slow scrolling, same speed regardless of item count
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