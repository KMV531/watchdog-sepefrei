"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor } from "@/lib/type";
import {
  TrendingUpIcon,
  ActivityIcon,
  AlertCircleIcon,
  GlobeIcon,
  ClockIcon,
} from "lucide-react";

export function SectionCards({ monitors = [] }: { monitors: Monitor[] }) {
  // 3. Sécurité supplémentaire : si ce n'est pas un tableau, on ne crash pas
  if (!Array.isArray(monitors)) {
    return null;
  }

  const totalSites = monitors.length;

  // Maintenant TypeScript reconnaît 'lastStatus'
  const downSites = monitors.filter((m) => m.lastStatus === "DOWN").length;

  const avgLatency =
    totalSites > 0
      ? Math.round(
          monitors.reduce((acc, m) => acc + (m.lastLatency || 0), 0) /
            totalSites,
        )
      : 0;

  const uptime =
    totalSites > 0
      ? (((totalSites - downSites) / totalSites) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Uptime Global */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Uptime Global</CardDescription>
          <CardTitle className="text-2xl font-semibold text-green-500">
            {uptime}%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <TrendingUpIcon className="size-3 mr-1" /> Stable
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <ActivityIcon className="size-4 mr-2" /> Disponibilité en temps réel
        </CardFooter>
      </Card>

      {/* Alertes Actives */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Incidents Actifs</CardDescription>
          <CardTitle
            className={`text-2xl font-semibold ${downSites > 0 ? "text-red-500" : ""}`}
          >
            {downSites}
          </CardTitle>
          <CardAction>
            {downSites > 0 && <Badge variant="destructive">Critique</Badge>}
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <AlertCircleIcon className="size-4 mr-2" />{" "}
          {downSites === 0 ? "Aucune panne détectée" : "Services hors-ligne"}
        </CardFooter>
      </Card>

      {/* Latence Moyenne */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Latence Moyenne</CardDescription>
          <CardTitle className="text-2xl font-semibold">
            {avgLatency} ms
          </CardTitle>
          <CardAction>
            <ClockIcon className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Temps de réponse moyen des services
        </CardFooter>
      </Card>

      {/* Total Services */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Services Surveillés</CardDescription>
          <CardTitle className="text-2xl font-semibold">{totalSites}</CardTitle>
          <CardAction>
            <GlobeIcon className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Nombre de domaines enregistrés
        </CardFooter>
      </Card>
    </div>
  );
}
