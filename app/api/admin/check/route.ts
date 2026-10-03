import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          authorized: false,
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
    } =
      await supabaseAdmin.auth.getUser(
        accessToken
      );

    if (userError || !user) {
      return NextResponse.json(
        {
          authorized: false,
        },
        {
          status: 401,
        }
      );
    }

    const { data: adminRecord, error } =
      await supabaseAdmin
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error || !adminRecord) {
      return NextResponse.json(
        {
          authorized: false,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json({
      authorized: true,
      role: adminRecord.role,
    });
  } catch (error) {
    console.error(
      "Admin authorization error:",
      error
    );

    return NextResponse.json(
      {
        authorized: false,
      },
      {
        status: 500,
      }
    );
  }
}