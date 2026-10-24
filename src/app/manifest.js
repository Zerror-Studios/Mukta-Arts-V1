/** Served at /manifest.webmanifest. Icons: public/favicon.ico and app/apple-icon.png. */
export default function manifest() {
  return {
    name: "Mukta Arts Limited",
    short_name: "Mukta Arts",
    description: "Subhash Ghai's entertainment group: film production, Whistling Woods International, Mukta A2 Cinemas and SGM Studios.",
    start_url: "/",
    display: "browser",
    // The light page background (bg-[#FAFAFA]) used across the site
    background_color: "#FAFAFA",
    theme_color: "#FAFAFA",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
