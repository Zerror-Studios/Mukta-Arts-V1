import React from 'react';

const HeroSG = () => {
    return (
        <section className="bg-[#f5f5f6] min-h-screen px-6 py-8 md:px-12 md:py-16 lg:px-10 relative overflow-hidden font-['SwitzerR']">


            {/* Title Section */}
            <div className="mt-8 md:mt-16 mb-12">
                <h1 className="text-6xl md:text-[6rem] lg:text-[8.5rem] leading-[0.9] tracking-tighter font-['SwitzerB'] font-bold text-black mb-4">
                    Subhash Ghai
                </h1>
                {/* <p className="text-gray-700 text-lg md:text-xl font-['SwitzerR']">
                    Founder & Filmmaker
                </p> */}
            </div>

            {/* 3 Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-stretch mt-8 lg:mt-24">

                {/* Left Column - Stats */}
                <div className="flex flex-col justify-end order-2 lg:order-1">
                    <div className="border-b border-gray-300 pb-5 mb-8">
                        <h3 className="text-[1.75rem] leading-tight font-bold font-['SwitzerSB'] text-black mb-2">50 Years </h3>
                        <p className="text-gray-600 text-base font-['SwitzerR'] capitalize"> as a Filmmaker</p>
                    </div>
                    <div className="border-b border-gray-300 pb-5 mb-8">
                        <h3 className="text-[1.75rem] leading-tight font-bold font-['SwitzerSB'] text-black mb-2">19 Films</h3>
                        <p className="text-gray-600 text-base font-['SwitzerR'] capitalize">Written and Directed</p>
                    </div>
                    <div className="pb-5">
                        <h3 className="text-[1.75rem] leading-tight font-bold font-['SwitzerSB'] text-black mb-2">45+ </h3>
                        <p className="text-gray-600 text-base font-['SwitzerR'] capitalize">  Films Produced</p>
                    </div>
                </div>

                {/* Middle Column - Image */}
                <div className="relative order-1 lg:order-2 h-[400px] md:h-[600px] lg:h-[700px]">
                    <img
                        src="/img/sg/1.jpg"
                        alt="Subhash Ghai"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Right Column - Text & Socials */}
                <div className="flex flex-col justify-between order-3 lg:order-3 pt-4">
                    <p className="text-[#4A4A4A] text-[1.1rem] leading-relaxed font-['SwitzerR'] pr-4">
                        A five-decade journey across cinema, education and entrepreneurship. From creating
                        some of Indian cinema’s most enduring films to building institutions that shape the next
                        generation of creative talent, Subhash Ghai’s vision has always extended beyond the
                        screen.
                    </p>

                    {/* Social Icons */}
                    <div className="flex space-x-4 mt-12 lg:mt-0 lg:pb-8">
                        <a href="#" className="border border-gray-300 bg-white p-3 hover:bg-black hover:text-white transition-colors flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
                            {/* Facebook SVG */}
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                        </a>
                        <a href="#" className="border border-gray-300 bg-white p-3 hover:bg-black hover:text-white transition-colors flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
                            {/* X (Twitter) SVG */}
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSG;