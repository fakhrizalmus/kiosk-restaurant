"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getCart, getCartItem, getCategory, getProduct } from "./actions";
import { useParams } from "next/navigation";

const menu = {
  "veg pizza": [
    { name: "Tandoori Paneer pizza", price: 255, image: "/images/tandoori.png" },
    { name: "Double Cheese Margherita pizza", price: 185, image: "/images/doublecheese.png" },
    { name: "Margherita Pizza", price: 145, image: "/images/margherita.png" },
  ],
  Sides: [
    { name: "Classic Stuffed Garlic Bread", price: 145, image: "/images/garlic.png" },
  ],
  "Dessert & Beverages": [
    { name: "Choco Lava Cake", price: 119, image: "/images/lava.png" },
    { name: "Pepsi", price: 20, image: "/images/pepsi.png" },
  ],
};

export default function KioskPage() {
  const [product, setProduct] = useState<any[]>([])
  const [kategori, setKategori] = useState<any[]>([])
  const [cartItem, setCartItem] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | undefined>(undefined);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const params = useParams();
  const kioskId = Number(params.id);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await getCategory({});
        const kategoriData = res.data;
        setKategori(kategoriData);
        if (kategoriData.length > 0) {
          setSelectedKategoriId(kategoriData[0].id);
        }
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };

    fetchKategori();
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      if (selectedKategoriId === undefined) return;

      try {
        const res = await getProduct({ category_id: selectedKategoriId });
        setProduct(res.data);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      }
    };

    fetchProduct()
  }, [selectedKategoriId, selectedProductId])

  useEffect(() => {
    const fetchCartAndItems = async () => {
      try {
        const cartRes = await getCart({ status: 'ongoing' }, kioskId);
        const cartData = cartRes.data;
        setCart(cartData);

        if (cartData.length > 0) {
          const itemRes = await getCartItem({ cart_id: cartData[0].id });
          setCartItem(itemRes.data);
        }
      } catch (error) {
        console.log("Gagal fetch cart atau item:", error);
      }
    };

    fetchCartAndItems();
  }, [kioskId]);

  useEffect(() => {
    if (kategori.length > 0 && selectedKategoriId === undefined) {
      setSelectedKategoriId(kategori[0].id);
    }
  }, [kategori])

  const handleAddToOrder = (product: any) => {
    setOrderItems((prev) => {
      const index = prev.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        // Sudah ada: tambah qty
        const updated = [...prev];
        updated[index].qty += 1;
        return updated;
      } else {
        // Belum ada: tambahkan
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  const handleIncrementQty = (productId: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const handleDecrementQty = (productId: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  return (
    <div className="grid grid-cols-3 h-screen">
      {/* Menu */}
      <div className="col-span-2 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Food Ordering Self Service Kiosk</h1>

        <div className="flex gap-2 mb-4">
          {kategori.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedKategoriId === cat.id ? "default" : "outline"}
              onClick={() => setSelectedKategoriId(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {product.map((item, i) => (
              <Card key={i}>
                <CardHeader className="p-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/${item.image}`}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0
                    }).format(item.price)}</p>
                  {
                    orderItems.find((order) => order.id === item.id) ? (
                      <Button className="mt-2 w-full" disabled variant="outline">
                        Added
                      </Button>
                    ) : (
                      <Button className="mt-2 w-full" onClick={() => handleAddToOrder(item)}>
                        + Add
                      </Button>
                    )
                  }
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-muted border-l p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <AnimatePresence>
            {orderItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between mb-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item.price)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleDecrementQty(item.id)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-medium">{item.qty}</span>
                  <Button variant="outline" size="icon" onClick={() => handleIncrementQty(item.id)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

        </div>

        <div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(orderItems.reduce((total, item) => total + item.price * item.qty, 0))}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button variant="outline">New Bill</Button>
            <Button variant="destructive">Cancel</Button>
            <Button>Payment</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
