import { readDB, writeDB } from "@/lib/db";
import { Log, Monitor } from "@/lib/type";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const db = readDB();

    //1. On filtre les moniteurs pour enlever celui qui correspond a l'ID
    db.monitors = db.monitors.filter((m: Monitor) => m.id !== id);

    //2. On filtre aussi les logs pour netoyer l'historique
    db.logs = db.logs.filter((log: Log) => log.monitorId !== id);

    writeDB(db);

    return NextResponse.json({ message: "Supprimé avec succès" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}
