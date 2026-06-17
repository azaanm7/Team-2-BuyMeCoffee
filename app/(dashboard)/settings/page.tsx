/* eslint-disable @next/next/no-img-element */
"use client";

import Header from "@/app/components/Header";
import { PageButtons } from "@/app/components/PageButtons";
import { useState, useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("Jake");
  const [about, setAbout] = useState(
    "I'm a typical person who enjoys exploring different things. I also make music art as a hobby. Follow me along.",
  );
  const [socialUrl, setSocialUrl] = useState(
    "https://buymeacoffee.com/baconpancakes1",
  );
  const [personalErrors, setPersonalErrors] = useState<{
    name?: string;
    about?: string;
    socialUrl?: string;
  }>({});

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [country, setCountry] = useState("United States");
  const [firstName, setFirstName] = useState("Jake");
  const [lastName, setLastName] = useState("Mulligan");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("August");
  const [year, setYear] = useState("2028");
  const [cvc, setCvc] = useState("590");
  const [paymentErrors, setPaymentErrors] = useState<{
    country?: string;
    firstName?: string;
    lastName?: string;
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
  }>({});

  const [confirmationMessage, setConfirmationMessage] = useState(
    "Thank you for supporting me! It means a lot to have your support. It's a step toward creating a more inclusive and accepting community of artists.",
  );
  const [successErrors, setSuccessErrors] = useState<{
    confirmationMessage?: string;
  }>({});

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

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePersonal())
      console.log("Personal saved", { photo, name, about, socialUrl });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword()) console.log("Password saved", { newPassword });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment())
      console.log("Payment saved", {
        country,
        firstName,
        lastName,
        cardNumber,
        month,
        year,
        cvc,
      });
  };

  const handleSuccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSuccess())
      console.log("Success page saved", { confirmationMessage });
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

  return (
    <div className="min-h-screen  bg-gray-50 font-sans">
      <Header />

      <div className="flex">
        <PageButtons />

        {/* Main content offset for fixed sidebar */}
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
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Save changes
              </button>
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

              <div className="flex flex-col gap-1.5">
                <label htmlFor="newPassword" className="text-sm text-gray-700">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
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
                  type="password"
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
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Save changes
              </button>
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
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Save changes
              </button>
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
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Save changes
              </button>
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
