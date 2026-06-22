"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex">
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

      <div className="flex flex-1 items-center justify-center px-6 bg-white">
        <div className="w-full max-w-sm">
          {submitted ? (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Check your email
              </h2>
              <p className="text-sm text-gray-500">
                If an account exists for {email}, we&apos;ve sent a link to
                reset your password.
              </p>
              <Link
                href="/login"
                className="text-sm text-gray-700 hover:underline mt-2"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Forgot password?
                </h2>
                <p className="text-sm text-gray-500">
                  Enter your email and we&apos;ll send you a reset link
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
                    ${error ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-md transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
              </button>

              <Link
                href="/login"
                className="text-sm text-gray-500 hover:text-gray-700 text-center hover:underline"
              >
                Back to login
              </Link>
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
