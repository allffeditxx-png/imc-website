import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const repo = process.env.GITHUB_REPO || "allffeditxx-png/imc-web";
const branch = process.env.GITHUB_BRANCH || "main";
const token = process.env.GITHUB_TOKEN;
const fileUrl = `https://api.github.com/repos/${repo}/contents/data/rubrics.json`;

function githubHeaders() {
  if (!token) {
    throw new Error("GITHUB_TOKEN is missing from the server environment.");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

async function readRubrics() {
  const response = await fetch(
    `${fileUrl}?ref=${encodeURIComponent(branch)}`,
    {
      headers: githubHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `GitHub read failed: HTTP ${response.status} ${await response.text()}`
    );
  }

  const file = await response.json();
  const content = Buffer.from(file.content, "base64").toString("utf8");

  return JSON.parse(content);
}

export async function GET() {
  try {
    const rubrics = await readRubrics();

    return NextResponse.json(
      { success: true, rubrics },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to load rubrics from GitHub:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load rubrics from GitHub.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid rubric data." },
        { status: 400 }
      );
    }

    const headers = githubHeaders();
    const content = Buffer.from(
      JSON.stringify(body, null, 2),
      "utf8"
    ).toString("base64");

    let lastError = "";

    for (let attempt = 1; attempt <= 3; attempt++) {
      const current = await fetch(
        `${fileUrl}?ref=${encodeURIComponent(branch)}`,
        { headers, cache: "no-store" }
      );

      let sha: string | undefined;

      if (current.ok) {
        sha = (await current.json()).sha;
      } else if (current.status !== 404) {
        throw new Error(
          `GitHub file lookup failed: HTTP ${current.status} ${await current.text()}`
        );
      }

      const payload: {
        message: string;
        content: string;
        branch: string;
        sha?: string;
      } = {
        message: "Update ranked rubrics",
        content,
        branch,
      };

      if (sha) payload.sha = sha;

      const response = await fetch(fileUrl, {
        method: "PUT",
        headers,
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Rubrics saved successfully.",
          rubrics: body,
        });
      }

      lastError = await response.text();

      if (
        (response.status === 409 || response.status === 422) &&
        attempt < 3
      ) {
        continue;
      }

      throw new Error(
        `GitHub save failed: HTTP ${response.status} ${lastError}`
      );
    }

    throw new Error(`GitHub save failed after retries: ${lastError}`);
  } catch (error) {
    console.error("Failed to save rubrics to GitHub:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save rubrics.",
      },
      { status: 500 }
    );
  }
}
