// page.tsx
"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { getProduct } from "../actions"
import { CardTitle } from "@/components/ui/card"
import { columns } from "./columns"

export default function Page() {
  const [product, setProduct] = useState<any[]>([]);
  const [countProduct, setCountProduct] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageIndex, setPageIndex] = useState<number>(0)

  useEffect(() => {
    const fetchProduk = async () => {
      const res = await getProduct({
        row: pageSize,
        page: pageIndex
      })
      setProduct(res.data.rows);
      setCountProduct(res.data.count);
    }

    fetchProduk();
  }, [pageIndex, pageSize])
  return (
    <div className="flex flex-1 flex-col px-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Data Pengeluaran
        </CardTitle>
        <DataTable
            columns={columns}
            data={product}
            count={countProduct}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize} />
      </div>
    </div>
  )
}