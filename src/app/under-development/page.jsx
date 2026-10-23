'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Button from '@/components/common/Button';
import { Construction, Sparkles } from 'lucide-react';

export default function UnderDevelopmentPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
            '.bg-element',
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1.5, stagger: 0.2 }
        )
            .fromTo(
                '.icon-container',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                '-=1'
            )
            .fromTo(
                '.reveal-text',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
                '-=0.6'
            )
            .fromTo(
                '.reveal-button',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                '-=0.4'
            );
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center bg-white text-zinc-900 overflow-hidden selection:bg-zinc-200"
        >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="bg-element absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-zinc-200/50 blur-[100px]" />
                <div className="bg-element absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-zinc-200/50 blur-[100px]" />
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-3xl px-6 py-12 flex flex-col items-center text-center">
                {/* Animated Icon */}
                <div className="icon-container relative mb-8">
                    <div className="absolute inset-0 bg-black/5 blur-xl rounded-full" />
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/5 border border-zinc-200 flex items-center justify-center backdrop-blur-md shadow-lg">
                        <Construction className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-600" strokeWidth={1.5} />
                        {/* <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-zinc-500 animate-pulse" /> */}
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center space-y-6 mb-10">
                    <h1 className="reveal-text text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-500">
                        Under Development
                    </h1>
                    <p className="reveal-text text-lg sm:text-xl text-zinc-600 max-w-xl leading-relaxed">
                        We are crafting something extraordinary behind the scenes.
                        Check back soon for an immersive new experience.
                    </p>
                </div>

                {/* Action Button */}
                <Button href="/" className="reveal-button">
                    Back to Home
                </Button>
            </div>
        </div>
    );
}
