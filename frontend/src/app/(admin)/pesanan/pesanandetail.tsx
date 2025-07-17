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
import { getPesanan } from "../actions";

type Product = {
    id: number;
    name: string;
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
    const refetch = async () => {
        const res = await getPesanan({ id });
        setPesanan(res.data.rows[0]);
    };

    useEffect(() => {
        refetch();
    }, [id]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-fit p-2" style={{ backgroundColor: "var(--primary)" }}>
                    Detail
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
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
                                </div>
                                <div className="w-40">
                                    <Label className="text-xs mb-1">Status</Label>
                                    <Select
                                        value={item.status}
                                        onValueChange={(value) => {
                                            onStatusChange?.(item.id, value as CartItem["status"])
                                                ?.then(refetch)
                                                .catch((err) => {
                                                    console.error("Update status gagal", err);
                                                });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="waiting">Waiting</SelectItem>
                                            <SelectItem value="preparing">Preparing</SelectItem>
                                            <SelectItem value="served">Served</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}