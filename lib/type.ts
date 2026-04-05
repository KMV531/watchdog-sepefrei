export interface Monitor {
  id: string;
  name: string;
  url: string;
  lastStatus?: "UP" | "DOWN";
  lastLatency?: number;
  frequency?: number;
}

export interface Log {
  monitorId: number;
}
