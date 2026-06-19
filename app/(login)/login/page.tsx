"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Please enter your email";
    if (!password) e.password = "Please enter your password";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrors({ form: "Invalid email or password" });
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
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
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-sm flex flex-col gap-5"
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome back
            </h2>
          </div>

          {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}

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
            {isSubmitting ? "Logging in..." : "Continue"}
          </button>
        </form>
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
