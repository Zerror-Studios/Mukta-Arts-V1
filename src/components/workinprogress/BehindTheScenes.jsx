import React from "react";

const BehindTheScenes = () => {
  const images = [
    "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=400", // Top
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400", // Middle Left
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400", // Middle Right
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400", // Bottom Right
  ];

  return (
    <section className="w-full py-24 px-4 md:px-10 lg:px-10 bg-white text-black overflow-hidden">
      <div className=" mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">

        {/* Left Side: Title */}
        <div className="w-full md:w-5/12 shrink-0 z-10 mb-auto text-center md:text-left">
          <h2 className="text-[5rem] md:text-7xl lg:text-[110px] xl:text-[130px] font-bold leading-[1.05] tracking-tight">
            Behind the<br />Scenes
          </h2>
        </div>

        {/* Right Side: Scattered Images */}
        <div className="w-full md:w-7/12 relative h-[500px] md:h-[800px] flex-shrink-0 mt-12 md:mt-0">

          <div className="relative w-full h-full max-w-3xl mx-auto">
            {/* Image 1: Top */}
            <div className="absolute top-[5%] md:top-[0%] left-[45%] md:left-[45%] w-32 md:w-48 aspect-[1.1] shadow-md bg-gray-100">
              <img loading="lazy" decoding="async" src={images[0]} alt="BTS 1" className="w-full h-full object-cover" />
            </div>

            {/* Image 2: Middle Right */}
            <div className="absolute top-[30%] md:top-[35%] right-[5%] md:right-[5%] w-32 md:w-48 aspect-square shadow-md bg-gray-100">
              <img loading="lazy" decoding="async" src={images[2]} alt="BTS 2" className="w-full h-full object-cover" />
            </div>

            {/* Image 3: Middle Left */}
            <div className="absolute top-[50%] md:top-[55%] left-[20%] md:left-[25%] w-32 md:w-48 aspect-square shadow-md bg-gray-100">
              <img loading="lazy" decoding="async" src={images[1]} alt="BTS 3" className="w-full h-full object-cover" />
            </div>

            {/* Image 4: Bottom Right */}
            <div className="absolute top-[75%] md:top-[75%] left-[55%] md:left-[60%] w-32 md:w-48 aspect-square shadow-md bg-gray-100">
              <img loading="lazy" decoding="async" src={images[3]} alt="BTS 4" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BehindTheScenes;
