import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const response = await fetch("http://127.0.0.1:3010/api/tierlist", {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Tierlist API unavailable." },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Tierlist proxy error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to connect to tierlist API." },
      { status: 502 }
    );
  }
}
