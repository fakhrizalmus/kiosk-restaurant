"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"

export type Role = {
  id: number
  role: string,
  permission: string
}

export function getColumns(
  setSelectedIdToDelete: (id: number) => void,
  setSelectedIdToEdit: (id: number) => void
): ColumnDef<Role>[] {
  return [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="bg-red-500 hover:bg-red-600 focus:bg-red-600 text-white"
                onClick={() => setSelectedIdToDelete(payment.id)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem className="bg-green-500 hover:bg-green-600 focus:bg-green-600 text-white mt-2"
                onClick={() => setSelectedIdToEdit(payment.id)}>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
