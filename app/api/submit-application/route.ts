import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const applicationNumber =
      "DBG-" +
      new Date().getFullYear() +
      "-" +
      crypto.randomUUID().split("-")[0].toUpperCase();

    const application = {
      application_number: applicationNumber,

      first_name: String(body.firstName ?? "").trim(),
      last_name: String(body.lastName ?? "").trim(),

      date_of_birth: body.dateOfBirth || null,

      email: String(body.email ?? "")
        .trim()
        .toLowerCase(),

      phone: body.phone
        ? String(body.phone).trim()
        : null,

      citizenship: body.citizenship || null,

      street_address: body.streetAddress
        ? String(body.streetAddress).trim()
        : null,

      city: body.city
        ? String(body.city).trim()
        : null,

      state: body.state
        ? String(body.state).trim()
        : null,

      zip_code: body.zipCode
        ? String(body.zipCode).trim()
        : null,

      country: body.country
        ? String(body.country).trim()
        : null,

      account_type: body.accountType || null,
    };

    if (
      !application.first_name ||
      !application.last_name ||
      !application.email ||
      !application.account_type
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("applications")
      .insert([application])
      .select(
        "application_number, account_number, status"
      )
      .single();

    if (error) {
      console.error("Application insert error:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not submit your application.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      applicationNumber: data.application_number,
      accountNumber: data.account_number,
      status: data.status,
    });
  } catch (error) {
    console.error("Application API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We could not submit your application.",
      },
      { status: 500 }
    );
  }
}