"use client";

import React, { useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import useAfterIntro from "@/hooks/useAfterIntro";
import useInView from "@/hooks/useInView";
import useGpuWarmup from "@/hooks/useGpuWarmup";

gsap.registerPlugin(ScrollTrigger);

function FilmReel({ running, loadImages }) {
    const marqueeRef = useRef();
    const tweenRef = useRef(null);

    useGSAP(() => {
        if (marqueeRef.current) {
            // Infinite horizontal scrolling from left to right (or right to left)
            tweenRef.current = gsap.to(marqueeRef.current, {
                x: "-50%", // Move half the width
                duration: 25,
                repeat: -1,
                ease: "none",
            });
        }
    });

    // Only runs while the section is near the screen
    useEffect(() => {
        tweenRef.current?.paused(!running);
    }, [running]);

    // Section 9 of the home page content doc: five frames, one figure each, on the client's own photos
    // (the behind-the-scenes stills, Whistling Woods and Topiwala; strip/ holds 800px copies of the big files)
    const content = [
        { value: "45+", label: "Years of Legacy", image: "/img/final/home/home2/SG_0067.webp" },
        { value: "50+", label: "Films Produced", image: "/img/final/home/home2/SG_0054.webp" },
        { value: "35", label: "Blockbusters", image: "/img/final/home/home2/SG_0044.webp" },
        { value: "4500+", label: "Alumni", image: "/img/final/home/strip/WWI_0R2A9902.webp" },
        { value: "37", label: " Mukta A2 Cinemas", image: "/img/final/home/strip/TOPIWALA_MA2_28.webp" },
    ];

    // Duplicate multiple times for a seamless scroll effect
    const loopContent = [...content, ...content, ...content, ...content, ...content, ...content];

    return (
        <div className="absolute max-sm:bottom-0 sm:-bottom-40 left-1/2 -translate-x-1/2 w-[120vw] z-[100] transform -rotate-[3deg] pointer-events-none">
            <div className="bg-[#111] py-6 relative flex shadow-2xl overflow-hidden">
                {/* Top holes */}
                <div
                    className="absolute top-2 left-0 w-full h-3 z-10"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(to right, #ffffff 0, #ffffff 16px, transparent 16px, transparent 32px)'
                    }}
                ></div>

                {/* Scrolling content */}
                <div className="flex w-max gap-2 px-2" ref={marqueeRef}>
                    {loopContent.map((item, i) => (
                        <div
                            key={i}
                            className="relative flex flex-col items-center justify-center min-w-[200px] md:min-w-[280px] h-[120px] md:h-[160px] px-4 md:px-8 rounded-sm overflow-hidden"
                        >
                            {/* Background Image for each frame */}
                            <div
                                className="absolute inset-0 bg-cover bg-center z-0 opacity-100"
                                style={loadImages ? { backgroundImage: `url("${encodeURI(item.image)}")` } : undefined}
                            ></div>
                            {/* Overlay for text readability */}
                            <div className="absolute inset-0 bg-black/50 z-0"></div>

                            {/* Text Content */}
                            <div className="relative z-10 text-center">
                                <h3 className="text-[#f97316] text-3xl! md:text-5xl! leading-none! font-bold tracking-tight whitespace-nowrap drop-shadow-md">{item.value}</h3>
                                <p className="mt-1 md:mt-2 text-white text-xs md:text-base font-semibold uppercase tracking-wide whitespace-nowrap drop-shadow-md">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom holes */}
                <div
                    className="absolute bottom-2 left-0 w-full h-3 z-10 opacity-40 "
                    style={{
                        backgroundImage: 'repeating-linear-gradient(to right, #ffffff 0, #ffffff 16px, transparent 16px, transparent 32px)'
                    }}
                ></div>
            </div>
        </div>
    );
}

function CameraModel({ url }) {
    const { scene } = useGLTF(url);
    // The camera is a heavy model: get it onto the GPU before the section is reached
    useGpuWarmup();
    const modelRef = useRef();

    useGSAP(() => {
        if (modelRef.current) {


            // Floating animation up and down
            gsap.to(modelRef.current.position, {
                y: 0.15,
                duration: 2.5,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
        }
    });

    useFrame((state) => {
        if (modelRef.current) {
            // Calculate target rotation based on horizontal mouse movement (left/right)
            const targetZ = (state.pointer.x * Math.PI) / 20;
            const targetY = (state.pointer.x * Math.PI) / 20;

            // Smoothly interpolate current rotation towards target on Z and Y axis
            // modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, -targetZ, 0.05);
            modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetY, 0.05);
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            position={[0, 0, 0]}
            scale={1} // You might need to adjust this scale based on your exact model size
        />
    );
}

function AnimatedCameraGroup() {
    const groupRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".old-camera-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // Initial state
        gsap.set(groupRef.current.position, { x: 0, y: -2, z: 0 });
        gsap.set(groupRef.current.rotation, { x: 0, y: -2, z: 0 });

        tl.to(groupRef.current.position, { x: 2, y: -2.5, z: 0, duration: 1 }, 0)
            .to(groupRef.current.rotation, { y: -Math.PI / 1.3 - Math.PI * 2, duration: 1 }, 0)
            .to({}, { duration: 3 }); // pad to 4.0 total duration
    });

    return (
        <group ref={groupRef} scale={0.05}>
            <CameraModel url="/model/camera.glb" />
            <ContactShadows
                position={[0, -1, 0]}
                opacity={0.6}
                scale={10}
                blur={2.5}
                far={4}
                color="#000000"
            />
        </group>
    );
}

// One slide per role: the role sits under the name, the subheading and copy at the bottom,
// and each has its own background (the working still, the portrait, Whistling Woods)
const SLIDES = [
    {
        role: "THE FILMMAKER",
        subheading: "A Legacy in Indian Cinema",
        text: "From his directorial debut Kalicharan in 1976 to films including Karma, Ram Lakhan, Saudagar, Pardes and Taal, Subhash Ghai has shaped mainstream Hindi cinema through stories, music and characters that have endured across generations. He has written and directed 19 motion pictures, with 14 achieving blockbuster status.",
        image: "/img/final/SG/S2/SG_0067_3_11zon.webp",
    },
    {
        role: "THE VISIONARY",
        subheading: "Building the Business of Cinema",
        text: "Ghai went beyond filmmaking to help shape the infrastructure of the Indian film industry. He founded Mukta Films in 1978, took Mukta Arts public, and pioneered initiatives in film financing, insurance, exhibition and digital projection. Mukta Arts became the first Indian film studio to undertake an IPO and list on the major stock exchanges, and pioneered film insurance with Taal as the first Indian film to be insured.",
        image: "/img/final/home/home2/WhatsApp2.webp",
    },
    {
        role: "THE EDUCATOR",
        subheading: "Shaping the Next Generation",
        text: "In 2006, Ghai founded Whistling Woods International, transforming his experience in cinema into a platform for film and media education. His vision was to create a world-class institution that could equip the next generation of filmmakers, technicians and storytellers for a global industry.",
        image: "/img/final/home/home2/WhatsApp1.webp",
    },
];

// Points on the 4.0-long scroll timeline: when each slide comes in and goes out,
// and when the background crossfades to the next slide's image (between the two)
const SLIDE_IN = [0.8, 2.0, 3.2];
const SLIDE_OUT = [1.5, 2.7];
const BG_SWAP = [1.6, 2.8];
const BG_OPACITY = 0.35;

export default function OldCamera() {
    const containerRef = useRef(null);
    const roleRefs = useRef([]);
    const bodyRefs = useRef([]);
    const bgRefs = useRef([]);
    const buttonRef = useRef(null);
    // Far below the fold: load the camera only once the home intro has played,
    // and only draw it while the section is near the screen
    const sceneOn = useAfterIntro();
    const inView = useInView(containerRef);
    // Its background images are only fetched once the section is a screen or so away
    const bgReady = useInView(containerRef, "100%", true);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                // markers: true,
                scrub: 1,
            }
        });

        const roles = roleRefs.current;
        const bodies = bodyRefs.current;
        const bgs = bgRefs.current;

        gsap.set([...roles, ...bodies], { opacity: 0, y: 30 });
        gsap.set(buttonRef.current, { opacity: 0, y: 20 });
        gsap.set(bgs, { opacity: 0 });
        gsap.set(bgs[0], { scale: 0.95 });

        // Reveal the first background image & button after 3D camera rotation finishes
        tl.to(bgs[0], { opacity: BG_OPACITY, scale: 1, duration: 0.4 }, 0.8);
        tl.to(buttonRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.8);

        // Each slide's image takes over as its role and copy come in
        BG_SWAP.forEach((at, i) => {
            tl.to(bgs[i], { opacity: 0, duration: 0.4 }, at)
                .to(bgs[i + 1], { opacity: BG_OPACITY, duration: 0.4 }, at);
        });

        // The role under the name and the copy at the bottom change together
        SLIDES.forEach((_, i) => {
            const els = [roles[i], bodies[i]];
            tl.to(els, { opacity: 1, y: 0, duration: 0.2 }, SLIDE_IN[i]);
            if (SLIDE_OUT[i] !== undefined) {
                tl.to(els, { opacity: 0, y: -20, duration: 0.2 }, SLIDE_OUT[i]);
            }
        });

        tl.to({}, { duration: 0.6 }); // pad to 4.0
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="old-camera-container w-full h-[400vh] relative z-30">


            <section className="sticky top-0 w-full h-[100vh] bg-white max-sm:overflow-hidden flex items-center justify-center">

                {/* Background Images - reveal after 3D camera rotation, one per slide */}
                {/* <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                    {SLIDES.map((slide, i) => (
                        <div
                            key={slide.image}
                            ref={(el) => { bgRefs.current[i] = el; }}
                            className="absolute inset-0 bg-cover bg-center md:bg-[center_right_10%] opacity-0 filter contrast-110"
                            style={bgReady ? { backgroundImage: `url('${slide.image}')` } : undefined}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30" />
                </div> */}

                {/* Title, with the role that changes on scroll right below it */}
                <div className="absolute top-[15%] left-[5%] md:left-[4%] z-40 text-black pointer-events-none">
                    <h2 className="tracking-tighter leading-none uppercase">
                        Subhash Ghai
                    </h2>
                    <h5 className=" uppercase">Founder and Chairman</h5>
                    {/* The roles share one grid cell, so they swap in place */}
                    <div className="grid ">
                        {SLIDES.map((slide, i) => (
                            <h4
                                key={slide.role}
                                ref={(el) => { roleRefs.current[i] = el; }}
                                className="[grid-area:1/1] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase"
                            >
                                {/* {slide.role} */}
                            </h4>
                        ))}
                    </div>
                </div>

                {/* Subheading, copy and button at the bottom */}
                <div className="absolute bottom-[190px] sm:bottom-16 left-[5%] md:left-[4%] w-[90%] md:max-w-lg z-[80] text-black">
                    {/* Stacked in one grid cell and pinned to its bottom, so the button never moves */}
                    <div className="grid pointer-events-none">
                        {SLIDES.map((slide, i) => (
                            <div
                                key={slide.subheading}
                                ref={(el) => { bodyRefs.current[i] = el; }}
                                className="[grid-area:1/1] self-end"
                            >
                                {/* SUBHEADING */}
                                <h4 className="text-base uppercase sm:text-lg md:text-xl font-medium text-[#1B123D] mb-3 md:mb-4 leading-snug">
                                    {/* {slide.subheading} */} {slide.role}
                                </h4>
                                <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4 md:mb-5">
                                    {slide.text}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Single View More Button placed directly after the text paragraph */}
                    <div ref={buttonRef} className="pt-2 pointer-events-auto w-fit">
                        <Link
                            href="/subhash-ghai"
                            className="inline-flex items-center gap-2 bg-[#1B123D] hover:bg-[#2A1D5C] text-white px-6 py-2.5 text-xs md:text-sm tracking-wider font-semibold rounded-[3px] transition-all duration-300 shadow-md hover:shadow-lg group cursor-pointer"
                        >
                            <span>View More</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>

                {/* 3D Canvas */}
                <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                    {sceneOn && (
                        <Canvas
                            frameloop={inView ? "always" : "never"}
                            camera={{ position: [0, 0, 5], fov: 45 }}
                            className="w-full h-full pointer-events-none"
                            // Full-screen canvas: capped at 1.5x it still looks sharp and draws ~45% fewer pixels than 2x
                            dpr={[1, 1.5]}
                        >
                            <ambientLight intensity={0.4} />
                            <directionalLight position={[5, 10, 5]} intensity={1.2} />
                            {/* Its own boundary for the lighting and model loads: without one the Canvas suspends
                                the whole page while they load, and no tap on it (Elder's dropdowns just above)
                                does anything until they finish */}
                            <Suspense fallback={null}>
                                <Environment preset="studio" />
                                <AnimatedCameraGroup />
                            </Suspense>

                            {/* <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            minPolarAngle={Math.PI / 3}
                            maxPolarAngle={Math.PI / 1.5}
                        /> */}
                        </Canvas>
                    )}
                </div>

                <FilmReel running={inView} loadImages={bgReady} />

            </section>
        </div>
    );
}

