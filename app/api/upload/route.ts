import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function configureCloudinary(): boolean {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    console.error(
      "[upload] Missing Cloudinary env vars. Set CLOUDINARY_CLOUD_NAME, " +
        "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env and restart " +
        "the dev server.",
    );
    return false;
  }

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  return true;
}

// Turns a Cloudinary secure_url back into its public_id (folder + name, no
// version prefix, no extension) so it can be deleted.
function extractPublicId(url: string): string | null {
  try {
    const parts = new URL(url).pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return null;

    let rest = parts.slice(uploadIdx + 1);
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);
    if (rest.length === 0) return null;

    return rest.join("/").replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (!configureCloudinary()) {
    return NextResponse.json(
      { error: "Image upload is not configured on the server." },
      { status: 500 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "buymecoffee/avatars",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("[upload] Cloudinary error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!configureCloudinary()) {
    return NextResponse.json(
      { error: "Image upload is not configured on the server." },
      { status: 500 },
    );
  }

  const { url } = await req.json().catch(() => ({ url: null }));
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "No url provided" }, { status: 400 });
  }

  const publicId = extractPublicId(url);
  if (!publicId) {
    return NextResponse.json(
      { error: "Could not parse Cloudinary url" },
      { status: 400 },
    );
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("[upload] Cloudinary delete error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
