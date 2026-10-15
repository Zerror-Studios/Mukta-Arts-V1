"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { gsap, MOTION_REDUCED } from "@/lib/motion";
import useScrollReveal from "@/hooks/useScrollReveal";

// Same links and documents as https://muktaarts.com/Aboutus/investorrelations.php
const IR = "https://muktaarts.com/Aboutus";
const DOCS = `${IR}/investorsrelation`;

const groups = [
  {
    title: "Reports",
    links: [
      { label: "Annual Reports", href: `${IR}/annual-reports.php` },
      { label: "Annual Returns", href: `${IR}/annual-returns.php` },
      { label: "Board Meetings", href: `${IR}/Board-Meetings.php` },
      { label: "Shareholding Pattern", href: `${IR}/shareholding-pattern.php` },
      { label: "Corporate Governance Reports", href: `${IR}/corporate-governance-reports.php` },
      { label: "Secretarial Compliance Reports", href: `${IR}/Secretarial-Compliance-Report.php` },
      { label: "Disclosure of Related Party Transactions", href: `${IR}/Related-Party-Transaction-Report.php` },
      { label: "Postal Ballot", href: `${IR}/Postal-Ballots.php` },
      { label: "Members Meetings", href: `${IR}/Members-Meetings.php` },
      { label: "Members Information", href: `${IR}/Members-Information.php` },
    ],
  },
  {
    title: "Corporate Governance",
    intro:
      "Corporate governance is a reflection of the company’s culture, policies, relationship with stakeholders, commitment to values and ethical business conduct. In the same spirit, timely and accurate disclosure of information regarding the financial situation, performance, ownership and governance of the company is an important part of corporate governance.",
    links: [
      { label: "Terms and conditions for appointment of Independent Directors", href: `${DOCS}/Corporate-Governance/Terms%20and%20conditions%20of%20appointment%20of%20independent%20directors.pdf` },
      { label: "Composition of Committee", href: `${DOCS}/Corporate-Governance/Composition-of-Committee-2026.pdf` },
      { label: "Code of Conduct for Board and Senior Management Personnel", href: `${DOCS}/Corporate-Governance/Code%20of%20conduct%20for%20BODand%20senior%20management.pdf` },
      { label: "Vigil Mechanism and Whistle Blower Policy", href: `${DOCS}/Corporate-Governance/Whistle%20Blower%20Policy.pdf` },
      { label: "Criteria for making payments to non-executive directors", href: `${DOCS}/Corporate-Governance/Criteria%20for%20making%20payments%20to%20Non-Executive%20Directors.pdf` },
      { label: "Fair Disclosure Policy", href: `${DOCS}/Corporate-Governance/Fair%20Disclosure%20Policy.pdf` },
      { label: "Familiarization program for Independent Directors", href: `${DOCS}/Corporate-Governance/Famrilisation%20Prgramme.pdf` },
    ],
  },
  {
    title: "Disclosures",
    links: [
      { label: "Stock Exchange Filings", href: `${IR}/Stock%20Exchange%20Intimations.php` },
      { label: "Disclosures under Regulation 46 of SEBI (LODR) Regulations, 2015", href: `${IR}/Disclosures%20under%20Regulation%2046%20of%20SEBI.php` },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Policy on CSR", href: `${DOCS}/policies/Corporate-Social-Responsibility-Policy.pdf` },
      { label: "Policy on Related Party Transactions", href: `${DOCS}/Corporate-Governance/MAL_Materiality%20of%20RPT%20Revised.pdf` },
      { label: "Policy on material subsidiaries", href: `${DOCS}/policies/MAL_Policy%20for%20determining%20Material%20Subsidiary.pdf` },
      { label: "Nomination and Remuneration Policy", href: `${DOCS}/policies/Nomination%20and%20Remuneration%20Policy.pdf` },
      { label: "Policy on Board Diversity", href: `${DOCS}/policies/Policy%20on%20Board%20Diversity.pdf` },
      { label: "Policy for determining materiality of events", href: `${DOCS}/policies/MAL_Materiality%20of%20event_Policy.pdf` },
      { label: "Familiarisation Policy", href: `${DOCS}/policies/Familiarisation%20Policy.pdf` },
      { label: "Policy on Materiality of RPT", href: `${DOCS}/policies/MAL_Materiality%20of%20RPT_14.02.2024.pdf` },
      { label: "Website Archival Policy", href: `${DOCS}/policies/MAL_Website_Archival_Policy.pdf` },
      { label: "Policy on Preservation of Documents", href: `${DOCS}/policies/MAL%20_Preservation%20of%20Documents.docx` },
      { label: "Policy on PIT Fair Disclosre of UPSI", href: `${DOCS}/policies/MAL_Policy_PIT_Fair_Disclosre_UPSI.pdf` },
    ],
  },
];

