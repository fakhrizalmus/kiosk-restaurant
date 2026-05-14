"use client";

import { useCallback, useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { DataTable } from "@/features/admin/pesanan/data-table";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getPesanan } from "@/services/admin-api";

export default function PesananPage() {
  const [data, setData] = useState<any[]>([]);
  const [countPesanan, setCountPesanan] = useState<number>(0);
  const [notifCount, setNotifCount] = useState(0);
  const [notifItems, setNotifItems] = useState<
    { id: number; product: string; qty: number; table: number }[]
  >([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [noTable, setNoTable] = useState<number | null>(null);

  const fetchPesanan = useCallback(async () => {
    try {
      const res = await getPesanan({
        status: selectedStatus || undefined,
        no_table: noTable !== null ? noTable : undefined,
        row: pageSize,
        page: pageIndex * pageSize,
      });

      setData(res.data.rows || []);
      setCountPesanan(res.data.count || 0);
    } catch (error) {
      console.error("Gagal fetch pesanan:", error);
    }
  }, [selectedStatus, noTable, pageSize, pageIndex]);

  useEffect(() => {
    const socket = getSocket();

    const handleNewOrder = async (newOrder: any) => {
      toastr.success(`Pesanan baru dari meja ${newOrder.table}`);
      await fetchPesanan();

      const notifData = (newOrder.items || []).map((item: any) => ({
        id: newOrder.cart_id,
        product: item.Product?.name ?? `ID ${item.product_id}`,
        qty: item.qty,
        table: newOrder.table,
      }));

      setNotifItems((prev) => [...notifData, ...prev]);
      setNotifCount((prev) => prev + notifData.length);
    };

    const handleConnect = () => {
      console.log("Socket connected to dapur");
    };

    socket.on("connect", handleConnect);
    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new_order", handleNewOrder);
    };
  }, [fetchPesanan]);

  useEffect(() => {
    fetchPesanan();
  }, [fetchPesanan]);

  const handleMarkAsRead = () => {
    setNotifItems([]);
    setNotifCount(0);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pesanan Masuk</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative">
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifikasi Pesanan Baru</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifItems.length === 0 ? (
              <DropdownMenuItem disabled>
                Tidak ada notifikasi
              </DropdownMenuItem>
            ) : (
              <>
                {notifItems.slice(0, 5).map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <div>
                      <p className="font-medium">{item.product}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.qty} | Meja: {item.table}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-sm text-center justify-center text-blue-600 cursor-pointer"
                  onClick={handleMarkAsRead}
                >
                  Tandai sudah dibaca
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable
        data={data}
        count={countPesanan}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        noTable={noTable}
        setNoTable={setNoTable}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
      />
    </div>
  );
}
