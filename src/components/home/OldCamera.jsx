"use client";

import React, { useRef, Suspense } from "react";
import Button from "@/components/common/Button";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import useAfterIntro from "@/hooks/useAfterIntro";
import useInView from "@/hooks/useInView";
import useGpuWarmup from "@/hooks/useGpuWarmup";

gsap.registerPlugin(ScrollTrigger);

function CameraModel({ url, modelRef }) {
    const { scene } = useGLTF(url);
    // The camera is a heavy model: get it onto the GPU before the section is reached
    useGpuWarmup();

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

// The camera group's scale, and where it ends up beside the copy on wide screens
const CAMERA_SCALE = 0.05;
const WIDE_END = { x: 2, y: -2.5, scale: CAMERA_SCALE };
// Narrower than this (phones, tablets upright) there is no room beside the copy, so the camera
// settles into the space between the title and the copy instead
const WIDE_ASPECT = 1.2;
// Share of that space the camera may fill, so it never touches the text
const SLOT_FILL = 0.9;

// Where the camera ends up on a portrait screen: centred in the gap between the title and the
// copy (measured from the page), as large as fits. Its size comes from the model's own bounds.
function slotEnd(group, model, camera, size, titleEl, bodyEl, sectionEl) {
    const section = sectionEl.getBoundingClientRect();
    const top = titleEl.getBoundingClientRect().bottom - section.top;
    const bottom = bodyEl.getBoundingClientRect().top - section.top;
    const gap = Math.max(bottom - top, 0);

    // World units per pixel on the z = 0 plane the camera moves in
    const viewHeight = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const unit = viewHeight / size.height;

    // The model's height and centre at scale 1 (turning about y never changes its height)
    group.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(model);
    const s = group.scale.y;
    const minY = (box.min.y - group.position.y) / s;
    const height = (box.max.y - box.min.y) / s;
    const width = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / s;

    const scale = Math.min((gap * SLOT_FILL * unit) / height, (size.width * SLOT_FILL * unit) / width, CAMERA_SCALE);
    const centreY = (size.height / 2 - (top + gap / 2)) * unit;
    return { x: 0, y: centreY - (minY + height / 2) * scale, scale };
}

function AnimatedCameraGroup({ titleRef, bodyRef, sectionRef }) {
    const groupRef = useRef();
    const modelRef = useRef();
    // The canvas state as it is now, read on every refresh so a resize or rotation lands it in the right place
    const getThree = useThree((state) => state.get);

    useGSAP(() => {
        const group = groupRef.current;
        let end = WIDE_END;
        const measure = () => {
            const { camera, size } = getThree();
            end = size.width / size.height >= WIDE_ASPECT
                ? WIDE_END
                : slotEnd(group, modelRef.current, camera, size, titleRef.current, bodyRef.current, sectionRef.current);
        };

        // Initial state
        gsap.set(group.position, { x: 0, y: -2, z: 0 });
        gsap.set(group.rotation, { x: 0, y: -2, z: 0 });
        measure();

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".old-camera-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true,
                onRefreshInit: measure,
            }
        });

        tl.to(group.position, { x: () => end.x, y: () => end.y, z: 0, duration: 1 }, 0)
            .to(group.scale, { x: () => end.scale, y: () => end.scale, z: () => end.scale, duration: 1 }, 0)
            .to(group.rotation, { y: -Math.PI / 1.3 - Math.PI * 2, duration: 1 }, 0)
            .to({}, { duration: 3 }); // pad to 4.0 total duration
    });

    return (
        <group ref={groupRef} scale={CAMERA_SCALE}>
            <CameraModel url="/model/camera.glb" modelRef={modelRef} />
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
        role: "The Filmmaker",
        subheading: "A Legacy in Indian Cinema",
        text: "From his directorial debut Kalicharan in 1976 to films including Karma, Ram Lakhan, Saudagar, Pardes and Taal, Subhash Ghai has shaped mainstream Hindi cinema through stories, music and characters that have endured across generations. He has written and directed 19 motion pictures, with 14 achieving blockbuster status.",
        image: "/img/final/SG/S2/SG_0067_3_11zon.webp",
    },
    {
        role: "The Visionary",
        subheading: "Building the Business of Cinema",
        text: "Ghai went beyond filmmaking to help shape the infrastructure of the Indian film industry. He founded Mukta Films in 1978, took Mukta Arts public, and pioneered initiatives in film financing, insurance, exhibition and digital projection. Mukta Arts became the first Indian film studio to undertake an IPO and list on the major stock exchanges, and pioneered film insurance with Taal as the first Indian film to be insured.",
        image: "/img/final/home/home2/WhatsApp2.webp",
    },
    {
        role: "The Educator",
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
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const bodyRef = useRef(null);
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
        <div ref={containerRef} className="old-camera-container w-full h-[400vh] relative z-30  ">


            <section ref={sectionRef} className="sticky top-0 w-full h-[100vh] bg-white max-sm:overflow-hidden flex items-center justify-center ">

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
                <div ref={titleRef} className="absolute top-[15%] left-[5%] md:left-[4%] z-40 text-black pointer-events-none">
                    <h2 className="tracking-tighter leading-none ">
                        Subhash Ghai
                    </h2>
                    <h5 className=" ">Founder and Chairman</h5>
                    {/* The roles share one grid cell, so they swap in place */}
                    <div className="grid ">
                        {SLIDES.map((slide, i) => (
                            <h4
                                key={slide.role}
                                ref={(el) => { roleRefs.current[i] = el; }}
                                className="[grid-area:1/1] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight "
                            >
                                {/* {slide.role} */}
                            </h4>
                        ))}
                    </div>
                </div>

                {/* Subheading, copy and button at the bottom */}
                <div ref={bodyRef} className="absolute bottom-16 left-[5%] md:left-[4%] w-[90%] md:max-w-lg z-[80] text-black">
                    {/* Stacked in one grid cell and pinned to its bottom, so the button never moves */}
                    <div className="grid pointer-events-none">
                        {SLIDES.map((slide, i) => (
                            <div
                                key={slide.subheading}
                                ref={(el) => { bodyRefs.current[i] = el; }}
                                className="[grid-area:1/1] self-end"
                            >
                                {/* SUBHEADING */}
                                <h4 className="text-base  sm:text-lg md:text-xl font-medium text-[#1B123D] mb-3 md:mb-4 leading-snug">
                                    {/* {slide.subheading} */} {slide.role}
                                </h4>
                                <p className="text-sm md:text-base max-md:text-[14px]! max-md:leading-[1.5]! opacity-90 leading-relaxed mb-4 md:mb-5">
                                    {slide.text}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Single View More Button placed directly after the text paragraph */}
                    <div ref={buttonRef} className="pt-2 pointer-events-auto w-fit">
                        <Button href="/subhash-ghai">
                            View More
                        </Button>
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
                                <AnimatedCameraGroup titleRef={titleRef} bodyRef={bodyRef} sectionRef={sectionRef} />
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

            </section>
        </div>
    );
}

