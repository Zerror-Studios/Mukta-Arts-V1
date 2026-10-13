"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, FileDown } from "lucide-react";
import gsap from "gsap";

const accordionData = [
  { title: "Annual Returns", content: "Detailed information and documents regarding the Annual Returns of the company." },
  { title: "Board Meetings", content: "Notices, agendas, and minutes of the Board Meetings held during the financial year." },
  { title: "Shareholding Pattern", content: "Quarterly statements showcasing the shareholding pattern of the company." },
  { title: "Corporate Governance Reports", content: "Reports reflecting the company's compliance with corporate governance standards." },
  { title: "Secretarial Compliance Reports", content: "Annual secretarial compliance reports issued by practicing company secretaries." },
  { title: "Disclosure of Related Party Transactions", content: "Details of transactions entered into by the company with its related parties." },
  { title: "Postal Ballot", content: "Notices and results of resolutions passed through postal ballot." },
  { title: "Members Meetings", content: "Information regarding Annual and Extraordinary General Meetings." },
  { title: "Members Information", content: "General information and updates relevant to the members and shareholders." },
  { title: "Corporate Governance", content: "Policies, codes, and general framework for corporate governance." },
  { title: "Disclosures", content: "Various disclosures made under SEBI listing regulations." },
  { title: "Policies", content: "Company policies covering various aspects of business operations and ethics." },
];

const AccordionItem = ({ title, content, isFirst }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className={`border-b border-[#c2c2c2] ${isFirst ? "border-t" : ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 md:py-[1.35rem] text-left focus:outline-none group"
      >
        <h5 className="text-[15px] md:text-[1.05rem] font-medium text-black tracking-tight group-hover:text-gray-600 transition-colors">
          {title}
        </h5>
        <ChevronDown
          strokeWidth={1.5}
          className={`w-5 h-5 text-black transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""
            }`}
        />
      </button>
      <div
        ref={contentRef}
        className="h-0 opacity-0 overflow-hidden"
      >
        <div className="pb-6 text-sm md:text-[15px] leading-relaxed text-[#555] font-medium max-w-3xl">
          {content}
        </div>
      </div>
    </div>
  );
};

const InvestorRelations = () => {
  return (
    <section className="w-full bg-[#FAFAFA] py-16 md:py-24 px-4 md:px-8">
      <div className=" mx-auto">
        {/* Top Section */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-24">


          <div className="lg:col-span-4 flex flex-col justify-between items-start lg:pb-2">
            <div>
              <p className="text-[#555] text-sm md:text-[15px] mb-6 md:mb-10 font-medium">
                Investor Relations
              </p>
              <h4 className="text-4xl md:text-[2.5rem] lg:text-[2.75rem] font-medium tracking-tight text-black leading-[1.05] mb-8">
                42nd Annual Report &<br />
                Audited Financial<br />
                Statements
              </h4>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 border border-[#ddd] bg-transparent text-[0.65rem] md:text-xs font-bold tracking-[0.15em] text-black hover:bg-black hover:text-white transition-all duration-300 group">
              <FileDown strokeWidth={1.5} className="w-4 h-4 md:w-5 md:h-5 group-hover:text-white transition-colors" />
              DOWNLOAD FILE
            </button>
          </div>


          <div className="lg:col-span-5 w-full">
            <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-[1/1.1] overflow-hidden">
              <Image
                src="/img/ma/MuktaA2Cinemas.jpg"
                alt="Mukta Arts Building"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col justify-end lg:pb-8 pt-8 lg:pt-0">
            <div className="border-b border-[#e5e5e5] pb-4 mb-4">
              <p className="text-[1.1rem] md:text-xl font-bold text-black tracking-tight">
                PDF • 14.8MB
              </p>
            </div>
            <p className="text-[13px] md:text-sm text-[#555] leading-relaxed font-medium">
              FY 2023-24 • Standalone & Consolidated<br />
              Balance Sheet
            </p>
          </div>
        </div> */}

        {/* Accordion Section */}
        <div className="w-full">
          {accordionData.map((item, index) => (
            <AccordionItem
              key={index}
              title={item.title}
              content={item.content}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestorRelations;
