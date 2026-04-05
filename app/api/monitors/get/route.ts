import { readDB, writeDB } from "@/lib/db";
import { Monitor } from "@/lib/type";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Lire la configuration depuis le JSON
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

          const logEntry = {
            monitorId: monitor.id,
            status: response.ok ? "UP" : "DOWN",
            code: response.status,
            message: response.statusText || (response.ok ? "OK" : "Error"),
            latency,
            timestamp: new Date().toISOString(),
          };

          return {
            ...monitor,
            lastStatus: logEntry.status,
            lastLatency: latency,
            logEntry,
          };
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Network Error";
          return {
            ...monitor,
            lastStatus: "DOWN",
            lastLatency: 0,
            logEntry: {
              monitorId: monitor.id,
              status: "DOWN",
              code: 0, // 0 indique une erreur réseau (DNS, Timeout, etc.)
              message,
              latency: 0,
              timestamp: new Date().toISOString(),
            },
          };
        }
      }),
    );

    // 4. Mise à jour de l'historique dans le fichier JSON
    const newLogs = updatedMonitors.map((m) => m.logEntry);
    db.logs = [...db.logs, ...newLogs].slice(-100);
    writeDB(db);

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
