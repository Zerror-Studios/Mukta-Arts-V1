"use client";

import { useRef } from "react";
import Image from "next/image";
import useScrollReveal from "@/hooks/useScrollReveal";
import useInfiniteDragSlider from "@/hooks/useInfiniteDragSlider";
import useInView from "@/hooks/useInView";

// 2560px copies of the photos in W2/ (up to 7952px and 6MB there), so Next's resizer works from a small file
const W2 = "/img/final/WW/W2/web/";

// Campaign portraits interleaved with film stills
const carouselItems = [
    { file: "WHISTLING WOODS CAMPAIGN 09.04.webp", alt: "Whistling Woods International student in a purple college hoodie on campus" },
    { file: "110.webp", alt: "Student watching a film in a darkened cinema auditorium" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_1.webp", alt: "Smiling Whistling Woods student sitting on the campus steps" },
    { file: "1L0.webp", alt: "Drummer playing a drum kit on a warmly lit stage" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_2.webp", alt: "Whistling Woods students studying together on the campus lawn" },
    { file: "220.webp", alt: "Student reading between bookshelves in the library" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_3.webp", alt: "Students talking around a table in the Whistling Woods library" },
    { file: "30.webp", alt: "Dancer rehearsing alone on a spotlit stage" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_4.webp", alt: "Whistling Woods students working on sketches together in a common room" },
    { file: "330.webp", alt: "Student at work in a dimly lit costume workshop" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_5.webp", alt: "Student reading a script beside production vehicles" },
    { file: "440.webp", alt: "Student drawing on a tablet with a stylus" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_6.webp", alt: "Student sitting on white amphitheatre steps on campus" },
    { file: "50.webp", alt: "Student reading a book on the campus steps at golden hour" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_7.webp", alt: "Whistling Woods student in a college T-shirt and jacket, standing outdoors" },
    { file: "55..tiff0.webp", alt: "Performer alone on a spotlit stage in front of empty theatre seats" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_8.webp", alt: "Student presenting at a whiteboard in a classroom" },
    { file: "6L0.webp", alt: "Student film crew working on set under red light" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_9.webp", alt: "Whistling Woods student with a tablet and backpack on the campus basketball court" },
    { file: "7L0.webp", alt: "Student in a Whistling Woods hoodie looking out over a harbour" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_10.webp", alt: "Students filming in a green screen studio" },
    { file: "90.webp", alt: "Student building a costume piece in a workshop" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_11.webp", alt: "Whistling Woods student standing by the campus lockers" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_12.webp", alt: "Fashion design student among garments on mannequins" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_13.webp", alt: "Music student playing an acoustic guitar in a studio" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_14.webp", alt: "Dance student posing under studio lights in front of a mural" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_15.webp", alt: "Whistling Woods student in front of a comic-style mural" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_16.webp", alt: "Student recording outdoor sound with headphones and a field recorder" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_17.webp", alt: "Student holding a camera on campus at night" },
    { file: "WHISTLING WOODS CAMPAIGN 09.04_18.webp", alt: "Whistling Woods student holding books in the library" },
].map(({ file, alt }) => ({ src: encodeURI(W2 + file), alt }));

// Same widths as before, taller frames (capped by the screen height on short laptops)
const itemSize =
    "w-[260px] h-[320px] sm:w-[320px] sm:h-[400px] md:w-[420px] md:h-[min(520px,65svh)]";

const WWlast = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const sectionRef = useRef(null);

    // Heading reveal as the section enters
    useScrollReveal(sectionRef);

    // Native lazy loading only looks ahead vertically, so tiles sliding in from the clipped
    // right edge started loading as they came into view (and on mobile Safari often never did).
    // Once the section is a screen or so away, every tile is fetched instead.
    const loadImages = useInView(sectionRef, "100%", true);

    // Auto-scrolling strip that glides after a drag and eases back into its own speed
    // (same speed as before: 7 seconds per image, whatever the image count)
    useInfiniteDragSlider(containerRef, trackRef, {
        itemCount: carouselItems.length,
        loopSeconds: carouselItems.length * 7,
    });

    return (
        <section ref={sectionRef} className="relative w-full sm:pt-20 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-[#FAFAFA]">
            <div className=" px-4 md:px-8 mb-12 md:mb-24 ">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-5 md:gap-8 lg:gap-16 ">
                    <h2 data-reveal="words" className="text-5xl capitalize md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-black max-w-3xl leading-[1.05]">
                        whistling woods <br /> gallery
                    </h2>

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
                            // The second set is only there for the loop, so it is hidden from screen readers and has no alt
                            aria-hidden={index >= carouselItems.length || undefined}
                            className={`relative flex-shrink-0 ${itemSize}`}
                        >
                            <Image
                                src={item.src}
                                alt={index < carouselItems.length ? item.alt : ""}
                                fill
                                loading={loadImages ? "eager" : "lazy"}
                                sizes="(max-width: 768px) 80vw, 40vw"
                                className="object-cover"
                                quality={90}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WWlast; 