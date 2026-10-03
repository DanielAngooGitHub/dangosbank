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

    const userId = String(body.userId ?? "").trim();

    if (!email || !accountNumber || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing registration information.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("applications")
      .update({
        user_id: userId,
        online_banking_registered: true,
      })
      .eq("email", email)
      .eq("account_number", accountNumber)
      .eq("status", "approved")
      .select("id, application_number, account_number")
      .single();

    if (error || !data) {
      console.error("Registration link error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Could not link the online banking account.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Complete registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not complete registration.",
      },
      { status: 500 }
    );
  }
}