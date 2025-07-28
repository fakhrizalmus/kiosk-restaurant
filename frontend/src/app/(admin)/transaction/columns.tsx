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
    onStatusChange: (cartItemId: number, newStatus: "waiting" | "preparing" | "served") => Promise<void>
): ColumnDef<Pesanan>[] {
    return [
        {
            header: "No",
            cell: ({ row }) => row.index + 1,
        },
        { accessorKey: "no_table", header: "No Meja" },
        {
            accessorKey: "createdAt",
            header: "Tgl Pesanan",
            cell: ({ row }) => {
                const rawDate = row.original.createdAt;
                return moment(rawDate).format("DD MMMM YYYY HH:mm");
            },
        },
        {
            header: "Status",
            cell: ({ row }) => {
                switch (row.original.status) {
                    case 'end':
                        return 'End';
                    default:
                        return 'Ongoing';
                }
            }
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <PesananDetailDialog
                        id={Number(row.original.id)}
                        onStatusChange={onStatusChange}
                    />
                )
            },
        },
    ];
} 
