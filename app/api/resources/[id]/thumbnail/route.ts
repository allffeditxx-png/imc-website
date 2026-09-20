import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { cookies } from "next/headers"
import { getSession } from "@/lib/auth"

const dataPath = path.join(process.cwd(), "data", "resources.json")
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
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A thumbnail file is required." },
        { status: 400 }
      )
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Thumbnail must be an image." },
        { status: 400 }
      )
    }

    const data = await fs.readFile(dataPath, "utf8")
    const resources = JSON.parse(data)

    const index = resources.findIndex(
      (item: { id: string }) => item.id === id
    )

    if (index === -1) {
      return NextResponse.json(
        { error: "Resource not found." },
        { status: 404 }
      )
    }

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg"

    const directory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "resources",
      id
    )

    await fs.mkdir(directory, { recursive: true })

    const fileName = `thumbnail.${extension}`
    const filePath = path.join(directory, fileName)

    await fs.writeFile(
      filePath,
      Buffer.from(await file.arrayBuffer())
    )

    resources[index].thumbnail =
      `/uploads/resources/${id}/${fileName}`

    const tempPath = `${dataPath}.tmp`
    await fs.writeFile(
      tempPath,
      JSON.stringify(resources, null, 2)
    )
    await fs.rename(tempPath, dataPath)

    return NextResponse.json({
      thumbnail: resources[index].thumbnail,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to upload thumbnail." },
      { status: 500 }
    )
  }
}
