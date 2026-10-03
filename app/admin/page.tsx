"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Application = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  application_number: string | null;
  account_number: string | null;
  account_type: string | null;
  status: string | null;
  balance: number | null;
  created_at: string;
};

type Transaction = {
  id: string;
  account_number: string;
  transaction_type: string;
  description: string | null;
  amount: number;
  transaction_date: string;
};

export default function AdminDashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [
    applications,
    setApplications,
  ] = useState<Application[]>([]);

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    async function loadAdminDashboard() {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "/api/admin/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        }
      );

      if (
        response.status === 401
      ) {
        router.push("/login");
        return;
      }

      if (
        response.status === 403
      ) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const result =
        await response.json();

      if (!response.ok) {
        console.error(result);
        setLoading(false);
        return;
      }

      setApplications(
        result.applications ?? []
      );

      setTransactions(
        result.transactions ?? []
      );

      setAuthorized(true);
      setLoading(false);
    }

    loadAdminDashboard();
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  const totalCustomers =
    useMemo(() => {

      const customers =
        new Set(
          applications
            .map(
              (item) =>
                item.email
            )
            .filter(Boolean)
        );

      return customers.size;

    }, [applications]);

  const totalAccounts =
    applications.filter(
      (application) =>
        application.account_number
    ).length;

  const totalBalance =
    applications.reduce(
      (total, application) =>
        total +
        Number(
          application.balance ?? 0
        ),
      0
    );

  const filteredApplications =
    applications.filter(
      (application) => {

        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        const name =
          `${
            application.first_name ??
            ""
          } ${
            application.last_name ??
            ""
          }`
            .trim()
            .toLowerCase();

        return (
          name.includes(query) ||

          (
            application.email ??
            ""
          )
            .toLowerCase()
            .includes(query) ||

          (
            application.account_number ??
            ""
          )
            .toLowerCase()
            .includes(query) ||

          (
            application.application_number ??
            ""
          )
            .toLowerCase()
            .includes(query)
        );
      }
    );

  function formatMoney(
    value:
      | number
      | string
      | null
  ) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(
      Number(value ?? 0)
    );
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">

        <p className="text-slate-600">
          Checking administrator access...
        </p>

      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

        <div className="bg-white border rounded-2xl shadow-sm p-10 max-w-lg w-full text-center">

          <div className="text-4xl mb-4">
            🔒
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Access Denied
          </h1>

          <p className="text-slate-600 mb-8">
            Your DangosBank account does
            not have administrator access.
          </p>

          <a
            href="/dashboard"
            className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Return to Customer Banking
          </a>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <header className="bg-slate-950 text-white">

        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              DangosBank Admin
            </h1>

            <p className="text-slate-400 mt-1">
              Administration Dashboard
            </p>

          </div>

          <button
            onClick={
              handleLogout
            }
            className="border border-slate-700 px-5 py-2 rounded-lg hover:bg-slate-900"
          >
            Sign Out
          </button>

        </div>

      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white border rounded-2xl p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Customers
            </p>

            <p className="text-3xl font-bold mt-2">
              {totalCustomers}
            </p>

          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Accounts
            </p>

            <p className="text-3xl font-bold mt-2">
              {totalAccounts}
            </p>

          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Balances
            </p>

            <p className="text-3xl font-bold mt-2">
              {formatMoney(
                totalBalance
              )}
            </p>

          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Applications
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                applications.length
              }
            </p>

          </div>

        </div>

        <div className="bg-white border rounded-2xl shadow-sm mb-10 overflow-hidden">

          <div className="p-6 border-b">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

              <div>

                <h2 className="text-2xl font-bold">
                  Customers & Accounts
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Search by customer,
                  email, account number,
                  or application number.
                </p>

              </div>

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search customer or account..."
                className="border rounded-lg px-4 py-3 w-full md:w-80"
              />

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-100 text-left">

                <tr>

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Account
                  </th>

                  <th className="px-6 py-4">
                    Type
                  </th>

                  <th className="px-6 py-4">
                    Balance
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Application
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {
                  filteredApplications.map(
                    (
                      application
                    ) => (

                      <tr
                        key={
                          application.id
                        }
                      >

                        <td className="px-6 py-5">

                          <p className="font-semibold">

                            {
                              application.first_name
                            }{" "}

                            {
                              application.last_name
                            }

                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {
                              application.email
                            }
                          </p>

                        </td>

                        <td className="px-6 py-5 font-medium">
                          {
                            application.account_number ??
                            "Not assigned"
                          }
                        </td>

                        <td className="px-6 py-5 capitalize">
                          {
                            application.account_type
                          }
                        </td>

                        <td className="px-6 py-5 font-semibold">

                          {formatMoney(
                            application.balance
                          )}

                        </td>

                        <td className="px-6 py-5">

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold capitalize">

                            {
                              application.status
                            }

                          </span>

                        </td>

                        <td className="px-6 py-5">

                          {
                            application.application_number
                          }

                        </td>

                      </tr>

                    )
                  )
                }

              </tbody>

            </table>

          </div>

        </div>

        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Recent Transactions
            </h2>

          </div>

          {
            transactions.length ===
            0 ? (

              <div className="p-10 text-center text-slate-500">

                No transactions found.

              </div>

            ) : (

              <div className="divide-y">

                {
                  transactions.map(
                    (
                      transaction
                    ) => {

                      const amount =
                        Number(
                          transaction.amount
                        );

                      return (

                        <div
                          key={
                            transaction.id
                          }
                          className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >

                          <div>

                            <p className="font-semibold">

                              {
                                transaction.description ??
                                transaction.transaction_type
                              }

                            </p>

                            <p className="text-sm text-slate-500 mt-1">

                              {
                                transaction.account_number
                              }

                              {" • "}

                              {formatDate(
                                transaction.transaction_date
                              )}

                            </p>

                          </div>

                          <p
                            className={`font-bold ${
                              amount >=
                              0
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >

                            {
                              amount >=
                              0
                                ? "+"
                                : ""
                            }

                            {formatMoney(
                              amount
                            )}

                          </p>

                        </div>

                      );
                    }
                  )
                }

              </div>

            )
          }

        </div>

      </section>

    </main>
  );
}