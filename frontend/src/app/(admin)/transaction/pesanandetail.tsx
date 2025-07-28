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
                <Button
                    onClick={() => console.log("Trigger clicked")}
                    variant="ghost"
                    className="h-8 w-fit p-2"
                    style={{ backgroundColor: "var(--primary)" }}
                >
                    Detail
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Pesanan Meja {pesanan?.no_table ?? '-'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {pesanan?.CartItems.map((item) => (
                        <div key={item.id} className="border-b pb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.Product.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                                    <p className="text-sm text-muted-foreground">Status: {item.status}</p>
                                </div>
                                <div className="w-40">
                                    <Label className="text-xs mb-1">Harga</Label>
                                    <p>{formatToRupiah(item.Product?.price)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    Total: {formatToRupiah(totalHarga)}
                </div>
            </DialogContent>
        </Dialog>
    );
}