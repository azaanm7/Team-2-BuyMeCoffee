/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [socialUrl, setSocialUrl] = useState("");

  const [errors, setErrors] = useState<{
    photo?: string;
    name?: string;
    about?: string;
    socialUrl?: string;
  }>({});

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrors((prev) => ({ ...prev, photo: undefined }));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, photo: data.error || "Upload failed" }));
        return;
      }
      setPhoto(data.url);
    } catch {
      setErrors((prev) => ({ ...prev, photo: "Upload failed" }));
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!photo) e.photo = "Please enter image";
    if (!name.trim()) e.name = "Please enter name";
    if (!about.trim()) e.about = "Please enter info about yourself";
    if (!socialUrl.trim() || !/^https?:\/\/.+/.test(socialUrl))
      e.socialUrl = "Please enter a social link";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        about,
        avatarImage: photo,
        socialMediaURL: socialUrl,
      }),
    });

    if (res.ok) {
      window.dispatchEvent(new Event("profile:updated"));
      router.push("/payment");
    } else {
      await res.json();
    }
  };

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-white flex justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-sm flex flex-col gap-5"
        >
          <h1 className="text-xl font-semibold text-gray-900">
            Complete your profile page
          </h1>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-800">
              Add photo
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: 152, height: 152 }}
              className={`rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-100 transition-colors
              ${photo ? "border-transparent" : errors.photo ? "border-red-400" : "border-gray-300 hover:border-gray-400"}`}
            >
              {uploading ? (
                <span className="text-xs text-gray-500">Uploading...</span>
              ) : photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={"/camera.svg"} alt="camera" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {errors.photo && (
              <p className="text-xs text-red-500">{errors.photo}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-800"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name here"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
              ${errors.name ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="about"
              className="text-sm font-semibold text-gray-800"
            >
              About
            </label>
            <textarea
              id="about"
              rows={4}
              placeholder="Write about yourself here"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none resize-y transition-colors
              ${errors.about ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
            />
            {errors.about && (
              <p className="text-xs text-red-500">{errors.about}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="socialUrl"
              className="text-sm font-semibold text-gray-800"
            >
              Social media URL
            </label>
            <input
              id="socialUrl"
              type="url"
              placeholder="https://"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
              ${errors.socialUrl ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
            />
            {errors.socialUrl && (
              <p className="text-xs text-red-500">{errors.socialUrl}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2.5 bg-black hover:bg-gray-400 disabled:bg-gray-300 text-white text-sm font-medium rounded-md transition-colors"
          >
            {uploading ? "Uploading..." : "Continue"}
          </button>
        </form>
      </main>
    </div>
  );
}
