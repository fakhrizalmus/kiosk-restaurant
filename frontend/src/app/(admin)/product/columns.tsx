"use client"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
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

export type Product = {
  id: number
  price: number
  name: string
  image: string
  Category: {
    id: number
    name: number
  }
}

export function getColumns (
  setSelectedIdToDelete: (id: number) => void,
  setSelectedIdToEdit: (id: number) => void
): ColumnDef<Product>[] {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
          const imageName = row.getValue("image") as string
          const imageUrl = `${process.env.NEXT_PUBLIC_API_UPLOAD}/images/${imageName}`
          return (
            <img
              src={imageUrl}
              alt="product image"
              className="w-16 h-16 object-cover rounded-md border"
            />
          )
        }
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "kategori_name",
        header: "Kategori Name",
        cell: ({ row }) => <div>{row.original.Category?.name}</div>,
      },
      {
        accessorKey: "price",
        header: () => <div className="text-right">Harga</div>,
        cell: ({ row }) => {
          const price = parseFloat(row.getValue("price"))
          const formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(price)

          return <div className="text-right font-medium">{formatted}</div>
        },
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
                {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id.toString())}>
                  Copy payment ID
                </DropdownMenuItem> */}
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
  
