"use client";

import React from 'react';
import Image from 'next/image';
import useAfterIntro from '@/hooks/useAfterIntro';

const VideoSection = () => {
    // Starts downloading once the home intro has played, so it never competes with it
    const videoOn = useAfterIntro();

    return (
        <section className="relative w-full h-[100svh] bg-black overflow-hidden flex items-center justify-center group cursor-pointer">


            <video
                src={videoOn ? "/video/video.mp4" : undefined}
                loop muted autoPlay
                alt="Video Thumbnail"
                className="absolute inset-0 w-full h-full object-cover  scale-[2] group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />




        </section>
    );
};

export default VideoSection;
