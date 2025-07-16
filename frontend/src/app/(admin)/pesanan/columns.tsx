"use client";

import { ColumnDef } from "@tanstack/react-table";
import moment from "moment"
import { PesananDetailDialog } from "./pesanandetail";

export type Pesanan = {
  id: number;
  no_table: string;
  createdAt: string;
  status: string;
};

export function getColumns(
  onStatusChange: (cartItemId: number, newStatus: "waiting" | "preparing" | "served") => void
): ColumnDef<Pesanan>[] {
  return [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "no_table", header: "No Meja" },
    {
      accessorKey: "createdAt",
      header: "Tgl Pesanan",
      cell: ({ row }) => {
        const rawDate = row.original.createdAt;
        return moment(rawDate).format("DD MMMM YYYY HH:mm");
      },
    },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <PesananDetailDialog
            id={Number(row.id)}
            onStatusChange={onStatusChange}
          />
        )
      },
    },
  ];
} 
