import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}

      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <a href="/" className="text-3xl font-bold text-slate-900">
              DangosBank
            </a>

            <p className="text-sm text-slate-500 mt-1">
              Educational Banking Platform
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-3">

            <a
              href="/open-account"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700"
            >
              Open Account
            </a>

            <a
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700"
            >
              Customer Sign In
            </a>

            <a
              href="/admin"
              className="px-5 py-2.5 text-sm font-semibold border border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition"
            >
              Admin Portal
            </a>

          </nav>

        </div>
      </header>

      {/* HERO */}

      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}

          <div>

            <p className="text-blue-300 font-semibold mb-4">
              Welcome to DangosBank
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Simple digital banking built for learning.
            </h1>

            <p className="text-lg text-slate-300 max-w-xl mb-8">
              Open a simulated bank account, register for online
              banking, manage your account, and view your transaction
              activity through the DangosBank customer portal.
            </p>

            <div className="flex flex-wrap gap-4">

              <a
                href="/open-account"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
              >
                Open an Account
              </a>

              <a
                href="/login"
                className="border border-slate-500 hover:bg-slate-800 px-6 py-3 rounded-lg font-semibold"
              >
                Sign In
              </a>

            </div>

          </div>

          {/* RIGHT SIDE HERO IMAGE */}

          <div className="relative">

            <div className="absolute -inset-3 bg-blue-600/20 rounded-3xl blur-2xl"></div>

            <Image
              src="/images/homepage.png"
              alt="DangosBank digital banking"
              width={1672}
              height={941}
              priority
              className="relative w-full rounded-3xl shadow-2xl object-cover"
            />

          </div>

        </div>
      </section>

      {/* SERVICES */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-12">

          <p className="text-blue-700 font-semibold mb-2">
            DangosBank Services
          </p>

          <h2 className="text-4xl font-bold">
            Banking simulation made simple
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* OPEN ACCOUNT */}

          <div className="bg-white border rounded-2xl p-8 shadow-sm">

            <div className="text-3xl mb-4">
              🏦
            </div>

            <h3 className="text-xl font-bold mb-3">
              Open an Account
            </h3>

            <p className="text-slate-600 mb-6">
              Apply for a simulated checking or savings account and
              receive a DangosBank account number.
            </p>

            <a
              href="/open-account"
              className="text-blue-700 font-semibold hover:underline"
            >
              Open Account →
            </a>

          </div>

          {/* ONLINE BANKING */}

          <div className="bg-white border rounded-2xl p-8 shadow-sm">

            <div className="text-3xl mb-4">
              💻
            </div>

            <h3 className="text-xl font-bold mb-3">
              Online Banking
            </h3>

            <p className="text-slate-600 mb-6">
              Access your accounts, balances, and transaction history
              through your customer dashboard.
            </p>

            <a
              href="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Customer Sign In →
            </a>

          </div>

          {/* ADMINISTRATION */}

          <div className="bg-white border rounded-2xl p-8 shadow-sm">

            <div className="text-3xl mb-4">
              🔐
            </div>

            <h3 className="text-xl font-bold mb-3">
              Administration
            </h3>

            <p className="text-slate-600 mb-6">
              Authorized administrators can review customers,
              accounts, applications, balances, and transactions.
            </p>

            <a
              href="/admin"
              className="text-blue-700 font-semibold hover:underline"
            >
              Admin Portal →
            </a>

          </div>

        </div>

      </section>

      {/* ONLINE BANKING FEATURE */}

      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <p className="text-blue-700 font-semibold mb-3">
              Customer Banking
            </p>

            <h2 className="text-4xl font-bold mb-5">
              Manage your DangosBank account online
            </h2>

            <p className="text-slate-600 text-lg mb-8">
              Customers can view account balances, review recent
              transactions, and manage their simulated banking
              activity from the DangosBank customer dashboard.
            </p>

            <div className="space-y-4">

              <div className="flex gap-4 items-start">

                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold">
                    View Account Balances
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    See checking and savings account balances.
                  </p>
                </div>

              </div>

              <div className="flex gap-4 items-start">

                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold">
                    Review Transactions
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    View simulated deposits and withdrawals.
                  </p>
                </div>

              </div>

              <div className="flex gap-4 items-start">

                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold">
                    Secure Customer Access
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    Accounts are linked to authenticated customer profiles.
                  </p>
                </div>

              </div>

            </div>

          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">

            <p className="text-blue-300 text-sm font-semibold mb-2">
              DangosBank Online Banking
            </p>

            <h3 className="text-3xl font-bold mb-6">
              Your accounts in one place
            </h3>

            <div className="space-y-4">

              <div className="bg-slate-800 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  Available Balance
                </p>

                <p className="text-3xl font-bold mt-2">
                  $0.00
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-slate-800 rounded-xl p-5">
                  <p className="text-sm text-slate-400">
                    Accounts
                  </p>

                  <p className="text-2xl font-bold mt-2">
                    1
                  </p>
                </div>

                <div className="bg-slate-800 rounded-xl p-5">
                  <p className="text-sm text-slate-400">
                    Online Banking
                  </p>

                  <p className="text-green-400 font-bold mt-2">
                    Active
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ADMIN SECTION */}

      <section className="bg-slate-100 border-y">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          <div>

            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Bank Administration
            </p>

            <h2 className="text-3xl font-bold mt-2">
              DangosBank Admin Portal
            </h2>

            <p className="text-slate-600 mt-3 max-w-2xl">
              Authorized administrators can securely review customer
              accounts, balances, applications, and transaction
              activity.
            </p>

          </div>

          <a
            href="/admin"
            className="bg-slate-900 text-white px-7 py-3 rounded-lg font-semibold hover:bg-slate-800 text-center"
          >
            Go to Admin Portal
          </a>

        </div>
      </section>

      {/* EDUCATIONAL DISCLAIMER */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">

          <h3 className="font-bold text-amber-900 mb-2">
            Educational Project
          </h3>

          <p className="text-sm text-amber-900">
            DangosBank is an educational banking simulation. It is
            not a real financial institution. Account balances,
            deposits, withdrawals, approvals, and transactions shown
            on this website do not represent real money or real
            banking activity.
          </p>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="bg-slate-950 text-slate-400">

        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <p className="text-white font-bold text-lg">
              DangosBank
            </p>

            <p className="text-sm mt-1">
              Educational Banking Platform
            </p>

          </div>

          <div className="flex flex-wrap gap-5 text-sm">

            <a
              href="/open-account"
              className="hover:text-white"
            >
              Open Account
            </a>

            <a
              href="/login"
              className="hover:text-white"
            >
              Customer Login
            </a>

            <a
              href="/admin"
              className="hover:text-white"
            >
              Admin Portal
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}