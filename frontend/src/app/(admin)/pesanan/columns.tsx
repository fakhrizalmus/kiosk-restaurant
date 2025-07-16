"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import moment from "moment"

export type Pesanan = {
  id: number;
  no_table: string;
  createdAt: string;
  status: string;
};

export function getColumns (

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
              <Button variant="ghost" className="h-8 w-fit p-2" style={{ backgroundColor: "var(--primary)" }}>
                Detail
              </Button>
            )
          },
        },
    ];
} 
