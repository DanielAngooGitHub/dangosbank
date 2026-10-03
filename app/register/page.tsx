"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verifiedAccountNumber, setVerifiedAccountNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function verifyAccount(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const accountNumber = String(
      formData.get("accountNumber") ?? ""
    )
      .trim()
      .toUpperCase();

    try {
      const response = await fetch(
        "/api/verify-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            accountNumber,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.verified) {
        setErrorMessage(
          result.message ||
            "We could not verify the information provided."
        );

        setLoading(false);
        return;
      }

      setVerifiedEmail(email);
      setVerifiedAccountNumber(accountNumber);
      setStep(2);
      setLoading(false);
    } catch {
      setErrorMessage(
        "We could not verify the information provided."
      );

      setLoading(false);
    }
  }

  async function createOnlineBanking(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const password = String(
      formData.get("password") ?? ""
    );

    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email: verifiedEmail,
          password,
          options: {
            data: {
              account_number:
                verifiedAccountNumber,
            },
          },
        });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        setErrorMessage(
          "The online banking user was created, but DangosBank could not link it to the bank account."
        );

        setLoading(false);
        return;
      }

      const linkResponse = await fetch(
        "/api/complete-registration",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: verifiedEmail,
            accountNumber:
              verifiedAccountNumber,
            userId,
          }),
        }
      );

      const linkResult =
        await linkResponse.json();

      if (
        !linkResponse.ok ||
        !linkResult.success
      ) {
        setErrorMessage(
          linkResult.message ||
            "Online banking registration could not be completed."
        );

        setLoading(false);
        return;
      }

      /*
        If Supabase returns a session,
        the customer is already signed in.
      */

      if (data.session) {
        router.push("/dashboard");
        return;
      }

      /*
        If email confirmation is enabled,
        Supabase may create the user
        without immediately creating a session.
      */

      router.push("/login");
    } catch {
      setErrorMessage(
        "Online banking registration could not be completed."
      );

      setLoading(false);
    }
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

          {step === 1 && (
            <>
              <p className="text-sm font-semibold text-blue-700 mb-2">
                Online Banking Registration
              </p>

              <h2 className="text-3xl font-bold mb-2">
                Verify your account
              </h2>

              <p className="text-slate-600 mb-8">
                Enter the email address used
                on your DangosBank application
                and your account number.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm font-semibold text-green-700 mb-2">
                Account Verified
              </p>

              <h2 className="text-3xl font-bold mb-2">
                Create your password
              </h2>

              <p className="text-slate-600 mb-8">
                Your account was verified.
                Create your DangosBank online
                banking password.
              </p>
            </>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              {errorMessage}
            </div>
          )}

          {step === 1 && (
            <form
              onSubmit={verifyAccount}
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
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Number
                </label>

                <input
                  required
                  name="accountNumber"
                  type="text"
                  placeholder="DB10000001"
                  className="w-full border rounded-lg px-4 py-3 uppercase"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-slate-400"
              >
                {loading
                  ? "Verifying..."
                  : "Verify Account"}
              </button>

            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={createOnlineBanking}
              className="space-y-5"
            >

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">

                <p className="text-xs text-green-700 mb-1">
                  Verified Account
                </p>

                <p className="font-semibold">
                  {verifiedAccountNumber}
                </p>

                <p className="text-sm text-slate-600 mt-1">
                  {verifiedEmail}
                </p>

              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>

                <input
                  required
                  minLength={8}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>

                <input
                  required
                  minLength={8}
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-slate-400"
              >
                {loading
                  ? "Creating Online Banking..."
                  : "Create Online Banking"}
              </button>

            </form>
          )}

          <p className="text-sm text-center mt-6 text-slate-600">
            Already registered?{" "}
            <a
              href="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Sign In
            </a>
          </p>

        </div>

      </section>

    </main>
  );
}