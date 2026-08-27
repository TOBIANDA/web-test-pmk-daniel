import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  cookieStore.delete("pmk_admin_token");

  return NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });
}

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  cookieStore.delete("pmk_admin_token");

  return NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });
}
