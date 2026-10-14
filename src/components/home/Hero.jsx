import React from 'react';
import HeadphonesCanvas from './HeadphonesModel';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative w-full h-[100svh]  bg-white px-5 py-20  sm:px-10 sm:py-10 text-black overflow-hidden flex flex-col items-center justify-between">

      {/* Huge Background Text */}
      <div className="  w-full  text-center flex justify-start   items-start z-0 select-none pointer-events-none">
        <h1 className=" text-[4rem] md:text-[180px] lg:text-[240px]  font-bold leading-none whitespace-nowrap text-black flex items-start">
          Mukta Arts
          <h4 className="text-3xl md:text-5xl lg:text-6xl font-normal mb-auto ">
            LTD
          </h4>
        </h1>

      </div>

      {/* 3D Headphones Model */}
      <HeadphonesCanvas />

      {/* Bottom Left Content */}
      <div className=" z-20  w-full md:w-[30vw] mr-auto ">
        <h3 className="  capitalize   mb-6">
          Mukta Arts Limited is one of India's leading production houses with business interests across the entertainment spectrum from Exhibition to Education.
        </h3>
        <Link href={'/about'}>
        <button className="bg-[#0474BA] hover:bg-[#0666a1] text-white px-5 py-2.5 text-xs md:text-sm tracking-wide font-medium rounded-[3px] flex items-center gap-3 transition-colors cursor-pointer group">
          About Us
          <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
        </button>
        </Link>
      </div>

    </section>
  );
};

export default Hero;