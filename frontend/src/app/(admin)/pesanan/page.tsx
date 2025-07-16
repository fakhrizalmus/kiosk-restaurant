"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { DataTable } from "./data-table";
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

export default function PesananPage() {
  const [data, setData] = useState<any[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [notifItems, setNotifItems] = useState<
    { id: number; product: string; qty: number }[]
  >([]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("✅ Socket connected (pesanan)");
    });

    socket.on("new_order", (newOrder) => {
      toast.success(`Pesanan baru dari meja ${newOrder.table}`);

      const newItems = newOrder.items.map((item: any, i: number) => ({
        id: newOrder.cart_id * 1000 + i,
        product: item.name,
        qty: item.qty,
        status: "waiting",
      }));

      const notifData = newOrder.items.map((item: any) => ({
        id: newOrder.cart_id,
        product: item.name,
        qty: item.qty,
      }));

      setData((prev) => [...prev, ...newItems]);
      setNotifItems((prev) => [...notifData, ...prev]);
      setNotifCount((prev) => prev + notifData.length);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
              <DropdownMenuItem disabled>Tidak ada notifikasi</DropdownMenuItem>
            ) : (
              notifItems.slice(0, 5).map((item, index) => (
                <DropdownMenuItem key={index}>
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.qty} | ID Cart: {item.id}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable data={data} />
    </div>
  );
}
