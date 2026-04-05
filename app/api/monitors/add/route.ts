import { readDB, writeDB } from "@/lib/db";
import { Monitor } from "@/lib/type";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, url } = await req.json();

    if (!name || !url) {
      return NextResponse.json({ error: "Nom et URL requis" }, { status: 400 });
    }

    const db = readDB();

    // Vérification de doublon
    const exists = db.monitors.some((m: Monitor) => m.url === url);
    if (exists) {
      return NextResponse.json(
        { error: "Ce service existe déjà" },
        { status: 400 },
      );
    }

    const newMonitor: Monitor = {
      id: (db.monitors.length + 1).toString(),
      name,
      url,
      frequency: 60,
    };

    db.monitors.push(newMonitor);
    writeDB(db);

    return NextResponse.json(newMonitor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'ajout" },
      { status: 500 },
    );
  }
}
