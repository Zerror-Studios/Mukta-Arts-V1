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
        {/* 612x570 keeps logo-4k.png's 3840x3574 proportions; its even transparent margin
            leaves the artwork about 520px tall, so it also survives a centred square crop.
            ImageResponse renders plain <img>, next/image does not apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo}`} alt="Mukta Arts logo" width={612} height={570} />
      </div>
    ),
    size
  );
}
