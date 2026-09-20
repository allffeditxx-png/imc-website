import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("imc_session")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        authorized: false,
      });
    }

    const session = await getSession(token);

    if (!session?.id) {
      return NextResponse.json({
        authenticated: false,
        authorized: false,
      });
    }

    const databasePath = path.join(
      process.cwd(),
      "..",
      "IMC-Tickets",
      "database",
      "webadmins.json"
    );

    const database = JSON.parse(
      await fs.readFile(databasePath, "utf8")
    );

    const authorized =
      Boolean(database[String(session.id)]);

    return NextResponse.json({
      authenticated: true,
      authorized,
      user: {
        id: session.id,
        username: session.username,
      },
    });
  } catch (error) {
    console.error("[WEBADMIN AUTH] Error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        authorized: false,
        error: "Failed to verify web admin access.",
      },
      { status: 500 }
    );
  }
}
