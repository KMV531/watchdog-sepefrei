import { readDB, writeDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, url } = await req.json();

    // Validation simple
    if (!name || !url) {
      return NextResponse.json({ error: "Nom et URL requis" }, { status: 400 });
    }

    const db = readDB();

    // Vérification de doublon (Optionnel mais recommandé)
    const exists = db.monitors.some((m: any) => m.url === url);
    if (exists) {
      return NextResponse.json(
        { error: "Ce service existe déjà" },
        { status: 400 },
      );
    }

    // Génération automatique des données
    const newMonitor = {
      id: (db.monitors.length + 1).toString(), // Incrémentation simple
      name,
      url,
      frequency: 60, // Fréquence par défaut
    };

    // Mise à jour de la DB
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
