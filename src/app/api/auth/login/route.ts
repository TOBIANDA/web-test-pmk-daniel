import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "https://pmkdaniel-api.danielmemory26.workers.dev";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    // Forward login request to backend API
    let backendRes: Response | null = null;
    let data: any = null;

    try {
      backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: String(username).trim(),
          password: String(password),
        }),
      });

      if (backendRes.ok) {
        data = await backendRes.json();
      } else {
        const errData = await backendRes.json().catch(() => ({}));
        return NextResponse.json(
          {
            success: false,
            message: errData.message || errData.detail || "Username atau kata sandi salah",
          },
          { status: backendRes.status || 401 }
        );
      }
    } catch (networkErr: any) {
      console.warn("Backend login connection warning:", networkErr.message);
      // If backend is currently in development / mock mode, check fallback credentials securely
      const devAdminUser = process.env.DEV_ADMIN_USER || "admin";
      const devAdminPass = process.env.DEV_ADMIN_PASSWORD || "pmkdaniel2026";

      if (
        process.env.NODE_ENV !== "production" &&
        username.trim() === devAdminUser &&
        password === devAdminPass
      ) {
        const dummyToken = `pmk_mock_jwt_${Date.now()}`;
        data = {
          success: true,
          data: {
            token: dummyToken,
            user: { username: "admin", role: "superadmin" },
          },
        };
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Tidak dapat terhubung ke server backend autentikasi.",
          },
          { status: 503 }
        );
      }
    }

    const token = data?.data?.token || data?.token;
    if (!token) {
      return NextResponse.json(
        { success: false, message: data?.message || "Gagal mendapatkan token autentikasi" },
        { status: 401 }
      );
    }

    // Set secure HttpOnly cookie for Next.js Middleware route guard
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set({
      name: "pmk_admin_token",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      token: token,
      data: {
        token: token,
        user: data?.data?.user || { username },
      },
    });
  } catch (error: any) {
    console.error("Auth login route error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server autentikasi" },
      { status: 500 }
    );
  }
}
