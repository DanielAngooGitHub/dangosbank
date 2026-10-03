import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userId = String(body.userId ?? "").trim();

    const accountNumber = String(
      body.accountNumber ?? ""
    )
      .trim()
      .toUpperCase();

    const transactionType = String(
      body.transactionType ?? ""
    )
      .trim()
      .toLowerCase();

    const amount = Number(body.amount);

    const description = String(
      body.description ?? ""
    ).trim();

    if (
      !userId ||
      !accountNumber ||
      !["deposit", "withdrawal"].includes(
        transactionType
      ) ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid transaction information.",
        },
        { status: 400 }
      );
    }

    const { data, error } =
      await supabaseAdmin.rpc(
        "process_dangosbank_transaction",
        {
          p_user_id: userId,
          p_account_number: accountNumber,
          p_transaction_type:
            transactionType,
          p_amount: amount,
          p_description:
            description || null,
        }
      );

    if (error) {
      console.error(
        "Transaction error:",
        error
      );

      if (
        error.message
          .toLowerCase()
          .includes("insufficient")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Insufficient funds.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "The transaction could not be completed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Transaction route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "The transaction could not be completed.",
      },
      { status: 500 }
    );
  }
}