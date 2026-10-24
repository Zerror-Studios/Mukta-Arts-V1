'use client'

import React, { useRef } from 'react';
import {
    RiInstagramLine,
    RiLinkedinFill,
    RiYoutubeFill,
    RiFacebookFill,
} from '@remixicon/react';
import { SITE } from '@/lib/seo/site';
import useScrollReveal from '@/hooks/useScrollReveal';

const socials = [
    { label: 'Instagram', href: SITE.social.instagram, Icon: RiInstagramLine },
    { label: 'LinkedIn', href: SITE.social.linkedin, Icon: RiLinkedinFill },
    { label: 'YouTube', href: SITE.social.youtube, Icon: RiYoutubeFill },
    { label: 'Facebook', href: SITE.social.facebook, Icon: RiFacebookFill },
];

// Same grid as the form above: the map in the one-third label column, the office
// details in the two-thirds field column, with the same side padding and gaps.
const LocationInfo = () => {
    const sectionRef = useRef(null);
    useScrollReveal(sectionRef);

    return (
        <section ref={sectionRef} className="bg-[#FAFAFA] pb-16 sm:pb-24 px-4 sm:px-6 md:px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 pt-8 sm:pt-10 border-t border-[#202020]">

                {/* Map: one-third column */}
                <div data-reveal="rise" className="lg:col-span-4 w-full aspect-[4/3] lg:aspect-square bg-gray-200 border border-[#202020]">
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

                {/* Office, email and social links: two-thirds column */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 content-start">

                    <div data-reveal="rise" className="md:row-span-2 pb-8 md:pb-0 border-b md:border-b-0 border-[#202020]">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-black leading-tight mb-5">
                            Our Office
                        </h3>
                        <p className="text-[15px]! font-semibold text-black mb-2">
                            Mukta Arts Limited
                        </p>
                        <p className="text-[#555] text-[15px]! leading-[1.7]!">
                            3rd Floor, Mukta House<br />
                            Behind Whistling Woods International<br />
                            Film City Complex, Aarey Milk Colony<br />
                            Goregaon (East), Mumbai, Maharashtra 400065, India
                        </p>
                    </div>

                    <div data-reveal="rise" className="py-8 md:pt-0 border-b border-[#202020]">
                        <h3 className="text-lg md:text-xl font-semibold text-black tracking-tight mb-4">
                            Email
                        </h3>
                        <div className="flex flex-col gap-1">
                            <a
                                href="mailto:hr@muktaarts.com"
                                className="text-[15px] md:text-base font-medium text-black hover:underline tracking-tight transition-colors block w-fit"
                            >
                                hr@muktaarts.com
                            </a>
                            <a
                                href="mailto:investorrelations@muktaarts.com"
                                className="text-[15px] md:text-base font-medium text-black hover:underline tracking-tight transition-colors block w-fit"
                            >
                                investorrelations@muktaarts.com
                            </a>
                        </div>
                    </div>

                    <div data-reveal="rise" className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="text-[#555] text-[15px] font-medium">
                            Follow us:
                        </span>

                        <div className="flex items-center gap-3">
                            {socials.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 border border-[#202020] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LocationInfo;
