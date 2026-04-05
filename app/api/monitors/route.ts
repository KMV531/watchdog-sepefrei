import { readDB, writeDB } from "@/lib/db";
import { Monitor } from "@/lib/type";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Lire la configuration depuis le JSON [cite: 41]
    const db = readDB();
    if (!db.monitors) {
      return NextResponse.json(
        { error: "Aucun moniteur trouvé" },
        { status: 404 },
      );
    }

    const monitors = db.monitors;
    const updatedMonitors = await Promise.all(
      monitors.map(async (monitor: Monitor) => {
        const start = Date.now();
        try {
          const response = await fetch(monitor.url, {
            method: "GET",
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
          });

          const latency = Date.now() - start;
          const status = response.ok ? "UP" : "DOWN";

          const logEntry = {
            monitorId: monitor.id,
            status,
            latency,
            timestamp: new Date().toISOString(),
          };

          // 3. (Optionnel mais recommandé) : Sauvegarder ce ping dans les logs du JSON
          // Pour l'instant on le prépare, on l'ajoutera à la fin du Promise.all
          return {
            ...monitor,
            lastStatus: status,
            lastLatency: latency,
            logEntry,
          };
        } catch (error) {
          return {
            ...monitor,
            lastStatus: "DOWN",
            lastLatency: 0,
            logEntry: {
              monitorId: monitor.id,
              status: "DOWN",
              latency: 0,
              timestamp: new Date().toISOString(),
            },
          };
        }
      }),
    );

    // 4. Mise à jour de l'historique dans le fichier JSON [cite: 9, 41]
    const newLogs = updatedMonitors.map((m) => m.logEntry);
    db.logs = [...db.logs, ...newLogs].slice(-100);
    writeDB(db);

    // 5. Renvoyer les données au Front
    return NextResponse.json(updatedMonitors);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur lors du scan",
      },
      {
        status: 500,
      },
    );
  }
}
