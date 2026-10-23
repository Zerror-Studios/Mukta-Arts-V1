import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Share image for every page (og:image): the logo on its own. Static, so it is generated at build time.
export const alt = "Mukta Arts logo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Literal path so the build can trace exactly this file
  const logo = await readFile(join(process.cwd(), "public/img/logo/logo-4k.png"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFAFA",
        }}
      >
        {/* 558x520 keeps logo-4k.png's 59x55 proportions; it has no transparent margin,
            so 520px tall leaves room around it and it also survives a centred square crop.
            ImageResponse renders plain <img>, next/image does not apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo}`} alt="Mukta Arts logo" width={558} height={520} />
      </div>
    ),
    size
  );
}
