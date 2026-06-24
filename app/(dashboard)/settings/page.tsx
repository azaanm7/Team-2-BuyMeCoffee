/* eslint-disable @next/next/no-img-element */
"use client";

import Header from "@/app/components/Header";
import { PageButtons } from "@/app/components/PageButtons";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import AccountSettingsLoading from "./loading";

const COUNTRIES = [
  "United States",
  "Australia",
  "Mongolia",
  "New Zealand",
  "United Kingdom",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = Array.from({ length: 10 }, (_, i) =>
  String(new Date().getFullYear() + i),
);

export default function AccountSettings() {
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);

  // Personal Info
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [personalErrors, setPersonalErrors] = useState<{
    name?: string;
    about?: string;
    socialUrl?: string;
  }>({});
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalSaved, setPersonalSaved] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Payment
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [paymentErrors, setPaymentErrors] = useState<{
    country?: string;
    firstName?: string;
    lastName?: string;
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
    form?: string;
  }>({});
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);

  // Success page
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [successErrors, setSuccessErrors] = useState<{
    confirmationMessage?: string;
  }>({});
  const [successSaving, setSuccessSaving] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load existing data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, cardRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/bankcard"),
        ]);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile) {
            setName(profile.name || "");
            setAbout(profile.about || "");
            setSocialUrl(profile.socialMediaURL || "");
            setPhoto(profile.avatarImage || null);
            setConfirmationMessage(profile.successMessage || "");
          }
        }

        if (cardRes.ok) {
          const card = await cardRes.json();
          if (card) {
            setCountry(card.country || "");
            setFirstName(card.firstName || "");
            setLastName(card.lastName || "");
            setCardNumber(card.cardNumber || "");
            if (card.expiryDate) {
              const d = new Date(card.expiryDate);
              setMonth(MONTHS[d.getMonth()]);
              setYear(String(d.getFullYear()));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load account data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCard = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1-")
      .replace(/-$/, "");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validatePersonal = () => {
    const e: typeof personalErrors = {};
    if (!name.trim()) e.name = "Please enter name";
    if (!about.trim()) e.about = "Please enter info about yourself";
    if (!socialUrl.trim()) e.socialUrl = "Please enter a social link";
    setPersonalErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePassword = () => {
    const e: typeof passwordErrors = {};
    if (!newPassword) e.newPassword = "Please enter a new password";
    else if (newPassword.length < 8)
      e.newPassword = "Password must be at least 8 characters";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setPasswordErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: typeof paymentErrors = {};
    if (!country) e.country = "Please select country";
    if (!firstName.trim()) e.firstName = "Please enter first name";
    if (!lastName.trim()) e.lastName = "Please enter last name";
    if (cardNumber.replace(/-/g, "").length < 16)
      e.cardNumber = "Invalid card number";
    if (!month || !year) e.expiry = "Invalid expiry date";
    if (cvc.length < 3) e.cvc = "Invalid CVC";
    setPaymentErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSuccess = () => {
    const e: typeof successErrors = {};
    if (!confirmationMessage.trim())
      e.confirmationMessage = "Please enter a confirmation message";
    setSuccessErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalSaved(false);
    if (!validatePersonal()) return;

    setPersonalSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          about,
          avatarImage: photo,
          socialMediaURL: socialUrl,
          successMessage: confirmationMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setPersonalErrors({ name: data.error || "Failed to save" });
        return;
      }

      await update({
        name,
      }); // refresh session so header shows new avatar/name
      setPersonalSaved(true);
    } finally {
      setPersonalSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(false);
    if (!validatePassword()) return;

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordErrors({ form: data.error || "Failed to update password" });
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSaved(false);
    if (!validatePayment()) return;

    setPaymentSaving(true);
    try {
      const monthIndex = String(MONTHS.indexOf(month) + 1).padStart(2, "0");

      const res = await fetch("/api/bankcard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          firstName,
          lastName,
          cardNumber: cardNumber.replace(/-/g, ""),
          month: monthIndex,
          year,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setPaymentErrors({
          form: data.error || "Failed to save payment details",
        });
        return;
      }

      setPaymentSaved(true);
    } finally {
      setPaymentSaving(false);
    }
  };

  const handleSuccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessSaved(false);
    if (!validateSuccess()) return;

    setSuccessSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          about,
          avatarImage: photo,
          socialMediaURL: socialUrl,
          successMessage: confirmationMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSuccessErrors({
          confirmationMessage: data.error || "Failed to save",
        });
        return;
      }

      setSuccessSaved(true);
    } finally {
      setSuccessSaving(false);
    }
  };

  const inputClass = (error?: string) =>
    `w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors ${
      error
        ? "border-red-400 focus:border-red-400"
        : "border-gray-300 focus:border-gray-500"
    }`;

  const selectClass = (error?: string) =>
    `w-full appearance-none border rounded-md px-3 py-2 text-sm bg-white outline-none pr-8 transition-colors ${
      error ? "border-red-400" : "border-gray-300 focus:border-gray-500"
    }`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <AccountSettingsLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <div className="flex">
        <PageButtons />

        <main className="flex flex-col px-8 py-8 min-h-screen w-screen items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            My account
          </h1>

          <div className="flex flex-col gap-4 max-w-3xl">
            {/* Personal Info */}
            <form
              onSubmit={handlePersonalSubmit}
              noValidate
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 w-3xl"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Personal Info
              </h2>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-gray-700">Add photo</span>
                <div className="relative w-20 h-20">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 block bg-gray-100"
                  >
                    {photo && (
                      <img
                        src={photo}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200 pointer-events-none">
                    <CameraIcon />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass(personalErrors.name)}
                />
                {personalErrors.name && (
                  <p className="text-xs text-red-500">{personalErrors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="about" className="text-sm text-gray-700">
                  About
                </label>
                <textarea
                  id="about"
                  rows={4}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className={`${inputClass(personalErrors.about)} resize-y`}
                />
                {personalErrors.about && (
                  <p className="text-xs text-red-500">{personalErrors.about}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="socialUrl" className="text-sm text-gray-700">
                  Social media URL
                </label>
                <input
                  id="socialUrl"
                  type="url"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  className={inputClass(personalErrors.socialUrl)}
                />
                {personalErrors.socialUrl && (
                  <p className="text-xs text-red-500">
                    {personalErrors.socialUrl}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={personalSaving}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-md transition-colors"
              >
                {personalSaving ? "Saving..." : "Save changes"}
              </button>
              {personalSaved && (
                <p className="text-xs text-green-600">Saved!</p>
              )}
            </form>

            {/* Password */}
            <form
              onSubmit={handlePasswordSubmit}
              noValidate
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Set a new password
              </h2>

              {passwordErrors.form && (
                <p className="text-xs text-red-500">{passwordErrors.form}</p>
              )}

              <div className="flex flex-col gap-1.5 ">
                <label
                  htmlFor="newPassword"
                  className="text-sm text-gray-700 relative"
                >
                  New password
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </label>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass(passwordErrors.newPassword)}
                />

                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-500">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm text-gray-700"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass(passwordErrors.confirmPassword)}
                />

                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-md transition-colors"
              >
                {passwordSaving ? "Saving..." : "Save changes"}
              </button>
              {passwordSaved && (
                <p className="text-xs text-green-600">Password updated!</p>
              )}
            </form>

            {/* Payment */}
            <form
              onSubmit={handlePaymentSubmit}
              noValidate
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Payment details
              </h2>

              {paymentErrors.form && (
                <p className="text-xs text-red-500">{paymentErrors.form}</p>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="country" className="text-sm text-gray-700">
                  Select country
                </label>
                <div className="relative">
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={selectClass(paymentErrors.country)}
                  >
                    <option value="">Select</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
                {paymentErrors.country && (
                  <p className="text-xs text-red-500">
                    {paymentErrors.country}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="firstName" className="text-sm text-gray-700">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass(paymentErrors.firstName)}
                  />
                  {paymentErrors.firstName && (
                    <p className="text-xs text-red-500">
                      {paymentErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="lastName" className="text-sm text-gray-700">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass(paymentErrors.lastName)}
                  />
                  {paymentErrors.lastName && (
                    <p className="text-xs text-red-500">
                      {paymentErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="cardNumber" className="text-sm text-gray-700">
                  Enter card number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  className={inputClass(paymentErrors.cardNumber)}
                />
                {paymentErrors.cardNumber && (
                  <p className="text-xs text-red-500">
                    {paymentErrors.cardNumber}
                  </p>
                )}
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-sm text-gray-700">Expires</span>
                  <div className="relative">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className={selectClass(
                        paymentErrors.expiry && !month
                          ? paymentErrors.expiry
                          : undefined,
                      )}
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-sm text-gray-700">Year</span>
                  <div className="relative">
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className={selectClass(
                        paymentErrors.expiry && !year
                          ? paymentErrors.expiry
                          : undefined,
                      )}
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 w-28">
                  <label htmlFor="cvc" className="text-sm text-gray-700">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                    className={inputClass(paymentErrors.cvc)}
                  />
                </div>
              </div>
              {paymentErrors.expiry && (
                <p className="text-xs text-red-500">{paymentErrors.expiry}</p>
              )}
              {paymentErrors.cvc && (
                <p className="text-xs text-red-500">{paymentErrors.cvc}</p>
              )}

              <button
                type="submit"
                disabled={paymentSaving}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-md transition-colors"
              >
                {paymentSaving ? "Saving..." : "Save changes"}
              </button>
              {paymentSaved && <p className="text-xs text-green-600">Saved!</p>}
            </form>

            {/* Success Page */}
            <form
              onSubmit={handleSuccessSubmit}
              noValidate
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
            >
              <h2 className="text-base font-semibold text-gray-900">
                Success page
              </h2>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirmationMessage"
                  className="text-sm text-gray-700"
                >
                  Confirmation message
                </label>
                <textarea
                  id="confirmationMessage"
                  rows={5}
                  value={confirmationMessage}
                  onChange={(e) => setConfirmationMessage(e.target.value)}
                  className={`${inputClass(successErrors.confirmationMessage)} resize-y`}
                />
                {successErrors.confirmationMessage && (
                  <p className="text-xs text-red-500">
                    {successErrors.confirmationMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={successSaving}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-md transition-colors"
              >
                {successSaving ? "Saving..." : "Save changes"}
              </button>
              {successSaved && <p className="text-xs text-green-600">Saved!</p>}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#555"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#888"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
