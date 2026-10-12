"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function FilmReel() {
    const marqueeRef = useRef();

    useGSAP(() => {
        if (marqueeRef.current) {
            // Infinite horizontal scrolling from left to right (or right to left)
            gsap.to(marqueeRef.current, {
                x: "-50%", // Move half the width
                duration: 25,
                repeat: -1,
                ease: "none",
            });
        }
    });

    const content = [
        { title: "45+", subtitle: "Years of Legacy", image: "/img/home/1.jpg" },
        { title: "50+", subtitle: "Films Produced", image: "/img/home/2.jpg" },
        { title: "35", subtitle: "Blockbusters", image: "/img/home/3.jpg" },
        { title: "4000+", subtitle: "Alumni", image: "/img/home/4.jpg" },
        { title: "57+", subtitle: "Cinema Theatres", image: "/img/home/5.jpg" },
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
                                style={{ backgroundImage: `url(${item.image})` }}
                            ></div>
                            {/* Overlay for text readability */}
                            <div className="absolute inset-0 bg-black/50 z-0"></div>

                            {/* Text Content */}
                            <div className="relative z-10 text-center">
                                <h3 className="text-[#f97316] text-2xl md:text-4xl! font-bold mb-1 drop-shadow-md">{item.title}</h3>
                                <p className="text-white text-[10px] md:text-sm opacity-90 drop-shadow-md font-semibold">{item.subtitle}</p>
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

export default function OldCamera() {
    const containerRef = useRef(null);
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    const text3Ref = useRef(null);
    const buttonRef = useRef(null);
    const bgImageRef = useRef(null);

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

        gsap.set([text1Ref.current, text2Ref.current, text3Ref.current], { opacity: 0, y: 30 });
        if (buttonRef.current) {
            gsap.set(buttonRef.current, { opacity: 0, y: 20 });
        }
        if (bgImageRef.current) {
            gsap.set(bgImageRef.current, { opacity: 0, scale: 0.95 });
        }

        // Reveal background image & button after 3D camera rotation finishes
        if (bgImageRef.current) {
            tl.to(bgImageRef.current, { opacity: 0.35, scale: 1, duration: 0.4 }, 0.8);
        }
        if (buttonRef.current) {
            tl.to(buttonRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.8);
        }

        tl.to(text1Ref.current, { opacity: 1, y: 0, duration: 0.2 }, 0.8)
            .to(text1Ref.current, { opacity: 0, y: -20, duration: 0.2 }, 1.5)
            .to(text2Ref.current, { opacity: 1, y: 0, duration: 0.2 }, 2.0)
            .to(text2Ref.current, { opacity: 0, y: -20, duration: 0.2 }, 2.7)
            .to(text3Ref.current, { opacity: 1, y: 0, duration: 0.2 }, 3.2)
            .to({}, { duration: 0.6 }); // pad to 4.0
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="old-camera-container w-full h-[400vh] relative z-30">


            <section className="sticky top-0 w-full h-[100vh] bg-white max-sm:overflow-hidden flex items-center justify-center">

                {/* Background Image of Subhash Ghai - reveals after 3D camera rotation */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                    <div
                        ref={bgImageRef}
                        className="absolute inset-0 bg-cover bg-center md:bg-[center_right_10%] opacity-0 filter contrast-110"
                        style={{ backgroundImage: "url('/img/last/1.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30" />
                </div>

                {/* Title */}
                <h2 className="absolute top-[10%] tracking-tighter left-[5%] md:left-[4%] z-40 text-black leading-none pointer-events-none">
                    About us.
                </h2>

                {/* Text Content */}
                <div className="absolute top-[40%] md:top-[45%] -translate-y-1/2 left-[5%] md:left-[4%] w-[90%] md:max-w-lg z-[70] text-black pointer-events-none">

                    {/* Paragraph Slides Wrapper */}
                    <div className="relative min-h-[310px] sm:min-h-[270px] md:min-h-[230px]">
                        {/* Text Content 1 */}
                        <div ref={text1Ref} className="absolute top-0 left-0 w-full pointer-events-none">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase mb-1 md:mb-2">
                                THE FILMMAKER
                            </h3>
                            <h5 className="text-base sm:text-lg md:text-xl font-medium text-[#0474BA] mb-3 md:mb-4 leading-snug">
                                A Legacy in Indian Cinema
                            </h5>
                            <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4 md:mb-5">
                                From his directorial debut Kalicharan in 1976 to films including Karma, Ram Lakhan, Saudagar, Pardes and Taal, Subhash Ghai has shaped mainstream Hindi cinema through stories, music and characters that have endured across generations. He has written and directed 19 motion pictures, with 14 achieving hit or blockbuster status.
                            </p>
                        </div>

                        {/* Text Content 2 */}
                        <div ref={text2Ref} className="absolute top-0 left-0 w-full pointer-events-none">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase mb-1 md:mb-2">
                                THE VISIONARY
                            </h3>
                            <h5 className="text-base sm:text-lg md:text-xl font-medium text-[#0474BA] mb-3 md:mb-4 leading-snug">
                                Building the Business of Cinema
                            </h5>
                            <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4 md:mb-5">
                                Ghai went beyond filmmaking to help shape the infrastructure of the Indian film industry. He founded Mukta Films in 1978, took Mukta Arts public, and pioneered initiatives in film financing, insurance, exhibition and digital projection. Mukta Arts became the first Indian film studio to undertake an IPO and list on the major stock exchanges, and pioneered film insurance with Taal as the first Indian film to be insured.
                            </p>
                        </div>

                        {/* Text Content 3 */}
                        <div ref={text3Ref} className="absolute top-0 left-0 w-full pointer-events-none">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase mb-1 md:mb-2">
                                THE EDUCATOR
                            </h3>
                            <h5 className="text-base sm:text-lg md:text-xl font-medium text-[#0474BA] mb-3 md:mb-4 leading-snug">
                                Shaping the Next Generation
                            </h5>
                            <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4 md:mb-5">
                                In 2006, Ghai founded Whistling Woods International, transforming his experience in cinema into a platform for film and media education. His vision was to create a world-class institution that could equip the next generation of filmmakers, technicians and storytellers for a global industry.
                            </p>
                        </div>
                    </div>


                </div>
                {/* Single View More Button placed directly after the text paragraph */}
                <div
                    ref={buttonRef}
                    className="pt-2 pointer-events-auto absolute  bottom-10 left-15 z-[80]"
                >
                    <Link
                        href="/subhash-ghai"
                        className="inline-flex items-center gap-2 bg-[#0474BA] hover:bg-[#0666a1] text-white px-6 py-2.5 text-xs md:text-sm tracking-wider font-semibold rounded-[3px] transition-all duration-300 shadow-md hover:shadow-lg group cursor-pointer"
                    >
                        <span>View More</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {/* 3D Canvas */}
                <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                    <Canvas

                        camera={{ position: [0, 0, 5], fov: 45 }}
                        className="w-full h-full pointer-events-none"
                        dpr={[1, 2]} // Support for high-res screens
                    >
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[5, 10, 5]} intensity={1.2} />
                        <Environment preset="studio" />

                        <AnimatedCameraGroup />

                        {/* <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 1.5}
                    /> */}
                    </Canvas>
                </div>

                <FilmReel />

            </section>
        </div>
    );
}

// Preload the model to prevent popping in
useGLTF.preload("/model/camera.glb");
