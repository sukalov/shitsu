import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/getImage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const storageId = url.searchParams.get("storageId");

    if (!storageId) {
      return new Response("Missing storageId", { status: 400 });
    }

    // Storage IDs are immutable, so using the storageId as an ETag is safe.
    const etag = `"${storageId}"`;
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const blob = await ctx.storage.get(storageId as Id<"_storage">);
    if (blob === null) {
      return new Response("Image not found", { status: 404 });
    }

    return new Response(blob, {
      headers: {
        "Content-Type": blob.type || "application/octet-stream",
        ETag: etag,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }),
});

export default http;
