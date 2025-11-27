"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { CardTitle } from "@/components/ui/card"
import AddModal from "./addmodal"
import { deletePermission, getPermission } from "../actions"

export default function Page() {
  const [permission, setPermission] = useState<any[]>([]);
  const [countPermission, setCountPermission] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageIndex, setPageIndex] = useState<number>(0)

  const fetchPermission = async () => {
    const res = await getPermission({
      row: pageSize,
      page: pageIndex * pageSize
    })
    setPermission(res.data.rows);
    setCountPermission(res.data.count);
  }

  useEffect(() => {
    fetchPermission();
  }, [pageIndex, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      await deletePermission(id)
      const res = await getPermission({
        row: pageSize,
        page: pageIndex * pageSize
      })
      setPermission(res.data.rows);
      setCountPermission(res.data.count)
    } catch (error) {
      console.error("Gagal menghapus data:", error)
    }
  }
  return (
    <div className="flex flex-1 flex-col w-full px-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          Master Access
          <AddModal onSuccess={fetchPermission} />
        </CardTitle>
        <DataTable
          data={permission}
          refetch={fetchPermission}
          count={countPermission}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          onDelete={handleDelete} />
      </div>
    </div>
  )
}