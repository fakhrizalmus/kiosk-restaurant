"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { CardTitle } from "@/components/ui/card"
import AddModal from "./addmodal"
import { deleteCategory, getCategory } from "../actions"

export default function Page() {
  const [category, setCategory] = useState<any[]>([]);
  const [countCategory, setCountCategory] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageIndex, setPageIndex] = useState<number>(0)

  const fetchCategory = async () => {
    const res = await getCategory({
      row: pageSize,
      page: pageIndex * pageSize
    })
    setCategory(res.data.rows);
    setCountCategory(res.data.count);
  }

  useEffect(() => {
    fetchCategory();
  }, [pageIndex, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id)
      const res = await getCategory({
        row: pageSize,
        page: pageIndex * pageSize
      })
      setCategory(res.data.rows);
      setCountCategory(res.data.count)
    } catch (error) {
      console.error("Gagal menghapus data:", error)
    }
  }
  return (
    <div className="flex flex-1 flex-col w-full px-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          List Category
          <AddModal onSuccess={fetchCategory} />
        </CardTitle>
        <DataTable
          data={category}
          refetch={fetchCategory}
          count={countCategory}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          onDelete={handleDelete} />
      </div>
    </div>
  )
}