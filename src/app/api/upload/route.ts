import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Server-side counterpart to the client's `upload()` call in
// admin/product-form.tsx — mints a short-lived, scoped client token so the
// browser can PUT the file bytes straight to Vercel Blob (no routing large
// image bytes through this function / its request-body limit). A plain
// Route Handler rather than a tRPC procedure: @vercel/blob/client's
// upload() helper POSTs here with its own fixed request/response contract.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
          throw new Error("Admin access required.");
        }
        if (!pathname.startsWith("product-images/")) {
          throw new Error("Invalid upload path.");
        }
        return {
          allowedContentTypes: [
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/avif",
            "image/gif",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 10 * 1024 * 1024,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
