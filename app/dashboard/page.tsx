"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { LogDataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import initialData from "@/data/data.json";
import { useEffect, useState, useCallback } from "react";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [monitors, setMonitors] = useState<any[]>(initialData.monitors);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/monitors");
      console.log("The logs are: ", res);
      if (!res.ok) throw new Error("Erreur API");
      const updatedData = await res.json();

      setMonitors(updatedData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur de récupération:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards monitors={monitors} />

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={monitors} />
          </div>

          <LogDataTable data={monitors} />
        </div>
      </div>
    </div>
  );
}

/*
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { LogDataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import initialData from "@/data/data.json";
import { useEffect, useState, useCallback } from "react";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [monitors, setMonitors] = useState<any[]>(initialData.monitors);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/monitors");
      console.log("The logs are: ", res);
      if (!res.ok) throw new Error("Erreur API");
      const updatedData = await res.json();

      setMonitors(updatedData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur de récupération:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards monitors={monitors} />

              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={monitors} />
              </div>

              <LogDataTable data={monitors} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

*/
