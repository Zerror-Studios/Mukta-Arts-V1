import React from 'react';
import {
    RiInstagramLine,
    RiLinkedinFill,
    RiYoutubeFill,
    RiFacebookFill,
} from '@remixicon/react';

const LocationInfo = () => {
    return (
        <section className="bg-[#FAFAFA] py-16 md:py-24 px-4 md:px-8 lg:px-16 border-t border-[#202020]">
            <div className="mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-18 items-stretch">

                    {/* Google Map */}
                    <div className="lg:col-span-2 w-full h-[420px] lg:h-auto min-h-[380px] bg-gray-200 border border-[#202020]">
                        <iframe
                            src="https://maps.google.com/maps?q=Mukta%20Arts%20Limited,%20Mukta%20House,%20Film%20City,%20Aarey%20Milk%20Colony,%20Goregaon%20East,%20Mumbai,%20Maharashtra%20400065&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Mukta Arts Limited Office Location"
                        ></iframe>
                    </div>

                    {/* Office Details */}
                    <div className="lg:col-span-1 flex flex-col justify-between h-full">

                        {/* Our Office Block */}
                        <div className="pb-8 border-b border-[#202020]">
                            <h3 className="text-2xl md:text-[1.75rem] font-semibold text-black tracking-tight mb-3">
                                Our Office
                            </h3>
                            <p className="text-[15px] font-semibold text-black mb-2">
                                Mukta Arts Limited
                            </p>
                            <p className="text-[#555] text-[15px] leading-[1.7]">
                                3rd Floor, Mukta House<br />
                                Behind Whistling Woods International<br />
                                Film City Complex, Aarey Milk Colony<br />
                                Goregaon (East), Mumbai, Maharashtra 400065, India
                            </p>
                        </div>

                        {/* Email Inquiries */}
                        <div className="py-8 border-b border-[#202020]">
                            <h3 className="text-lg md:text-xl font-semibold text-black tracking-tight mb-4">
                                Email
                            </h3>
                            <div className="flex flex-col gap-1">
                                <a
                                    href="mailto:hr@muktaarts.com"
                                    className="text-[15px] md:text-base font-medium text-black hover:underline tracking-tight transition-colors block"
                                >
                                    hr@muktaarts.com
                                </a>
                                <a
                                    href="mailto:investorrelations@muktaarts.com"
                                    className="text-[15px] md:text-base font-medium text-black hover:underline tracking-tight transition-colors block"
                                >
                                    investorrelations@muktaarts.com
                                </a>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <span className="text-[#555] text-[15px] font-medium">
                                Follow us:
                            </span>

                            <div className="flex items-center gap-3">
                                <a
                                    href="https://www.instagram.com/muktaartsltd/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="w-10 h-10 border border-[#202020] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200"
                                >
                                    <RiInstagramLine size={18} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/mukta-arts-limited/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="w-10 h-10 border border-[#202020] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200"
                                >
                                    <RiLinkedinFill size={18} />
                                </a>
                                <a
                                    href="https://www.youtube.com/@MuktaArtsLtd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="w-10 h-10 border border-[#202020] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200"
                                >
                                    <RiYoutubeFill size={18} />
                                </a>
                                <a
                                    href="https://www.facebook.com/MuktaArtsLtd/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-10 h-10 border border-[#202020] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200"
                                >
                                    <RiFacebookFill size={18} />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationInfo;
