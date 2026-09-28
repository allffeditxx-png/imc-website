import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const databasePath = path.join(
  process.cwd(),
  "data",
  "rubrics.json"
);

function loadRubrics() {
  if (!fs.existsSync(databasePath)) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(databasePath, "utf8")
  );
}

export async function GET() {
  try {
    const rubrics = loadRubrics();

    return NextResponse.json(
      {
        success: true,
        rubrics,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("❌ Failed to load rubrics:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load rubrics.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid rubric data.",
        },
        { status: 400 }
      );
    }

    fs.writeFileSync(
      databasePath,
      JSON.stringify(body, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      message: "Rubrics saved successfully.",
      rubrics: body,
    });
  } catch (error) {
    console.error("❌ Failed to save rubrics:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save rubrics.",
      },
      { status: 500 }
    );
  }
}
