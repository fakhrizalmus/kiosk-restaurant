"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { deleteProduct, getProduct } from "../actions"
import { CardTitle } from "@/components/ui/card"
import AddModal from "./addmodal"

export default function Page() {
  const [product, setProduct] = useState<any[]>([]);
  const [countProduct, setCountProduct] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageIndex, setPageIndex] = useState<number>(0)

  const fetchProduk = async () => {
    const res = await getProduct({
      row: pageSize,
      page: pageIndex * pageSize
    })
    setProduct(res.data.rows);
    setCountProduct(res.data.count);
  }

  useEffect(() => {
    fetchProduk();
  }, [pageIndex, pageSize]);

  const handleDelete = async (id: number) => {
    try {
        await deleteProduct(id)
        const res = await getProduct({
            row: pageSize,
            page: pageIndex * pageSize
        })
        setProduct(res.data.rows);
        setCountProduct(res.data.count)
    } catch (error) {
        console.error("Gagal menghapus data:", error)
    }
  }
  return (
    <div className="flex flex-1 flex-col px-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            List Produk
        </CardTitle>
        <AddModal onSuccess={fetchProduk} />
        <DataTable
            data={product}
            count={countProduct}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            onDelete={handleDelete} />
      </div>
    </div>
  )
}