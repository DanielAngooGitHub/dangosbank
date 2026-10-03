import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function ApplicationSuccessPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;

  const decodedNumber =
    decodeURIComponent(number);

  const { data: application } =
    await supabaseAdmin
      .from("applications")
      .select(
        "application_number, account_number, status, account_type"
      )
      .eq(
        "application_number",
        decodedNumber
      )
      .maybeSingle();

  if (!application) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="bg-white border rounded-2xl p-10 text-center">

          <h1 className="text-2xl font-bold mb-3">
            Application Not Found
          </h1>

          <a
            href="/"
            className="text-blue-700 font-semibold"
          >
            Return to DangosBank
          </a>

        </div>

      </main>
    );
  }

  const displayAccountType =
    application.account_type === "checking"
      ? "DangosBank Everyday Checking"
      : application.account_type === "savings"
      ? "DangosBank Smart Savings"
      : "DangosBank Account";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-5">

          <h1 className="text-2xl font-bold">
            DangosBank
          </h1>

          <p className="text-xs text-slate-500">
            Banking made simple
          </p>

        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-20">

        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">

          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">

            <span className="text-green-700 text-3xl">
              ✓
            </span>

          </div>

          <h2 className="text-3xl font-bold mb-3">
            Application Submitted
          </h2>

          <p className="text-slate-600 mb-8">
            Your DangosBank account has been created successfully.
          </p>

          <div className="bg-slate-50 border rounded-xl overflow-hidden mb-8">

            <div className="p-6 border-b">

              <p className="text-sm text-slate-500 mb-2">
                Application Number
              </p>

              <p className="text-2xl font-bold tracking-wide">
                {application.application_number}
              </p>

            </div>

            <div className="p-6 border-b">

              <p className="text-sm text-slate-500 mb-2">
                Account Number
              </p>

              <p className="text-2xl font-bold tracking-wide">
                {application.account_number}
              </p>

            </div>

            <div className="p-6 border-b">

              <p className="text-sm text-slate-500 mb-2">
                Account Type
              </p>

              <p className="font-semibold">
                {displayAccountType}
              </p>

            </div>

            <div className="p-6">

              <p className="text-sm text-slate-500 mb-2">
                Account Status
              </p>

              <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                {application.status}
              </span>

            </div>

          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">

            <p className="font-semibold text-blue-900 mb-1">
              Set up Online Banking
            </p>

            <p className="text-sm text-blue-800">
              Use your email address and account number
              to create your DangosBank online banking login.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <a
              href="/register"
              className="bg-blue-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-800"
            >
              Register for Online Banking
            </a>

            <a
              href="/"
              className="border px-7 py-3 rounded-lg font-semibold hover:bg-slate-50"
            >
              Return Home
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}