import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { SUBMISSION_FOLDER, MAX_FILE_BYTES, ALLOWED_TYPES } from "@/lib/scriptSubmission";

// Issues short-lived tokens so the browser can upload the pitch deck and SWA certificate
// straight to Vercel Blob. Files of up to 20 MB cannot pass through a serverless function
// (its request body limit is 4.5 MB), so only the blob URLs reach /api/script-submission.
export async function POST(request) {
  const body = await request.json();

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(`${SUBMISSION_FOLDER}/`)) {
          throw new Error("Invalid upload path.");
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_FILE_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
