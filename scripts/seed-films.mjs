// One-time import of the films that used to be hard-coded in FilmsComponent.jsx into Sanity.
// Run from the project root, logged in to the Sanity CLI:
//   npx sanity exec scripts/seed-films.mjs --with-user-token
// Safe to run again: each film has a fixed id (film-<slug>), so a rerun overwrites it instead of
// adding a duplicate, and Sanity recognises a poster it already has and does not store it twice.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { filmBriefs } from "../src/components/our-film/filmBriefs.js";

const client = getCliClient({ apiVersion: "2026-10-26" });

// The client's compressed posters; the six without one there use /img/films/<slug>.jpg
const POSTERS = "public/img/final/home/all/compressed/";
const clientPosters = {
  "karz": "04_KARZ_(1980).jpg",
  "hero": "06_HERO_(1982).jpg",
  "karma": "08_KARMA_(1986).jpg",
  "uttar-dakshin": "UTTAR DAKSHIN (HINDI).jpg",
  "ram-lakhan": "10_RAM_LAKHAN_(1987).jpg",
  "saudagar": "11_SAUDAGAR_(1991).jpg",
  "pyar-ki-ganga-bahe": "PYAR KI GANGA BAHE.jpg",
  "prem-deewane": "12_PREM_DEEWANE_(1992).jpg",
  "khalnayak": "13_KHALNAYAK_(1993).jpg",
  "trimurti": "15_TRIMURTI_(1995).jpg",
  "jaan": "16_JAAN_(1996).jpg",
  "pardes": "17_PARDES_(1997).jpg",
  "shyam-ghanshyam": "18_SHYAM_GHANSHYAM_(1998).jpg",
  "taal": "19_TAAL_(1999).jpg",
  "rahul": "21_RAHUL_(2001).jpg",
  "yaadein": "20_YAADEIN_(2001).jpg",
  "badhaai-ho-badhaai": "22_BADHAI_HO_BADHAI_(2002).jpg",
  "ek-aur-ek-gyarah": "24_EK_AUR_EK_GYARAH_(2003).jpg",
  "joggers-park": "23_JOGGERS_PARK_(2002).jpg",
  "aitraaz": "25_AITRAAZ_(2004).jpg",
  "kisna": "26_KISNA_(2005).jpg",
  "iqbal": "27_IQBAL_(2005).jpg",
  "shaadi-se-pehle": "29_SHAADI_SE_PEHLE_(2006).jpg",
  "36-china-town": "30_36_CHINA_TOWN_(2006).jpg",
  "apna-sapna-money-money": "31_APNA_SAPNA_MONEY_MONEY_(2006).jpg",
  "good-boy-bad-boy": "33_GOOD_BOY_BAD_BOY_(2007).jpg",
  "bombay-to-bangkok": "34_BOMBAY_TO_BANGKOK_(2008).jpg",
  "valu": "35_VALU_(2008).jpg",
  "black-and-white": "36_BLACK_AND_WHITE_(2008).jpg",
  "sanai-choughade": "39_SANAI_CHOUGHADE_(2008).jpg",
  "yuvvraaj": "40_YUVRAAJ_(2008).jpg",
  "paying-guests": "41_PAYING_GUEST_(2009).jpg",
  "right-yaaa-wrong": "44_RIGHT_YA_WRONG_(2010).jpg",
  "hello-darling": "42_HELLO_DARLING_(2010).jpg",
  "nouka-dubi": "45_NOUKADUBI__(2010).jpg",
  "love-express": "47_LOVE_EXPRESS_(2011).jpg",
  "cycle-kick": "46_CYCLE_KICK_(2011).jpg",
  "samhita": "49_SAMHITA_(2013).jpg",
  "nimbehuli": "NIMBEHULI (KANNADA).jpg",
  "kaanchi": "48_KAANCHI_(2013).jpg",
  "double-di-trouble": "50_DOUBLE_DI_TROUBLE_(2014).jpg",
  "36-farmhouse": "52_36_FARMHOUSE_(2022).jpg",
  "vijeta": "51_VIJETA_(2020).jpg",
  "jaanki": "JAANKI (DD).jpg",
  "gandhi-a-perspective": "GANDHI - A PERSPECTIVE - SHORT FILM.jpg",
  "tu-me-ani-amaira": "TU ME ANI AMAIRA (MARATHI).jpg",
};

