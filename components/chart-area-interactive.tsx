"use client";

import { Area, AreaChart, CartesianGrid, XAxis, ReferenceLine } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Monitor } from "@/lib/type";

export function ChartAreaInteractive({ data = [] }: { data: Monitor[] }) {
  const chartData = data.map((m, index) => ({
    name: m.name,
    latency: m.lastStatus === "UP" ? m.lastLatency : 0,
    status: m.lastStatus,
    index: index,
  }));

  const chartConfig = {
    latency: {
      label: "Latence (ms)",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  const downService = data.find((m) => m.lastStatus === "DOWN");

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center border-b px-6 py-5">
        <div className="grid flex-1 gap-1.5">
          <CardTitle>Performance des Services</CardTitle>
          <CardDescription>
            {downService
              ? `Attention : ${downService.name} est actuellement hors-ligne`
              : "Tous les systèmes sont opérationnels"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-latency)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-latency)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => `Service: ${value}`}
                />
              }
            />
            <Area
              dataKey="latency"
              type="monotone"
              fill="url(#fillLatency)"
              stroke="var(--color-latency)"
              strokeWidth={2}
            />

            {data.map(
              (m, i) =>
                m.lastStatus === "DOWN" && (
                  <ReferenceLine
                    key={i}
                    x={m.name}
                    stroke="red"
                    label={{
                      position: "top",
                      value: "PANNE",
                      fill: "red",
                      fontSize: 12,
                    }}
                  />
                ),
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
