import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Share image for every page (og:image). Static, so it is generated at build time.
export const alt =
  "Mukta Arts logo and tagline: Telling stories across screens, classrooms and theatres.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Literal paths so the build can trace exactly these files (satori takes woff, not woff2).
  const [switzerSemibold, switzerRegular, logo] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Switzer-Semibold.woff")),
    readFile(join(process.cwd(), "public/fonts/Switzer-Regular.woff")),
    readFile(join(process.cwd(), "public/img/logo/logo-4k.png"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // Evens out the logo's transparent top edge
          paddingBottom: 24,
          backgroundColor: "#FAFAFA",
          color: "#111111",
          fontFamily: "Switzer",
        }}
      >
        {/* The margins below centre the logo artwork and the wordmark optically.
            ImageResponse renders plain <img>, next/image does not apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${logo}`}
          alt="Mukta Arts logo"
          width={344}
          height={280}
          style={{ marginLeft: 12 }}
        />
        <div
          style={{
            marginTop: 4,
            marginRight: 8,
            fontSize: 116,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.035em",
          }}
        >
          Mukta Arts
        </div>
        <div
          style={{
            width: 56,
            height: 3,
            marginTop: 30,
            backgroundColor: "#1B123D",
          }}
        />
        <div
          style={{
            marginTop: 26,
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.25,
            color: "#555555",
          }}
        >
          Telling stories across screens, classrooms and theatres.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Switzer", data: switzerSemibold, style: "normal", weight: 600 },
        { name: "Switzer", data: switzerRegular, style: "normal", weight: 400 },
      ],
    }
  );
}
