"use client";

import React, { useRef } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

// Word for word from the client's WWIL_QUOTES.pdf (/img/final/WW/pdf), in the order it lists them.
// Saroj Khan's entry has no date there.
const quotes = [
  {
    name: "Shabana Azmi",
    role: "Actor",
    date: "30 March 2006",
    quote: "Trust Subhash to do what we all have dreamed of doing for so long. You have all my support.",
  },
  {
    name: "Alka Yagnik",
    role: "Singer",
    date: "2 April 2006",
    quote: "Amazing! A dream come true for all aspiring young ones who want to ‘make it’ in the world of films. Kudos! Luv’n’ Regards.",
  },
  {
    name: "Anil Kapoor",
    role: "Actor",
    date: "21 June 2006",
    quote: "Subhashji, your contribution to the world of entertainment has without doubt been tremendous. You are an institution to a lot of young film-makers, but this monument which you have built is much bigger than all the films you or any other film-maker of this country has made. As a student of cinema, I would like to bow down and thank you for making this temple.",
  },
  {
    name: "Ashutosh Gowariker",
    role: "Filmmaker",
    date: "12 August 2006",
    quote: "Today, once again, I felt extreme pride to see WWI growing from strength to strength, with reference not only to the campus, faculty and the ever-growing syllabus, but also the quality of students. All I can say is that ‘the future of Indian cinema is cinematically bright!’ With great hope and best wishes to all.",
  },
  {
    name: "Sukhwinder Singh",
    role: "Music Director",
    date: "14 August 2006",
    quote: "This was a new feel. I really loved the atmosphere.",
  },
  {
    name: "Madhuri Dixit",
    role: "Actor",
    date: "23 May 2007",
    quote: "Hope this institution makes every dream turn into reality: now and forever.",
  },
  {
    name: "Amole Gupte",
    role: "Filmmaker",
    date: "6 August 2008",
    quote: "I haven’t been lucky enough to study at a film school, completely self-taught! So it’s great to see the facilities, the infrastructure available. Wish I had studied here... WWI, a place I wish I had squatted for 20 years.: Rip Van Winkle",
  },
  {
    name: "Farhan Akhtar",
    role: "Filmmaker",
    date: "15 October 2008",
    quote: "Thank you for having me here at your amazing academy, film school. It is an experience I will always remember and cherish. Hope to be back here soon with more stories for your wonderful students.",
  },
  {
    name: "Imtiaz Ali",
    role: "Director",
    date: "2 September 2009",
    quote: "Energetic, zestful and informal atmosphere at WWI infused zing and a sense of youth in me. A very interesting experience coming here. I wish WWI all the best, and I’m sure students coming out from here will make the film industry stronger and a better place to be.",
  },
  {
    name: "Mahesh Samat",
    role: "Managing Director, Walt Disney",
    date: "15 January 2010",
    quote: "WWI is a really impressive place! Great campus and a lot of passion within the walls. All the best to the Institute.",
  },
  {
    name: "Rajkumar Hirani",
    role: "Filmmaker",
    date: "20 January 2010",
    quote: "Whistling Woods, All IZZ Well!",
  },
  {
    name: "Saroj Khan",
    role: "Choreographer",
    quote: "I enjoyed every minute of my session. Also, the students are ‘LAJAWAB’. I must say Subhashji and Meghna have done such a fabulous job. I love all students and their mentors. Thanks for calling me.",
  },
  {
    name: "Kamal Haasan",
    role: "Actor and Filmmaker",
    date: "18 July 2014",
    quote: "A river water never returns to the fountain’s head unless through osmosis as rain. I have this rare opportunity of returning to the very womb of filmmakers: the film school. Truly a pleasure.",
  },
  {
    name: "Omung Kumar",
    role: "Filmmaker",
    date: "9 April 2015",
    quote: "5th Veda is the most exciting programme I have come across in a very long time. I had fun sharing my experience with the students. There is so much to talk about, and the concept just took over me. Thank you for inviting me.",
  },
  {
    name: "N. R. Narayana Murthy",
    role: "Chairman Emeritus, Infosys",
    date: "17 July 2015",
    quote: "Spending some time going through the institute was like going through a stunning magic show. Keep it up and raise the image of the country.",
  },
  {
    name: "Shankar Mahadevan",
    role: "Singer and Music Composer",
    date: "23 July 2015",
    quote: "We feel proud that an institution of this level and quality exists in our country. Thank you for the opportunity to come and share my views.",
  },
];

// Short quotes are set larger, so the columns get a rhythm instead of sixteen equal blocks
const SHORT = 90;

export default function WWQuotes() {
  const sectionRef = useRef(null);

  // Heading word by word, the intro line by line, then each quote rises in as it enters
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="bg-[#1B123D] text-white py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-10 overflow-hidden">
      {/* Heading, laid out like the schools section above */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-16 mb-16 md:mb-24">
        <h2 data-reveal="words" className="tracking-tight max-w-4xl text-white">
          Voices from the Industry
        </h2>
        <p data-reveal="lines" className="text-white/60 text-base! md:text-lg! leading-relaxed! max-w-md lg:pb-3">
          Actors, filmmakers, musicians and business leaders, in their own words after visiting Whistling Woods International.
        </p>
      </div>

      {/* Masonry columns: each quote keeps its natural height and never splits across columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-x-8 lg:gap-x-12">
        {quotes.map((q) => {
          const short = q.quote.length < SHORT;
          return (
            <figure
              key={q.name}
              data-reveal="rise"
              className="break-inside-avoid border-t border-white/15 pt-6 md:pt-8 pb-12 md:pb-16"
            >
              <span aria-hidden="true" className="block font-['SwitzerB'] text-[#e2a866] text-[44px] leading-[0.6] mb-4 select-none">
                “
              </span>
              <blockquote>
                <p
                  className={`font-['SwitzerM'] text-white text-balance ${
                    short
                      ? "text-[24px]! md:text-[28px]! leading-[1.25]! tracking-tight"
                      : "text-[16px]! md:text-[18px]! leading-[1.5]!"
                  }`}
                >
                  {q.quote}
                </p>
              </blockquote>
              <figcaption className="mt-6 md:mt-8">
                <span className="block font-['SwitzerSB'] text-white text-[15px] md:text-[16px]">{q.name}</span>
                <span className="block text-white/50 text-[13px] md:text-[14px] mt-1">
                  {q.role}
                  {q.date && <> · {q.date}</>}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
