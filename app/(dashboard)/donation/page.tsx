"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { uploadImage, deleteImage } from "@/lib/imageClient";
import { PageButtons } from "@/app/components/PageButtons";
import { CoverSection } from "./_components/CoverSection";
import { ProfileCard } from "./_components/ProfileCard";
import { SocialMediaCard } from "./_components/SocialMediaCard";
import { RecentSupporters } from "./_components/RecentSupporters";
import { DonationForm } from "./_components/DonationForm";
import { EditProfileModal } from "./_components/EditProfileModal";
import { QRModal } from "./_components/QRModal";
import { DEFAULT_PROFILE } from "./_components/types";
import type { Profile, Donation } from "./_components/types";

export default function CoffeeProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showAll, setShowAll] = useState(false);

  const [amount, setAmount] = useState<number>(5);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  const [pendingCover, setPendingCover] = useState<string | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [isSavingCover, setIsSavingCover] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
      .catch(() => {})
      .finally(() => setProfileLoading(false));
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
      // network error
    } finally {
      setQrUrl(url);
      setUrl("");
      setMessage("");
      setAmount(5);
      setShowQR(true);
      setIsSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <PageButtons />
        <div className="flex-1 min-w-0 flex flex-col">
          <CoverSection
            activeCover={activeCover}
            savedCoverImage={profile.coverImage}
            pendingCover={pendingCover}
            isSavingCover={isSavingCover}
            isLoading={profileLoading}
            coverUploadError={coverUploadError}
            coverInputRef={coverInputRef}
            onCoverSelect={handleCoverSelect}
            onCoverSave={handleCoverSave}
            onCoverCancel={handleCoverCancel}
          />

          <div className="relative mx-auto -mt-27.5 grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-2 z-10">
            <div className="flex flex-col gap-6">
              <ProfileCard profile={profile} isLoading={profileLoading} onEditClick={openEditModal} />
              <SocialMediaCard socialUrl={profile.socialUrl} isLoading={profileLoading} />
              <RecentSupporters
                donations={donations}
                profileName={profile.name}
                isLoading={profileLoading}
                showAll={showAll}
                onToggleShowAll={() => setShowAll((v) => !v)}
              />
            </div>

            <DonationForm
              profileName={profile.name}
              amount={amount}
              url={url}
              message={message}
              isSubmitting={isSubmitting}
              isLoading={profileLoading}
              canSupport={canSupport}
              onAmountChange={setAmount}
              onUrlChange={setUrl}
              onMessageChange={setMessage}
              onSupport={handleSupport}
            />
          </div>

          {showEditModal && (
            <EditProfileModal
              editName={editName}
              editAbout={editAbout}
              editSocialUrl={editSocialUrl}
              editPhoto={editPhoto}
              photoUploadError={photoUploadError}
              isSavingProfile={isSavingProfile}
              photoInputRef={photoInputRef}
              onClose={() => setShowEditModal(false)}
              onPhotoSelect={handlePhotoSelect}
              onNameChange={setEditName}
              onAboutChange={setEditAbout}
              onSocialUrlChange={setEditSocialUrl}
              onSave={handleProfileSave}
            />
          )}

          {showQR && (
            <QRModal
              qrUrl={qrUrl}
              onClose={() => {
                setShowQR(false);
                router.push("/donation/complete");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
