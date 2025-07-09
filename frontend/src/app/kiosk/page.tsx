"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  return (
    <div className="grid grid-cols-3 h-screen">
      {/* Menu */}
      <div className="col-span-2 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Food Ordering Self Service Kiosk</h1>

        <Tabs defaultValue="veg pizza" className="space-y-4">
          <TabsList>
            {Object.keys(menu).map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(menu).map(([cat, items]) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-3 gap-4">
                {items.map((item, i) => (
                  <Card key={i}>
                    <CardHeader className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">₹ {item.price}</p>
                      <Button className="mt-2 w-full">+ Add</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Order Summary */}
      <div className="bg-muted border-l p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <AnimatePresence>
            <motion.div
                key="tandoori" // gunakan key unik per item
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between mb-4"
            >
                <div>
                <p className="font-medium">Tandoori Paneer Pizza</p>
                <p className="text-sm text-muted-foreground">₹ 255.00</p>
                </div>
                <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon"><Minus className="w-4 h-4" /></Button>
                <span className="font-medium">2</span>
                <Button variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                </div>
            </motion.div>

            <motion.div
                key="doublecheese"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between mb-4"
            >
                <div>
                <p className="font-medium">Double Cheese Pizza</p>
                <p className="text-sm text-muted-foreground">₹ 185.00</p>
                </div>
                <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon"><Minus className="w-4 h-4" /></Button>
                <span className="font-medium">1</span>
                <Button variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                </div>
            </motion.div>
            </AnimatePresence>

        </div>

        <div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹ 695.00</span>
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
