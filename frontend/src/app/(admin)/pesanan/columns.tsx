"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Pesanan = {
  id: number;
  product: string;
  qty: number;
  status: string;
};

export function getColumns (

): ColumnDef<Pesanan>[] {
    return [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "product", header: "Produk" },
        { accessorKey: "qty", header: "Qty" },
        { accessorKey: "status", header: "Status" },
    ];
} 
