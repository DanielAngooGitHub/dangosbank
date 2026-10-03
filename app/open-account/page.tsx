"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function OpenAccountPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(
      event.currentTarget
    );

    const application = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      dateOfBirth: formData.get("dateOfBirth"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      citizenship: formData.get("citizenship"),
      streetAddress: formData.get("streetAddress"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      country: formData.get("country"),
      accountType: formData.get("accountType"),
    };

    try {
      const response = await fetch(
        "/api/submit-application",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(application),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.message ||
            "We could not submit your application."
        );

        setLoading(false);
        return;
      }

      router.push(
        `/application-success/${result.applicationNumber}`
      );
    } catch {
      setErrorMessage(
        "We could not submit your application."
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
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            Back to Home
          </a>

        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">

        <div className="mb-8">

          <p className="text-sm font-semibold text-blue-700 mb-2">
            DangosBank Account Application
          </p>

          <h2 className="text-4xl font-bold mb-3">
            Open a new account
          </h2>

          <p className="text-slate-600">
            Complete the information below to open
            your DangosBank account.
          </p>

        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-xl p-5">
            <p className="font-bold">
              Application could not be submitted
            </p>

            <p className="text-sm mt-1">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="bg-white border rounded-2xl shadow-sm p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            <div>

              <h3 className="text-xl font-bold mb-5">
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name *
                  </label>

                  <input
                    required
                    type="text"
                    name="firstName"
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>

                  <input
                    required
                    type="text"
                    name="lastName"
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>

                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="555-123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Citizenship
                  </label>

                  <select
                    name="citizenship"
                    className="w-full border rounded-lg px-4 py-3 bg-white"
                  >
                    <option value="">
                      Select citizenship
                    </option>

                    <option value="United States">
                      United States
                    </option>

                    <option value="Ghana">
                      Ghana
                    </option>

                    <option value="Canada">
                      Canada
                    </option>

                    <option value="United Kingdom">
                      United Kingdom
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

              </div>
            </div>

            <hr />

            <div>

              <h3 className="text-xl font-bold mb-5">
                Residential Address
              </h3>

              <div className="grid md:grid-cols-2 gap-6">

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Street Address
                  </label>

                  <input
                    type="text"
                    name="streetAddress"
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ZIP Code
                  </label>

                  <input
                    type="text"
                    name="zipCode"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    defaultValue="United States"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

              </div>
            </div>

            <hr />

            <div>

              <h3 className="text-xl font-bold mb-5">
                Account Selection
              </h3>

              <label className="block text-sm font-medium mb-2">
                Account Type *
              </label>

              <select
                required
                name="accountType"
                className="w-full border rounded-lg px-4 py-3 bg-white"
              >
                <option value="">
                  Select account type
                </option>

                <option value="checking">
                  DangosBank Everyday Checking
                </option>

                <option value="savings">
                  DangosBank Smart Savings
                </option>
              </select>

            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">

              <p className="text-sm text-amber-900">
                DangosBank is an educational banking
                application. Automatic approval does not
                represent real identity verification or
                regulatory bank-account approval.
              </p>

            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-700 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-slate-400"
            >
              {loading
                ? "Opening Account..."
                : "Open DangosBank Account"}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}