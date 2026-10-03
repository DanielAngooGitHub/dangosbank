import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const accountNumber = String(body.accountNumber ?? "")
      .trim()
      .toUpperCase();

    if (!email || !accountNumber) {
      return NextResponse.json(
        {
          verified: false,
          message: "We could not verify the information provided.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("applications")
      .select(
        "id, email, account_number, status, online_banking_registered"
      )
      .eq("email", email)
      .eq("account_number", accountNumber)
      .eq("status", "approved")
      .maybeSingle();

    if (error) {
      console.error("Verification error:", error);

      return NextResponse.json(
        {
          verified: false,
          message: "We could not verify the information provided.",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          verified: false,
          message: "We could not verify the information provided.",
        },
        { status: 404 }
      );
    }

    if (data.online_banking_registered) {
      return NextResponse.json(
        {
          verified: false,
          message:
            "Online banking is already registered for this account.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      verified: true,
    });
  } catch (error) {
    console.error("Verification route error:", error);

    return NextResponse.json(
      {
        verified: false,
        message: "We could not verify the information provided.",
      },
      { status: 500 }
    );
  }
}