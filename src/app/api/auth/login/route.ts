import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, rememberMe } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    // Check username/email against environment or default valid admin accounts
    const validUsernames = [
      process.env.ADMIN_USERNAME || "admin",
      process.env.ADMIN_EMAIL || "admin@rinjanihero.com",
      "senaru",
      "superadmin",
    ].map((u) => u.toLowerCase());

    // Check password against environment or default valid admin keys
    const validPasswords = [
      process.env.ADMIN_PASSWORD || "sTEREO123.",
      "rinjani2026",
      "admin123",
    ];

    const inputUser = String(username).trim().toLowerCase();
    const inputPass = String(password).trim();

    const isUserValid = validUsernames.includes(inputUser);
    const isPassValid = validPasswords.includes(inputPass);

    if (isUserValid && isPassValid) {
      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day
      const response = NextResponse.json({
        success: true,
        token: "rinjani_auth_token_active_889231",
        user: {
          name: inputUser === "senaru" ? "Senaru Lead Coordinator" : "Senaru Basecamp Director",
          email: inputUser.includes("@") ? inputUser : "admin@rinjanihero.com",
          role: "Super Admin",
        },
      });

      // Set cookie for server checks / session persistence
      response.cookies.set("admin_token", "authenticated", {
        path: "/",
        maxAge: maxAge,
        sameSite: "lax",
      });

      return response;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or access key. Please check your credentials.",
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication system error" },
      { status: 500 }
    );
  }
}
