"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getPesananDetail } from "../actions";
import { formatToRupiah } from "@/lib/utils";

type Product = {
    id: number;
    name: string;
    price: number;
};

type CartItem = {
    id: number;
    qty: number;
    status: "waiting" | "preparing" | "served";
    Product: Product;
};

type Pesanan = {
    id: number;
    no_table: string;
    createdAt: string;
    status: string;
    CartItems: CartItem[];
};

type Props = {
    id: number;
    onStatusChange?: (cartItemId: number, newStatus: CartItem["status"]) => Promise<void>;
};

export function PesananDetailDialog({ id, onStatusChange }: Props) {
    const [pesanan, setPesanan] = useState<Pesanan | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const refetch = async () => {
        const res = await getPesananDetail(id);
        setPesanan(res.data.rows[0]);
    };

    useEffect(() => {
        if (isOpen) {
            refetch();
        }
    }, [id, isOpen]);

    const totalHarga = pesanan?.CartItems.reduce((acc, item) => {
        return acc + (item.Product.price * item.qty);
    }, 0) ?? 0;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-fit p-2 bg-primary text-white">
                Detail
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] flex flex-col justify-between">
                <div className="space-y-4 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Detail Pesanan - Meja {pesanan?.no_table ?? '-'}</DialogTitle>
                    </DialogHeader>
                    {pesanan?.CartItems.map((item) => (
                        <div key={item.id} className="border rounded-md p-3">
                        <div className="flex justify-between">
                            <div>
                            <p className="font-medium">{item.Product.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Qty: {item.qty} &bull; Status: {item.status}
                            </p>
                            </div>
                            <div className="text-right">
                            <Label className="text-sm text-muted-foreground">Harga</Label>
                            <p className="font-semibold">{formatToRupiah(item.Product.price)}</p>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>

                {/* Footer Total & Bayar Sekarang */}
                <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-lg">Total Bayar</p>
                    <p className="font-bold text-xl text-green-600">{formatToRupiah(totalHarga)}</p>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Bayar Sekarang
                </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}