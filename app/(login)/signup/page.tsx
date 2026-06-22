"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError("");

    if (!username.trim()) {
      setUsernameError("Please enter a username");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/auth/check-username?username=${encodeURIComponent(username)}`,
      );
      const data = await res.json();

      if (!res.ok || data.taken) {
        setUsernameError("This username is already taken");
        setIsSubmitting(false);
        return;
      }

      setStep(2);
    } catch {
      setUsernameError("Something went wrong, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateAccount = () => {
    const e: typeof errors = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      e.email = "Please enter a valid email";
    if (!password || password.length < 8)
      e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAccount()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.error || "Something went wrong" });
        setIsSubmitting(false);
        return;
      }

      router.push("/createPro");
    } catch {
      setErrors({ email: "Something went wrong, please try again" });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex relative">
      {/* Top-right login button */}
      <Link
        href="/login"
        className="absolute top-5 right-6 z-10 px-4 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Log in
      </Link>

      {/* Left panel */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-amber-400 px-10">
        <div className="w-20 h-20 rounded-full bg-amber-700 flex items-center justify-center mb-6">
          <CoffeeIcon />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Fund your creative work
        </h1>
        <p className="text-sm text-gray-800 text-center max-w-xs">
          Accept support. Start a membership. Set up a shop. It&apos;s easier
          than you think.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 bg-white">
        <div className="w-full max-w-sm">
          {step === 1 ? (
            <form
              onSubmit={checkUsername}
              noValidate
              className="flex flex-col gap-5"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Create Your Account
                </h2>
                <p className="text-sm text-gray-500">
                  Choose a username for your page
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-800"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter username here"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
                    ${usernameError ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
                />
                {usernameError && (
                  <p className="text-xs text-red-500">{usernameError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-md transition-colors"
              >
                {isSubmitting ? "Checking..." : "Continue"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleCreateAccount}
              noValidate
              className="flex flex-col gap-5"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Welcome, {username}
                </h2>
                <p className="text-sm text-gray-500">
                  Connect email and set a password
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-800"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
                    ${errors.email ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-800"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password here"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
                      ${errors.password ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
                  />
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
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-md transition-colors"
              >
                {isSubmitting ? "Creating account..." : "Continue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function CoffeeIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
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
