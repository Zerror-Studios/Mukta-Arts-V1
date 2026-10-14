"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/dist/Draggable";

if (typeof window !== "undefined") {
    gsap.registerPlugin(Draggable);
}

// Placeholder images — swap for SGM Studios stills (e.g. /img/sgm/1.jpg) once available
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`;

const reelItems = [
    { src: unsplash("1639628735078-ed2f038a193e") },
    { src: unsplash("1569766670290-f5581d3bb53f") },
    { src: unsplash("1628494391268-c9935bc384d5") },
    { src: unsplash("1631582053308-40f482e7ace5") },
    { src: unsplash("1611241893603-3c359704e0ee") },
    { src: unsplash("1624961151169-b3df5c0f06ab") },
];

const SGMShowreel = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // Track holds two identical sets, so moving -50% loops seamlessly
        let tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });

        tl.to(track, {
            xPercent: -50,
            duration: 40,
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
                const movementWidth = track.scrollWidth / 2;
                const progressDelta = -((this.x - dragStartX) / movementWidth);

                // Wrap progress between 0 and 1
                let newProgress = (dragStartProgress + progressDelta) % 1;
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
        <section className="relative w-full pt-32 pb-16 overflow-hidden bg-[#FAFAFA]">
            <div className=" px-4 md:px-8 mb-24 ">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16 ">
                    <h4 className="text-5xl capitalize md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-black max-w-3xl leading-[1.05]">
                        sgm studios <br /> showreel
                    </h4>
                    <p className="text-[#555]  text-lg md:text-xl ml-auto max-w-[28rem] leading-relaxed font-medium">
                        Visually distinctive worlds and character-driven narratives, pairing decades of experience in cinema with the creative range of animation.
                    </p>
                </div>
            </div>

            <div
                ref={containerRef}
                className="w-full cursor-grab active:cursor-grabbing overflow-hidden"
            >
                <div ref={trackRef} className="flex items-center w-max">
                    {/* Double the array for seamless infinite looping */}
                    {[...reelItems, ...reelItems].map((item, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 overflow-hidden w-[320px] h-[220px] md:w-[460px] md:h-[300px]"
                        >
                            <img
                                src={item.src}
                                alt={`SGM Studios still ${(index % reelItems.length) + 1}`}
                                className="w-full h-full object-cover pointer-events-none select-none"
                                loading={index < 4 ? "eager" : "lazy"}
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
