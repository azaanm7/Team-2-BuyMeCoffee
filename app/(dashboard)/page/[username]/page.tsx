"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import CoverBanner from "@/app/components/creator-page/CoverBanner";
import AboutCard from "@/app/components/creator-page/AboutCard";
import SocialUrlCard from "@/app/components/creator-page/SocialUrlCard";
import SupportersList from "@/app/components/creator-page/SupportersList";
import BuyCoffeeForm from "@/app/components/creator-page/BuyCoffeeForm";
import PaymentModal from "@/app/components/creator-page/PaymentModal";
import DonationCompleteModal from "@/app/components/creator-page/DonationCompleteModal";
import { useCreatorProfile } from "@/app/components/creator-page/UseCreatorProfile";

type PendingDonation = {
  amount: number;
  url: string;
  message: string;
};

export default function CreatorPublicPage() {
  const params = useParams<{ username: string }>();
  const { creator, supporters, loading, notFound, recordDonation } =
    useCreatorProfile(params.username);

  const [pendingDonation, setPendingDonation] =
    useState<PendingDonation | null>(null);
  const [showComplete, setShowComplete] = useState(false);

  async function handlePaymentCompleted() {
    if (!pendingDonation) return;
    await recordDonation(pendingDonation);
    setPendingDonation(null);
    setShowComplete(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (notFound || !creator) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          This creator page doesn&apos;t exist.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <CoverBanner backgroundImage={creator.backgroundImage} />

      <div className="relative mx-auto -mt-27.5 grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-2 z-10">
        <div className="flex flex-col gap-6">
          <AboutCard
            name={creator.name}
            about={creator.about ?? ""}
            avatarUrl={creator.avatarImage}
          />
          {creator.socialMediaURL && (
            <SocialUrlCard url={creator.socialMediaURL} />
          )}
          <SupportersList creatorName={creator.name} supporters={supporters} />
        </div>

        <BuyCoffeeForm
          creatorName={creator.name}
          onSubmit={setPendingDonation}
        />
      </div>

      {pendingDonation && (
        <PaymentModal
          amount={pendingDonation.amount}
          onClose={() => setPendingDonation(null)}
          onCompleted={handlePaymentCompleted}
        />
      )}

      {showComplete && (
        <DonationCompleteModal
          creatorName={creator.name}
          creatorAvatarUrl={creator.avatarImage}
          successMessage={
            creator.successMessage ?? "Thank you for your support!"
          }
          onClose={() => setShowComplete(false)}
        />
      )}
    </div>
  );
}
