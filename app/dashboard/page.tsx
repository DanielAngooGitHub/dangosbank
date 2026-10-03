"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Account = {
  id: string;
  application_number: string | null;
  account_number: string | null;
  account_type: string | null;
  status: string | null;
  balance: number | null;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
};

type Transaction = {
  id: string;
  account_number: string;
  transaction_type: string;
  description: string | null;
  amount: number;
  transaction_date: string;
};

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactionType, setTransactionType] =
    useState<"deposit" | "withdrawal">("deposit");
  const [amount, setAmount] = useState("");

  const [transactionLoading, setTransactionLoading] =
    useState(false);

  const [transactionMessage, setTransactionMessage] =
    useState("");

  const [transactionError, setTransactionError] =
    useState("");

  async function loadDashboard() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: accountData, error: accountError } =
      await supabase
        .from("applications")
        .select(
          `
          id,
          application_number,
          account_number,
          account_type,
          status,
          balance,
          created_at,
          first_name,
          last_name
          `
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    if (accountError) {
      console.error(
        "Account loading error:",
        accountError
      );
    }

    if (accountData) {
      setAccounts(accountData);

      if (
        !selectedAccount &&
        accountData.length > 0 &&
        accountData[0].account_number
      ) {
        setSelectedAccount(
          accountData[0].account_number
        );
      }
    }

    const { data: transactionData, error: transactionLoadError } =
      await supabase
        .from("transactions")
        .select(
          `
          id,
          account_number,
          transaction_type,
          description,
          amount,
          transaction_date
          `
        )
        .eq("user_id", user.id)
        .order("transaction_date", {
          ascending: false,
        })
        .limit(10);

    if (transactionLoadError) {
      console.error(
        "Transaction loading error:",
        transactionLoadError
      );
    }

    if (transactionData) {
      setTransactions(transactionData);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleTransaction(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setTransactionLoading(true);
    setTransactionMessage("");
    setTransactionError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!selectedAccount) {
      setTransactionError(
        "Please select an account."
      );
      setTransactionLoading(false);
      return;
    }

    const transactionAmount = Number(amount);

    if (
      !Number.isFinite(transactionAmount) ||
      transactionAmount <= 0
    ) {
      setTransactionError(
        "Enter a valid transaction amount."
      );
      setTransactionLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "/api/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            accountNumber: selectedAccount,
            transactionType,
            amount: transactionAmount,
            description:
              transactionType === "deposit"
                ? "Simulated Deposit"
                : "Simulated Withdrawal",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setTransactionError(
          result.message ||
            "The transaction could not be completed."
        );

        setTransactionLoading(false);
        return;
      }

      setTransactionMessage(
        transactionType === "deposit"
          ? "Deposit completed successfully."
          : "Withdrawal completed successfully."
      );

      setAmount("");

      await loadDashboard();

      setTransactionLoading(false);
    } catch (error) {
      console.error(error);

      setTransactionError(
        "The transaction could not be completed."
      );

      setTransactionLoading(false);
    }
  }

  function formatMoney(
    value: number | string | null
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(value ?? 0));
  }

  function formatAccountType(
    type: string | null
  ) {
    if (type === "checking") {
      return "Everyday Checking";
    }

    if (type === "savings") {
      return "Smart Savings";
    }

    return "DangosBank Account";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
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
          Loading DangosBank...
        </p>
      </main>
    );
  }

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(account.balance ?? 0),
    0
  );

  const accountHolderName =
    accounts.length > 0
      ? `${accounts[0].first_name ?? ""} ${
          accounts[0].last_name ?? ""
        }`.trim()
      : "";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              DangosBank
            </h1>

            <p className="text-sm text-slate-300 mt-1">
              Customer Banking
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="border border-slate-600 px-5 py-2 rounded-lg hover:bg-slate-800"
          >
            Sign Out
          </button>

        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="mb-10">
          <p className="text-sm text-slate-500">
            Signed in as
          </p>

          <h2 className="text-3xl font-bold">
            {accountHolderName || "DangosBank Customer"}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white border rounded-2xl p-7 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">
              Total Balance
            </p>

            <p className="text-3xl font-bold">
              {formatMoney(totalBalance)}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-7 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">
              Accounts
            </p>

            <p className="text-3xl font-bold">
              {accounts.length}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-7 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">
              Online Banking
            </p>

            <p className="text-xl font-bold text-green-700">
              Active
            </p>
          </div>

        </div>

        <div className="mb-10">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

            <h3 className="text-2xl font-bold">
              My Accounts
            </h3>

            <a
              href="/open-account"
              className="bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-800 text-center"
            >
              Open New Account
            </a>

          </div>

          {accounts.length === 0 ? (

            <div className="bg-white border rounded-2xl p-10 text-center">
              <p className="text-slate-600">
                You do not have any accounts linked to this profile.
              </p>
            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-6">

              {accounts.map((account) => (

                <div
                  key={account.id}
                  className="bg-white border rounded-2xl shadow-sm p-7"
                >

                  <div className="flex items-start justify-between gap-4 mb-8">

                    <div>
                      <p className="text-sm text-slate-500">
                        {formatAccountType(
                          account.account_type
                        )}
                      </p>

                      <p className="text-xl font-bold mt-1">
                        {account.account_number ??
                          "Account number unavailable"}
                      </p>
                    </div>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                      {account.status}
                    </span>

                  </div>

                  <p className="text-sm text-slate-500 mb-2">
                    Available Balance
                  </p>

                  <p className="text-4xl font-bold mb-8">
                    {formatMoney(
                      account.balance
                    )}
                  </p>

                  <div className="border-t pt-5 flex flex-col sm:flex-row justify-between gap-5">

                    <div>
                      <p className="text-xs text-slate-500">
                        Application Number
                      </p>

                      <p className="text-sm font-semibold mt-1">
                        {account.application_number}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-slate-500">
                        Account Type
                      </p>

                      <p className="text-sm font-semibold mt-1">
                        {formatAccountType(
                          account.account_type
                        )}
                      </p>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {accounts.length > 0 && (

          <div className="bg-white border rounded-2xl shadow-sm p-7 mb-10">

            <h3 className="text-2xl font-bold mb-2">
              Simulated Transaction
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              Educational simulation only. No real money is moved.
            </p>

            {transactionMessage && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
                {transactionMessage}
              </div>
            )}

            {transactionError && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                {transactionError}
              </div>
            )}

            <form
              onSubmit={handleTransaction}
              className="grid md:grid-cols-4 gap-4"
            >

              <div>
                <label className="block text-sm font-medium mb-2">
                  Account
                </label>

                <select
                  required
                  value={selectedAccount}
                  onChange={(event) =>
                    setSelectedAccount(
                      event.target.value
                    )
                  }
                  className="w-full border rounded-lg px-4 py-3 bg-white"
                >
                  <option value="">
                    Select account
                  </option>

                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={
                        account.account_number ?? ""
                      }
                    >
                      {account.account_number}
                      {" - "}
                      {formatAccountType(
                        account.account_type
                      )}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Transaction
                </label>

                <select
                  value={transactionType}
                  onChange={(event) =>
                    setTransactionType(
                      event.target.value as
                        | "deposit"
                        | "withdrawal"
                    )
                  }
                  className="w-full border rounded-lg px-4 py-3 bg-white"
                >
                  <option value="deposit">
                    Deposit
                  </option>

                  <option value="withdrawal">
                    Withdrawal
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount
                </label>

                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div className="flex items-end">
                <button
                  disabled={
                    transactionLoading
                  }
                  type="submit"
                  className="w-full bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {transactionLoading
                    ? "Processing..."
                    : transactionType ===
                      "deposit"
                    ? "Make Deposit"
                    : "Make Withdrawal"}
                </button>
              </div>

            </form>

          </div>

        )}

        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">
            <h3 className="text-2xl font-bold">
              Recent Transactions
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Your latest simulated account activity.
            </p>
          </div>

          {transactions.length === 0 ? (

            <div className="p-12 text-center">
              <p className="text-slate-600">
                No transactions yet.
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Deposits and withdrawals will appear here.
              </p>
            </div>

          ) : (

            <div className="divide-y">

              {transactions.map((transaction) => {
                const transactionAmount =
                  Number(transaction.amount);

                const isDeposit =
                  transactionAmount >= 0;

                return (
                  <div
                    key={transaction.id}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >

                    <div>
                      <p className="font-semibold">
                        {transaction.description ??
                          transaction.transaction_type}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {transaction.account_number}
                        {" • "}
                        {formatDate(
                          transaction.transaction_date
                        )}
                      </p>
                    </div>

                    <p
                      className={`text-lg font-bold ${
                        isDeposit
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {isDeposit ? "+" : ""}
                      {formatMoney(
                        transactionAmount
                      )}
                    </p>

                  </div>
                );
              })}

            </div>

          )}

        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-sm text-amber-900">
            DangosBank is an educational banking simulation.
            Balances and transactions shown here do not represent
            real funds or real banking activity.
          </p>
        </div>

      </section>

    </main>
  );
}