"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  ExternalLink,
  Trash2,
} from "lucide-react";

// Schema pour les logs
export const logSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  lastStatus: z.enum(["UP", "DOWN"]),
  lastLatency: z.number(),
  latency: z.string(),
  logEntry: z.object({
    monitorId: z.string(),
    status: z.string(),
    code: z.number(),
    message: z.string(),
    latency: z.number(),
    timestamp: z.string(),
  }),
});

type Log = z.infer<typeof logSchema>;

const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "name",
    header: "Service",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "url",
    header: "Lien",
    cell: ({ row }) => {
      const url = row.original.url;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span className="max-w-37.5 truncate">{url}</span>
          <ExternalLink className="size-3" />
        </a>
      );
    },
  },
  {
    accessorKey: "lastStatus",
    header: "Statut",
    cell: ({ row }) => {
      const isUp = row.original.lastStatus === "UP";
      return (
        <Badge
          variant={isUp ? "outline" : "destructive"}
          className="gap-1.5 py-1"
        >
          {isUp ? (
            <CircleCheckIcon className="size-3.5 text-green-500" />
          ) : (
            <CircleXIcon className="size-3.5" />
          )}
          {row.original.lastStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastLatency",
    header: "Latence",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <ClockIcon className="size-3" />
        {row.original.lastLatency}ms
      </div>
    ),
  },
  {
    id: "heure",
    header: "Heure",
    cell: ({ row }) => {
      const timestamp = row.original.logEntry?.timestamp;

      if (!timestamp) return "-";

      return (
        <span className="text-muted-foreground">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      );
    },
  },
  {
    accessorKey: "logEntry.code",
    header: "Réponse",
    cell: ({ row }) => {
      const code = row.original.logEntry?.code;
      const message = row.original.logEntry?.message;

      const getCodeColor = (c: number) => {
        if (c >= 200 && c < 300) return "text-green-500";
        if (c >= 400 && c < 500) return "text-yellow-500";
        return "text-red-500";
      };

      return (
        <div className="flex flex-col">
          <span className={`font-mono font-bold ${getCodeColor(code)}`}>
            {code === 0 ? "ERR" : code}
          </span>
          <span className="text-[10px] text-muted-foreground truncate max-w-25">
            {message}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onDelete?: (id: string) => void };
      const serviceName = row.original.name;

      return (
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:cursor-pointer"
            >
              <Trash2 className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer {serviceName} ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera le moniteur ainsi
                que tout l&apos;historique des logs associés de nos serveurs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={"hover:cursor-pointer"}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:cursor-pointer text-white"
                onClick={() => meta?.onDelete?.(row.original.id)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

export function LogDataTable({
  data,
  onRefresh,
}: {
  data: Log[];
  onRefresh: () => void;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/monitors/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onDelete: handleDelete,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrer un service..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Total : {data.length} entrées
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun log trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
