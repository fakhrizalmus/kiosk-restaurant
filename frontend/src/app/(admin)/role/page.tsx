"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { CardTitle } from "@/components/ui/card"
import AddModal from "./addmodal"
import { deleteRole, getRole } from "../actions"

export default function Page() {
  const [role, setRole] = useState<any[]>([]);
  const [countRole, setCountRole] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageIndex, setPageIndex] = useState<number>(0)

  const fetchRole = async () => {
    const res = await getRole({
      row: pageSize,
      page: pageIndex * pageSize
    })
    setRole(res.data.rows);
    setCountRole(res.data.count);
  }

  useEffect(() => {
    fetchRole();
  }, [pageIndex, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id)
      const res = await getRole({
        row: pageSize,
        page: pageIndex * pageSize
      })
      setRole(res.data.rows);
      setCountRole(res.data.count)
    } catch (error) {
      console.error("Gagal menghapus data:", error)
    }
  }
  return (
    <div className="flex flex-1 flex-col w-full px-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          Master Role
          <AddModal onSuccess={fetchRole} />
        </CardTitle>
        <DataTable
          data={role}
          refetch={fetchRole}
          count={countRole}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          onDelete={handleDelete} />
      </div>
    </div>
  )
}
