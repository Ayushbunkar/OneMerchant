"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Search, Plus, SlidersHorizontal, AlertTriangle, CheckCircle, XCircle, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_INVENTORY = [
  { name: "Premium Leather Jacket", sku: "SKU-JKT-001", category: "Apparel", price: 199.00, stock: 45, status: "In Stock" },
  { name: "Wireless ANC Headphones", sku: "SKU-AUD-082", category: "Electronics", price: 89.99, stock: 8, status: "Low Stock" },
  { name: "Ceramic Coffee Mug (Matte)", sku: "SKU-HOM-103", category: "Home Goods", price: 15.50, stock: 120, status: "In Stock" },
  { name: "Mechanical Gaming Keyboard", sku: "SKU-CMP-221", category: "Electronics", price: 129.00, stock: 0, status: "Out of Stock" },
  { name: "Organic Soy Candle (Lavender)", sku: "SKU-HOM-104", category: "Home Goods", price: 18.00, stock: 75, status: "In Stock" },
  { name: "Ergonomic Office Chair", sku: "SKU-OFF-882", category: "Furniture", price: 349.99, stock: 3, status: "Low Stock" },
  { name: "Wool Knit Winter Socks", sku: "SKU-APPA-109", category: "Apparel", price: 12.00, stock: 200, status: "In Stock" }
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Apparel" | "Electronics" | "Home Goods" | "Furniture">("All");

  const filteredInventory = MOCK_INVENTORY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage catalog items, monitor SKU counts, and configure restock warnings.</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Inventory KPI Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Managed SKUs</span>
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold mt-2">573</div>
            <p className="text-xs text-muted-foreground mt-1">Spread across 6 product categories</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Stock Volume</span>
              <SlidersHorizontal className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold mt-2">14,842 units</div>
            <p className="text-xs text-muted-foreground mt-1">Estimated asset valuation: $128,450.00</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Stock Health Alerts</span>
              <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
            </div>
            <div className="text-2xl font-bold mt-2">3 Issues</div>
            <p className="text-xs text-red-500 mt-1">2 products low in stock, 1 item sold out</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by SKU or title description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card w-full"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 bg-muted p-1 rounded-lg border shrink-0">
          {(["All", "Apparel", "Electronics", "Home Goods", "Furniture"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setCategoryFilter(tab)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                categoryFilter === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <Card className="glass border-white/20 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Active Products ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/20 text-muted-foreground font-semibold">
                  <th className="p-4">Product Details</th>
                  <th className="p-4">SKU Code</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">In Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item, idx) => (
                      <motion.tr
                        key={item.sku}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="border-b hover:bg-muted/10 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-semibold text-foreground">{item.name}</div>
                        </td>
                        <td className="p-4 text-xs font-mono text-muted-foreground">{item.sku}</td>
                        <td className="p-4 text-muted-foreground">{item.category}</td>
                        <td className="p-4 text-right font-semibold text-foreground">${item.price.toFixed(2)}</td>
                        <td className="p-4 text-center text-foreground font-medium">{item.stock}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
                              item.status === "In Stock" && "bg-green-500/10 text-green-600 border-green-500/20",
                              item.status === "Low Stock" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                              item.status === "Out of Stock" && "bg-red-500/10 text-red-600 border-red-500/20"
                            )}
                          >
                            {item.status === "In Stock" && <CheckCircle className="h-3 w-3" />}
                            {item.status === "Low Stock" && <AlertTriangle className="h-3 w-3" />}
                            {item.status === "Out of Stock" && <XCircle className="h-3 w-3" />}
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary/80 font-bold">
                            Restock
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No product files matching filters.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
