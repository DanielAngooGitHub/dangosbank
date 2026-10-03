"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              DangosBank
            </h1>

            <p className="text-xs text-slate-500">
              Banking made simple
            </p>
          </div>

          <a
            href="/"
            className="text-blue-700 font-semibold hover:underline"
          >
            Home
          </a>

        </div>
      </header>

      <section className="max-w-md mx-auto px-6 py-16">

        <div className="bg-white border rounded-2xl shadow-sm p-8">

          <h2 className="text-3xl font-bold mb-2">
            Welcome back
          </h2>

          <p className="text-slate-600 mb-8">
            Sign in to your DangosBank account.
          </p>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="font-semibold">
                Sign in failed
              </p>

              <p className="text-sm mt-1">
                {errorMessage}
              </p>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                required
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>

              <input
                required
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          <div className="mt-6 text-center">

            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-blue-700 font-semibold hover:underline"
              >
                Create Account
              </a>
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}