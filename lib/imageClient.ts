// Client-side helpers for the image upload/delete API. Images live in
// Cloudinary; only their URL is ever stored in the DB.

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "Upload failed");
  }
  return data.url as string;
}

// Best-effort deletion of a previously uploaded Cloudinary image. Failures are
// swallowed so they never block a profile save.
export async function deleteImage(url: string | null | undefined): Promise<void> {
  if (!url || !url.includes("res.cloudinary.com")) return;

  try {
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // ignore — orphaned image cleanup is not critical
  }
}
