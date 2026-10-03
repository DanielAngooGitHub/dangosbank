import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const accessToken =
      authorization.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(
      accessToken
    );

    if (userError || !user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: adminRecord,
      error: adminError,
    } = await supabaseAdmin
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError) {
      console.error(
        "Admin lookup error:",
        adminError
      );

      return NextResponse.json(
        {
          message:
            "Could not verify administrator.",
        },
        {
          status: 500,
        }
      );
    }

    if (!adminRecord) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const {
      data: applications,
      error: applicationError,
    } = await supabaseAdmin
      .from("applications")
      .select(`
        id,
        first_name,
        last_name,
        email,
        application_number,
        account_number,
        account_type,
        status,
        balance,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (applicationError) {
      console.error(
        "Applications error:",
        applicationError
      );

      return NextResponse.json(
        {
          message:
            "Could not load applications.",
        },
        {
          status: 500,
        }
      );
    }

    const {
      data: transactions,
      error: transactionError,
    } = await supabaseAdmin
      .from("transactions")
      .select(`
        id,
        account_number,
        transaction_type,
        description,
        amount,
        transaction_date
      `)
      .order("transaction_date", {
        ascending: false,
      })
      .limit(50);

    if (transactionError) {
      console.error(
        "Transactions error:",
        transactionError
      );

      return NextResponse.json(
        {
          message:
            "Could not load transactions.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      applications:
        applications ?? [],
      transactions:
        transactions ?? [],
    });
  } catch (error) {
    console.error(
      "Admin dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not load admin dashboard.",
      },
      {
        status: 500,
      }
    );
  }
}