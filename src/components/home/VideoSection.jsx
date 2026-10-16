"use client";

import React, { useEffect, useRef } from 'react';
import useAfterIntro from '@/hooks/useAfterIntro';
import useInView from '@/hooks/useInView';

const VideoSection = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    // Starts downloading once the home intro has played, so it never competes with it
    const videoOn = useAfterIntro();
    // A full-screen video keeps decoding even when scrolled past: only play it near the screen
    const inView = useInView(sectionRef);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoOn) return;
        if (inView) video.play().catch(() => {});
        else video.pause();
    }, [inView, videoOn]);

    return (
        <section ref={sectionRef} className="relative w-full h-[100svh] bg-black overflow-hidden flex items-center justify-center group cursor-pointer">


            <video
                ref={videoRef}
                src={videoOn ? "/video/video.mp4" : undefined}
                loop muted autoPlay playsInline
                alt="Video Thumbnail"
                className="absolute inset-0 w-full h-full object-cover  scale-[2] group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />




        </section>
    );
};

export default VideoSection;
