import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const gamemode = formData.get("gamemode");
    const file = formData.get("file");

    if (typeof gamemode !== "string" || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Missing gamemode or file." },
        { status: 400 }
      );
    }

    if (file.type !== "image/png") {
      return NextResponse.json(
        { success: false, error: "Only PNG files are allowed." },
        { status: 400 }
      );
    }

    const allowed = [
      "CPvP",
      "Netherite Pot",
      "Pot",
      "Sword",
      "Axe",
      "Mace",
      "UHC",
      "SMP",
    ];

    if (!allowed.includes(gamemode)) {
      return NextResponse.json(
        { success: false, error: "Invalid gamemode." },
        { status: 400 }
      );
    }

    const folder = path.join(
      process.cwd(),
      "public",
      "tierlist-icons"
    );

    await fs.mkdir(folder, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(
      path.join(folder, `${gamemode}.png`),
      buffer
    );

    return NextResponse.json({
      success: true,
      url: `/tierlist-icons/${gamemode}.png`,
    });
  } catch (error) {
    console.error("Tierlist icon upload error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to upload icon." },
      { status: 500 }
    );
  }
}