const ExternalLink = ({ href, children, className = "" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group/link flex items-start justify-between gap-4 py-3 border-b border-black/10 last:border-b-0 text-[15px] md:text-base text-[#333] hover:text-black transition-colors ${className}`}
  >
    <span>{children}</span>
    <ArrowUpRight
      strokeWidth={1.5}
      className="w-4 h-4 shrink-0 mt-0.5 text-black/40 group-hover/link:text-black group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all"
    />
  </a>
);

const AccordionItem = ({ group, isFirst, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    // First render: just take the right state, no animation
    if (!mounted.current) {
      mounted.current = true;
      gsap.set(el, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
      return;
    }
    const instant = window.matchMedia(MOTION_REDUCED).matches;
    gsap.to(el, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: instant ? 0 : 0.5,
      ease: isOpen ? "power3.out" : "power2.inOut",
    });
  }, [isOpen]);

  return (
    <div className={`border-b border-[#c2c2c2] ${isFirst ? "border-t" : ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center py-5 md:py-6 text-left focus:outline-none group cursor-pointer"
      >
        <span className="text-xl md:text-2xl font-medium text-black tracking-tight group-hover:text-gray-600 transition-colors">
          {group.title}
        </span>
        <span className="flex items-center gap-4">
          <span className="text-xs md:text-sm text-[#888] tabular-nums">{String(group.links.length).padStart(2, "0")}</span>
          <ChevronDown
            strokeWidth={1.5}
            className={`w-5 h-5 text-black transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden">
        <div className="pb-8">
          {group.intro && (
            <p className="text-[#555] text-[15px]! md:text-base! leading-relaxed! max-w-3xl mb-5">{group.intro}</p>
          )}
          <div className="flex flex-col">
            {group.links.map((link) => (
              <ExternalLink key={link.href} href={link.href}>
                {link.label}
              </ExternalLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InvestorRelations = () => {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="investor-relations" className="w-full bg-[#FAFAFA] py-24 md:py-32 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left: heading and contact for investor grievances */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 flex flex-col gap-8">
            <h5 data-reveal="words" className="text-3xl! lg:text-5xl! leading-tight! font-semibold text-black tracking-tight">
              Investor Relations
            </h5>

            <div data-reveal="rise" className="flex flex-col gap-2 border-l border-black/10 pl-6">
              <p className="text-black text-[15px]! leading-relaxed! font-medium">
                Contact information for assisting and handling investor grievances:
              </p>
              <p className="text-[#555] text-[15px]! leading-relaxed!">
                Ms. Pratiksha Panchal,<br />
                Company Secretary and Compliance Officer<br />
                Tel: Board line — 3364 9400
              </p>
              <a
                href="mailto:investorrelations@muktaarts.com"
                className="text-[15px] font-medium text-black hover:underline w-fit"
              >
                investorrelations@muktaarts.com
              </a>
              <a
                href={`${IR}/Unpaid-Dividend-Information.php`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit items-center gap-2 bg-[#0474BA] hover:bg-[#0666a1] text-white px-6 py-2.5 text-xs md:text-sm tracking-wider font-semibold rounded-[3px] transition-colors duration-300 group"
              >
                <span>Unclaimed Dividend</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: the document groups */}
        <div data-reveal="rise" className="lg:col-span-8">
          {groups.map((group, index) => (
            <AccordionItem key={group.title} group={group} isFirst={index === 0} defaultOpen={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestorRelations;
