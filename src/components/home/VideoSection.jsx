"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import useAfterIntro from '@/hooks/useAfterIntro';
import useInView from '@/hooks/useInView';

const VideoSection = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    // Starts downloading once the home intro has played, so it never competes with it
    const videoOn = useAfterIntro();
    // A full-screen video keeps decoding even when scrolled past: only play it near the screen
    const inView = useInView(sectionRef);
    const [muted, setMuted] = useState(true);

    // React does not keep the `muted` attribute in sync after the first render: set it on the element.
    // The click counts as a tap, so a video Low Power Mode held back can start here too.
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !muted;
        setMuted(!muted);
        if (video.paused) video.play().catch(() => {});
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoOn) return;
        if (!inView) {
            video.pause();
            return;
        }

        // iPhones in Low Power Mode refuse to start any video on their own, even a muted one:
        // start it on the visitor's first tap instead (a tap lets it play)
        let cancelled = false;
        const events = ["touchend", "click"];
        const stopWaiting = () => events.forEach((type) => window.removeEventListener(type, playOnTap));
        const playOnTap = () => {
            stopWaiting();
            video.play().catch(() => {});
        };
        video.play().catch((err) => {
            if (cancelled || err.name !== "NotAllowedError") return;
            events.forEach((type) => window.addEventListener(type, playOnTap, { passive: true }));
        });
        return () => {
            cancelled = true;
            stopWaiting();
        };
    }, [inView, videoOn]);

    return (
        <section ref={sectionRef} className="relative w-full overflow-x-hidden  h-fit sm:h-[100svh] bg-black overflow-hidden flex items-center justify-center group cursor-pointer">


            {/* The film is letterboxed (86px bars top and bottom of 720): 1.32x is just enough to hide the bars,
                where the old 2x blew the 720p file up so far it looked soft. The poster is its opening frame. */}
            <video
                ref={videoRef}
                src={videoOn ? "/video/video-web.mp4" : undefined}
                poster="/video/video-poster.webp"
                loop muted autoPlay playsInline
                aria-label="Mukta Arts brand film"
                className="sm:absolute sm:inset-0 w-full sm:h-full object-cover scale-[1.32] group-hover:scale-[1.36] transition-transform duration-700 ease-in-out"
            />

            {videoOn && (
                <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute video" : "Mute video"}
                    aria-pressed={!muted}
                    className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 text-white border border-white/30 backdrop-blur-sm cursor-pointer transition-colors duration-300 hover:bg-white hover:text-black"
                >
                    {muted
                        ? <VolumeX strokeWidth={1.5} className="w-5 h-5" />
                        : <Volume2 strokeWidth={1.5} className="w-5 h-5" />}
                </button>
            )}



        </section>
    );
};

export default VideoSection;
