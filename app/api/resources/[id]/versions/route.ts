import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { cookies } from "next/headers"
import { getSession } from "@/lib/auth"

const dataPath = path.join(process.cwd(), "data", "resources.json")
const uploadPath = path.join(process.cwd(), "uploads", "resources")
const adminsPath = path.join(
  process.cwd(),
  "..",
  "IMC-Tickets",
  "database",
  "webadmins.json"
)

async function isAdmin() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("imc_session")?.value

    if (!token) return false

    const session = await getSession(token)

    if (!session?.id) return false

    const data = await fs.readFile(adminsPath, "utf8")
    const admins = JSON.parse(data)

    return Boolean(admins[String(session.id)])
  } catch {
    return false
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      )
    }

    const { id } = await params
    const formData = await request.formData()

    const minecraftVersion = formData.get("minecraftVersion")
    const file = formData.get("file")

    if (
      typeof minecraftVersion !== "string" ||
      !minecraftVersion.trim()
    ) {
      return NextResponse.json(
        { error: "Minecraft version is required." },
        { status: 400 }
      )
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A file is required." },
        { status: 400 }
      )
    }

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

    if (!Array.isArray(resource.versions)) {
      resource.versions = []
    }

    const safeVersion = minecraftVersion
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "_")

    const safeFileName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )

    const versionDirectory = path.join(
      uploadPath,
      id,
      safeVersion
    )

    await fs.mkdir(versionDirectory, {
      recursive: true,
    })

    const filePath = path.join(
      versionDirectory,
      safeFileName
    )

    const buffer = Buffer.from(await file.arrayBuffer())

    await fs.writeFile(filePath, buffer)

    const versionEntry = {
      id: crypto.randomUUID(),
      minecraftVersion: minecraftVersion.trim(),
      fileName: safeFileName,
      filePath: `/uploads/resources/${id}/${safeVersion}/${safeFileName}`,
      fileSize: file.size,
      downloads: 0,
      createdAt: new Date().toISOString(),
    }

    resource.versions.push(versionEntry)

    const tempPath = `${dataPath}.tmp`
    await fs.writeFile(
      tempPath,
      JSON.stringify(resources, null, 2)
    )
    await fs.rename(tempPath, dataPath)

    return NextResponse.json(versionEntry, {
      status: 201,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to upload version." },
      { status: 500 }
    )
  }
}
