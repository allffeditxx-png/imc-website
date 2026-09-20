import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const dataPath = path.join(
  process.cwd(),
  "data",
  "resources.json"
)

const uploadPath = path.join(
  process.cwd(),
  "uploads",
  "resources"
)

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
      versionId: string
    }>
  }
) {
  try {
    const { id, versionId } = await params

    const data = await fs.readFile(dataPath, "utf8")
    const resources = JSON.parse(data)

    const resource = resources.find(
      (item: { id: string }) => item.id === id
    )

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found." },
        { status: 404 }
      )
    }

    const version = resource.versions?.find(
      (item: { id: string }) => item.id === versionId
    )

    if (!version) {
      return NextResponse.json(
        { error: "Version not found." },
        { status: 404 }
      )
    }

    const filePath = path.join(
      uploadPath,
      id,
      version.minecraftVersion
        .trim()
        .replace(/[^a-zA-Z0-9._-]/g, "_"),
      version.fileName
    )

    const file = await fs.readFile(filePath)

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type":
          "application/octet-stream",
        "Content-Disposition": `attachment; filename="${version.fileName}"`,
        "Content-Length": String(file.length),
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "File not found." },
      { status: 404 }
    )
  }
}
