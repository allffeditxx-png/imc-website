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

export async function GET() {
  try {
    const data = await fs.readFile(dataPath, "utf8")
    return NextResponse.json(JSON.parse(data))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      )
    }

    const body = await request.json()

    const {
      name,
      description,
      category,
      edition,
      minecraftVersion,
      thumbnail,
      modLoader,
    } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required." },
        { status: 400 }
      )
    }

    if (
      category === "Mods" &&
      !["Fabric", "Forge", "NeoForge"].includes(modLoader)
    ) {
      return NextResponse.json(
        { error: "A mod loader is required for mods." },
        { status: 400 }
      )
    }

    const data = await fs.readFile(dataPath, "utf8")
    const resources = JSON.parse(data)

    const resource = {
      id: crypto.randomUUID(),
      name: String(name).trim(),
      description: description || "",
      category,
      edition: edition || "Java",
      minecraftVersion: minecraftVersion || "",
      thumbnail: thumbnail || "",
      modLoader: category === "Mods" ? modLoader : "",
      versions: [],
      downloads: 0,
      createdAt: new Date().toISOString(),
    }

    resources.push(resource)

    const tempPath = `${dataPath}.tmp`
    await fs.writeFile(
      tempPath,
      JSON.stringify(resources, null, 2)
    )
    await fs.rename(tempPath, dataPath)

    return NextResponse.json(resource, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create resource." },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      )
    }

    const body = await request.json()

    const {
      id,
      name,
      description,
      category,
      edition,
      minecraftVersion,
      thumbnail,
      modLoader,
    } = body

    if (!id || !name || !category) {
      return NextResponse.json(
        { error: "ID, name and category are required." },
        { status: 400 }
      )
    }

    if (
      category === "Mods" &&
      !["Fabric", "Forge", "NeoForge"].includes(modLoader)
    ) {
      return NextResponse.json(
        { error: "A mod loader is required for mods." },
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

    resources[index] = {
      ...resources[index],
      name: String(name).trim(),
      description: description || "",
      category,
      edition: edition || "Java",
      minecraftVersion: minecraftVersion || "",
      thumbnail: thumbnail || "",
      modLoader: category === "Mods" ? modLoader : "",
    }

    const tempPath = `${dataPath}.tmp`
    await fs.writeFile(
      tempPath,
      JSON.stringify(resources, null, 2)
    )
    await fs.rename(tempPath, dataPath)

    return NextResponse.json(resources[index])
  } catch {
    return NextResponse.json(
      { error: "Failed to update resource." },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      )
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Resource ID is required." },
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

    const filtered = resources.filter(
      (item: { id: string }) => item.id !== id
    )

    await fs.writeFile(
      dataPath,
      JSON.stringify(filtered, null, 2)
    )

    await fs.rm(
      path.join(process.cwd(), "uploads", "resources", id),
      { recursive: true, force: true }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete resource." },
      { status: 500 }
    )
  }
}