const films = [
  { slug: "kalicharan", title: "Kalicharan", year: 1976 },
  { slug: "vishwanath", title: "Vishwanath", year: 1978 },
  { slug: "gautam-govinda", title: "Gautam Govinda", year: 1979 },
  { slug: "karz", title: "Karz", year: 1980 },
  { slug: "krodhi", title: "Krodhi", year: 1981 },
  { slug: "vidhaata", title: "Vidhaata", year: 1982 },
  { slug: "hero", title: "Hero", year: 1983 },
  { slug: "meri-jung", title: "Meri Jung", year: 1985 },
  { slug: "karma", title: "Karma", year: 1986 },
  { slug: "uttar-dakshin", title: "Uttar Dakshin", year: 1987 },
  { slug: "ram-lakhan", title: "Ram Lakhan", year: 1989 },
  { slug: "saudagar", title: "Saudagar", year: 1991 },
  { slug: "pyar-ki-ganga-bahe", title: "Pyar Ki Ganga Bahe", year: 1993 },
  { slug: "prem-deewane", title: "Prem Deewane", year: 1992 },
  { slug: "khalnayak", title: "Khalnayak", year: 1993 },
  { slug: "trimurti", title: "Trimurti", year: 1995 },
  { slug: "jaan", title: "Jaan", year: 1996 },
  { slug: "pardes", title: "Pardes", year: 1997 },
  { slug: "shyam-ghanshyam", title: "Shyam Ghanshyam", year: 1998 },
  { slug: "taal", title: "Taal", year: 1999 },
  { slug: "rahul", title: "Rahul", year: 2001 },
  { slug: "yaadein", title: "Yaadein", year: 2001 },
  { slug: "badhaai-ho-badhaai", title: "Badhaai Ho Badhaai", year: 2002 },
  { slug: "ek-aur-ek-gyarah", title: "Ek Aur Ek Gyarah", year: 2003 },
  { slug: "joggers-park", title: "Jogger’s Park", year: 2003 },
  { slug: "aitraaz", title: "Aitraaz", year: 2004 },
  { slug: "kisna", title: "Kisna", year: 2005 },
  { slug: "iqbal", title: "Iqbal", year: 2005 },
  { slug: "shaadi-se-pehle", title: "Shaadi Se Pehle", year: 2006 },
  { slug: "36-china-town", title: "36 China Town", year: 2006 },
  { slug: "apna-sapna-money-money", title: "Apna Sapna Money Money", year: 2006 },
  { slug: "good-boy-bad-boy", title: "Good Boy Bad Boy", year: 2007 },
  { slug: "bombay-to-bangkok", title: "Bombay to Bangkok", year: 2008 },
  { slug: "valu", title: "Valu", year: 2008 },
  { slug: "black-and-white", title: "Black and White", year: 2008 },
  { slug: "sanai-choughade", title: "Sanai Choughade", year: 2008 },
  { slug: "yuvvraaj", title: "Yuvvraaj", year: 2008 },
  { slug: "paying-guests", title: "Paying Guests", year: 2009 },
  { slug: "right-yaaa-wrong", title: "Right Yaaa Wrong", year: 2010 },
  { slug: "hello-darling", title: "Hello Darling", year: 2010 },
  { slug: "nouka-dubi", title: "Nouka Dubi / Kashmakash", year: 2011 },
  { slug: "love-express", title: "Love Express", year: 2011 },
  { slug: "cycle-kick", title: "Cycle Kick", year: 2011 },
  { slug: "samhita", title: "Samhita", year: 2013 },
  { slug: "nimbehuli", title: "Nimbehuli", year: 2014 },
  { slug: "kaanchi", title: "Kaanchi", year: 2014 },
  { slug: "double-di-trouble", title: "Double Di Trouble", year: 2014 },
  { slug: "36-farmhouse", title: "36 Farmhouse", year: 2022 },
  { slug: "vijeta", title: "Vijeta", year: 2020 },
  { slug: "jaanki", title: "Jaanki", year: 2023 },
  { slug: "gandhi-a-perspective", title: "Gandhi: A Perspective", year: 2020 },
  { slug: "tu-me-ani-amaira", title: "Tu Me Ani Amaira", year: 2025 },
];

for (const film of films) {
  const file = clientPosters[film.slug]
    ? path.join(POSTERS, clientPosters[film.slug])
    : path.join("public/img/films", `${film.slug}.jpg`);

  const asset = await client.assets.upload("image", await readFile(file), {
    filename: path.basename(file),
  });

  const doc = {
    _id: `film-${film.slug}`,
    _type: "film",
    title: film.title,
    slug: { _type: "slug", current: film.slug },
    year: film.year,
    poster: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  };
  // Empty briefs are left out rather than stored as ""
  if (filmBriefs[film.slug]) doc.description = filmBriefs[film.slug];

  await client.createOrReplace(doc);
  console.log(`✓ ${film.title} (${film.year})`);
}

console.log(`\nDone: ${films.length} films in Sanity.`);
