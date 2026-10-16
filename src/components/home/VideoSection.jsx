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


            {/* The film is letterboxed (86px bars top and bottom of 720): 1.32x is just enough to hide the bars,
                where the old 2x blew the 720p file up so far it looked soft. The poster is its opening frame. */}
            <video
                ref={videoRef}
                src={videoOn ? "/video/video.mp4" : undefined}
                poster="/video/video-poster.webp"
                loop muted autoPlay playsInline
                aria-label="Mukta Arts brand film"
                className="absolute inset-0 w-full h-full object-cover scale-[1.32] group-hover:scale-[1.36] transition-transform duration-700 ease-in-out"
            />




        </section>
    );
};

export default VideoSection;
