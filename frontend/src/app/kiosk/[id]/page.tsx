"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { addCart, addCartItem, getCart, getCartItem, getCategory, getProduct } from "./actions";
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
        console.log(cartData);

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
      const index = prev.findIndex((item) => item.product_id === product.id);

      if (index !== -1) {
        const updated = [...prev];
        updated[index].qty += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            product_id: product.id,
            qty: 1,
            name: product.name,
            price: product.price
          },
        ];
      }
    });
  };

  const handleIncrementQty = (productId: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const handleDecrementQty = (productId: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) =>
          item.product_id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const checkout = async () => {
    try {
      let cartId: number;
      if (cart.length === 0) {
        // Buat cart baru jika belum ada
        const addcart = await addCart({ no_table: kioskId });
        cartId = addcart.data.id;
      } else {
        cartId = cart[0].id;
      }
  
      for (let i = 0; i < orderItems.length; i++) {
        await addCartItem({
          cart_id: cartId,
          product_id: orderItems[i].product_id,
          qty: orderItems[i].qty
        })
      };
  
      setOrderItems([]);
  
      const itemRes = await getCartItem({ cart_id: cartId });
      setCartItem(itemRes.data);
    } catch (error) {
      console.error("Checkout gagal:", error);
    }
  }

  const cancel = async () => {
    setOrderItems([]);
  }

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
                    orderItems.find((order) => order.product_id === item.id) ? (
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
      <div className="bg-muted border-l p-6 flex flex-col justify-between min-h-screen w-full">
        <div>
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          {/* History (Cart Items) */}
          {cartItem.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">History</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cartItem.map((item) => {
                  const statusColor =
                    item.status === "waiting"
                      ? "bg-yellow-500 border-yellow-600"
                      : item.status === "preparing"
                      ? "bg-blue-500 border-blue-600"
                      : "bg-green-600 border-green-700";

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 rounded"
                    >
                      <div>
                        <p className="font-medium">{item.Product?.name || '-'}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                      <span
                        className={`text-xs text-white font-semibold px-3 py-1 rounded-full border ${statusColor}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Order (New Items) */}
          {orderItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Order</h3>
              <AnimatePresence>
                {orderItems.map((item) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center p-2 mb-2 rounded"
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
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecrementQty(item.product_id)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-medium">{item.qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleIncrementQty(item.product_id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Total & Checkout */}
        <div>
          <Separator className="my-4" />
          <div className="flex justify-between text-xl font-semibold mb-4">
            <span>Total</span>
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(orderItems.reduce((total, item) => total + item.price * item.qty, 0))}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="destructive" onClick={cancel}>Cancel</Button>
            <Button onClick={checkout}>Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
