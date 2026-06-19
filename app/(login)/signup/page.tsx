"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      router.push("/profile");
    } catch {
      setErrors({ email: "Something went wrong, please try again" });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex">
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
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
                    ${errors.password ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
                />
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
