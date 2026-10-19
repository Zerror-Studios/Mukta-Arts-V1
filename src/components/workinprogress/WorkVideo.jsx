import React from 'react';

const WorkVideo = () => {
  return (
    <section className="w-full bg-white py-20 md:py-32  flex justify-center items-center px-4 md:px-10">
      <div className="relative w-full h-fit bg-gray-100 overflow-hidden  group cursor-pointer rounded-sm">

        {/* Video Thumbnail Image */}
        <div className='w-full h-[90vh] overflow-hidden flex m-auto'>

          <img
            src="https://c4.wallpaperflare.com/wallpaper/906/604/894/movies-bollywood-movies-wallpaper-preview.jpg"
            alt="Video Thumbnail"
            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"

            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 backdrop-blur-[2px] w-16 h-12 md:w-24 md:h-16 rounded-md flex items-center justify-center transition-all duration-300 group-hover:bg-black/70 group-hover:scale-110">
            {/* Play Triangle Icon */}
            <svg
              className="w-6 h-6 md:w-10 md:h-10 text-white ml-1 md:ml-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 4L20 12L6 20V4Z" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WorkVideo;
