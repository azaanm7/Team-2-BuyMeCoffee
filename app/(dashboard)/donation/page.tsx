"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Heart } from "lucide-react";
import Header from "@/app/components/Header";
import { uploadImage, deleteImage } from "@/lib/imageClient";
import { PageButtons } from "@/app/components/PageButtons";

const AMOUNTS = [1, 2, 5, 10] as const;

type Profile = {
  id: number;
  name: string;
  about: string;
  socialUrl: string;
  photo: string | null;
  coverImage: string | null;
};

type Donation = {
  id: string;
  name: string;
  avatar: string | null;
  amount: number;
  message: string;
  createdAt: string;
};

const DEFAULT_PROFILE: Profile = {
  id: 1,
  name: "Jake",
  about:
    "I'm a typical person who enjoys exploring different things. I also make music art as a hobby. Follow me along.",
  socialUrl: "https://buymeacoffee.com/spacerulz44",
  photo: null,
  coverImage: null,
};

export default function CoffeeProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Donation form
  const [amount, setAmount] = useState<number>(5);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // QR modal
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  // Cover image — picked locally, uploaded to Cloudinary only on Save.
  const [pendingCover, setPendingCover] = useState<string | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [isSavingCover, setIsSavingCover] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Profile edit modal — avatar is also uploaded only on Save.
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editSocialUrl, setEditSocialUrl] = useState("");
  const [editPhoto, setEditPhoto] = useState<string | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setProfile({
            id: data.id ?? 1,
            name: data.name ?? DEFAULT_PROFILE.name,
            about: data.about ?? DEFAULT_PROFILE.about,
            socialUrl: data.socialMediaURL ?? DEFAULT_PROFILE.socialUrl,
            photo: data.avatarImage || null,
            coverImage: data.backgroundImage ?? null,
          });
        }
      })
      .catch(() => {});
  }, []);

  const canSupport = url.trim().length > 0;

  function extractName(inputUrl: string): string {
    try {
      const normalized = inputUrl.startsWith("http")
        ? inputUrl
        : `https://${inputUrl}`;
      const parts = new URL(normalized).pathname.split("/").filter(Boolean);
      return parts[0] || "Guest";
    } catch {
      return inputUrl.trim() || "Guest";
    }
  }

  async function handleSupport() {
    if (!canSupport || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          specialMessage: message || null,
          socialURLOrBuyMeACoffee: url,
          recipientId: profile.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const newDonation: Donation = {
          id: data.id,
          name: data.donor?.username ?? extractName(url),
          avatar: data.donor?.profile?.avatarImage ?? null,
          amount: data.amount,
          message: data.specialMessage ?? "",
          createdAt: data.createdAt,
        };
        setDonations((prev) => [newDonation, ...prev]);
      }
    } catch {
      // network error — UI-д харуулахгүй
    } finally {
      setQrUrl(url);
      setUrl("");
      setMessage("");
      setAmount(5);
      setShowQR(true);
      setIsSubmitting(false);
    }
  }

  function handleQRClose() {
    setShowQR(false);
    router.push("/donation/complete");
  }

  function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploadError(null);
    setPendingCoverFile(file);
    setPendingCover(URL.createObjectURL(file));
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  async function handleCoverSave() {
    if (!pendingCoverFile || isSavingCover) return;
    setIsSavingCover(true);
    const oldCover = profile.coverImage;
    try {
      const newUrl = await uploadImage(pendingCoverFile);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          about: profile.about,
          avatarImage: profile.photo ?? "",
          socialMediaURL: profile.socialUrl,
          backgroundImage: newUrl,
        }),
      });
      if (!res.ok) {
        setCoverUploadError("Save failed — are you logged in?");
        return;
      }

      // Replace succeeded — delete the previous cover from Cloudinary.
      if (oldCover && oldCover !== newUrl) await deleteImage(oldCover);

      setProfile((prev) => ({ ...prev, coverImage: newUrl }));
      setPendingCover(null);
      setPendingCoverFile(null);
    } catch (err) {
      setCoverUploadError(
        err instanceof Error ? err.message : "Upload failed — try again.",
      );
    } finally {
      setIsSavingCover(false);
    }
  }

  function handleCoverCancel() {
    setPendingCover(null);
    setPendingCoverFile(null);
    setCoverUploadError(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  function openEditModal() {
    setEditName(profile.name);
    setEditAbout(profile.about);
    setEditSocialUrl(profile.socialUrl);
    setEditPhoto(profile.photo);
    setEditPhotoFile(null);
    setPhotoUploadError(null);
    setShowEditModal(true);
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploadError(null);
    setEditPhotoFile(file);
    setEditPhoto(URL.createObjectURL(file));
  }

  async function handleProfileSave() {
    if (isSavingProfile) return;
    setIsSavingProfile(true);
    const oldAvatar = profile.photo;
    try {
      let avatarToSave = profile.photo ?? "";
      if (editPhotoFile) {
        avatarToSave = await uploadImage(editPhotoFile);
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          about: editAbout,
          avatarImage: avatarToSave,
          socialMediaURL: editSocialUrl,
          backgroundImage: profile.coverImage,
        }),
      });
      if (!res.ok) {
        setPhotoUploadError("Save failed — are you logged in?");
        return;
      }

      // Avatar replaced — remove the old one from Cloudinary.
      if (editPhotoFile && oldAvatar && oldAvatar !== avatarToSave) {
        await deleteImage(oldAvatar);
      }

      setProfile((prev) => ({
        ...prev,
        name: editName,
        about: editAbout,
        socialUrl: editSocialUrl,
        photo: avatarToSave,
      }));
      window.dispatchEvent(new Event("profile:updated"));
      setEditPhotoFile(null);
      setShowEditModal(false);
    } catch (err) {
      setPhotoUploadError(
        err instanceof Error ? err.message : "Upload failed — try again.",
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  const activeCover = pendingCover ?? profile.coverImage;
  const displayedDonations = showAll ? donations : donations.slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <PageButtons />
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Cover */}
          <div
            className="relative h-95 w-full bg-[#40b495]"
            style={
              activeCover
                ? {
                    backgroundImage: `url(${activeCover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {coverUploadError && (
              <p className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white shadow">
                {coverUploadError}
              </p>
            )}
            {pendingCover ? (
              <div className="absolute right-6 top-6 flex gap-2">
                <button
                  onClick={handleCoverSave}
                  disabled={isSavingCover}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
                >
                  {isSavingCover ? "Saving..." : "Save changes"}
                </button>
                <button
                  onClick={handleCoverCancel}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            ) : profile.coverImage ? (
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute right-6 top-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
              >
                <Camera className="h-4 w-4" />
                Change cover
              </button>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
              >
                <Camera className="h-4 w-4" />
                Add a cover image
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverSelect}
            />
          </div>

          {/* Content */}
          <div className="relative mx-auto -mt-27.5 grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-2 z-10">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Profile card */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {profile.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold">
                        {profile.name[0]}
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-gray-900">
                      {profile.name}
                    </h2>
                  </div>
                  <button
                    onClick={openEditModal}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200"
                  >
                    Edit page
                  </button>
                </div>

                <hr className="my-5 border-gray-200" />

                <h3 className="mb-3 text-base font-bold text-gray-900">
                  About {profile.name}
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  {profile.about}
                </p>
              </section>

              {/* Social media URL card */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-base font-bold text-gray-900">
                  Social media URL
                </h3>
                <a
                  href={profile.socialUrl}
                  className="text-sm text-gray-700 hover:underline break-all"
                >
                  {profile.socialUrl}
                </a>
              </section>

              {/* Recent supporters card */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-gray-900">
                  Recent Supporters
                </h3>
                {donations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 py-12">
                    <Heart className="h-7 w-7 fill-gray-900 text-gray-900" />
                    <p className="text-base font-bold text-gray-900">
                      Be the first one to support {profile.name}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4">
                      {displayedDonations.map((d) => (
                        <div key={d.id} className="flex gap-3">
                          <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-sm font-bold text-gray-600 uppercase overflow-hidden">
                            {d.avatar ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={d.avatar}
                                alt={d.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              d.name[0]
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {d.name} bought ${d.amount} coffee
                            </p>
                            {d.message && (
                              <p className="text-sm text-gray-500 mt-0.5 wrap-break-word">
                                {d.message}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {donations.length > 3 && (
                      <button
                        onClick={() => setShowAll((v) => !v)}
                        className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition"
                      >
                        {showAll ? "See less" : "See more"}
                        <svg
                          className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Buy {profile.name} a Coffee
              </h2>

              <p className="mb-3 text-sm font-medium text-gray-900">
                Select amount:
              </p>
              <div className="mb-6 flex flex-wrap gap-3">
                {AMOUNTS.map((value) => {
                  const selected = amount === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setAmount(value)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-gray-900 bg-gray-100 text-gray-900"
                          : "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ☕ ${value}
                    </button>
                  );
                })}
              </div>

              <label className="mb-2 block text-sm font-medium text-gray-900">
                Enter BuyMeCoffee or social account URL:
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="buymeacoffee.com/"
                className="mb-5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900"
              />

              <label className="mb-2 block text-sm font-medium text-gray-900">
                Special message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please write your message here"
                rows={4}
                className="mb-6 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900"
              />

              <button
                disabled={!canSupport || isSubmitting}
                onClick={handleSupport}
                className={`w-full rounded-lg py-3 text-sm font-medium transition ${
                  canSupport && !isSubmitting
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "cursor-not-allowed bg-gray-300 text-white"
                }`}
              >
                {isSubmitting ? "Processing..." : "Support"}
              </button>
            </section>
          </div>

          {/* Edit Profile Modal */}
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    Edit profile
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-2xl leading-none text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </p>

                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Add photo
                </p>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center mb-4 hover:border-gray-400 transition group"
                >
                  {editPhoto ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={editPhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                {photoUploadError && (
                  <p className="text-xs text-red-600 mb-3">
                    {photoUploadError}
                  </p>
                )}

                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 mb-4"
                />

                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  About
                </label>
                <textarea
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 resize-y mb-4"
                />

                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Social media URL
                </label>
                <input
                  type="url"
                  value={editSocialUrl}
                  onChange={(e) => setEditSocialUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 mb-6"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={isSavingProfile}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
                  >
                    {isSavingProfile ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Modal */}
          {showQR && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
              <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
                <button
                  onClick={handleQRClose}
                  className="absolute right-4 top-4 text-2xl leading-none text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Scan QR code
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Scan the QR code to complete your donation
                </p>
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      qrUrl.startsWith("http") ? qrUrl : `https://${qrUrl}`,
                    )}`}
                    alt="QR Code"
                    width={150}
                    height={150}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
