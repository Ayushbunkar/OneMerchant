"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Filter, ArrowUpRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_ORDERS = [
  { id: "ORD-9482", customer: "Sophia Martinez", email: "sophia.m@gmail.com", items: "1x Leather Jacket, 2x Wool Socks", date: "2026-06-23", total: 245.00, method: "Stripe", status: "Fulfilled" },
  { id: "ORD-9481", customer: "Jackson Reed", email: "j.reed@outlook.com", items: "1x Wireless Earbuds", date: "2026-06-23", total: 89.99, method: "PayPal", status: "Pending" },
  { id: "ORD-9480", customer: "Ava Williams", email: "ava.w@yahoo.com", items: "3x Ceramic Coffee Mugs", date: "2026-06-22", total: 45.50, method: "Stripe", status: "Fulfilled" },
  { id: "ORD-9479", customer: "Liam Johnson", email: "liam.j@gmail.com", items: "1x Mechanical Keyboard", date: "2026-06-22", total: 129.00, method: "Apple Pay", status: "Cancelled" },
  { id: "ORD-9478", customer: "Emma Davis", email: "emma.d@icloud.com", items: "2x Organic Soy Candles", date: "2026-06-21", total: 36.00, method: "Stripe", status: "Fulfilled" },
  { id: "ORD-9477", customer: "Noah Taylor", email: "noah.t@gmail.com", items: "1x Ergonomic Office Chair", date: "2026-06-21", total: 349.99, method: "Stripe", status: "Pending" }
];

export default function OrdersPage() {
  const [filter, setFilter] = useState<"All" | "Fulfilled" | "Pending" | "Cancelled">("All");
  const [search, setSearch] = useState("");

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesFilter = filter === "All" || order.status === filter;
    const matchesSearch = order.customer.toLowerCase().includes(search.toLowerCase()) || 
                          order.id.toLowerCase().includes(search.toLowerCase()) ||
                          order.items.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Track sales history, transaction details, and shipments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95">
            Export CSV <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order ID, client name, or item list..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card w-full"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1.5 bg-muted p-1 rounded-lg border shrink-0">
          {(["All", "Fulfilled", "Pending", "Cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                filter === tab
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
            <ShoppingCart className="h-5 w-5 text-primary" />
            Orders Log ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/20 text-muted-foreground font-semibold">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Products Purchased</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Total</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, idx) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="border-b hover:bg-muted/10 transition-colors"
                      >
                        <td className="p-4 font-bold text-foreground">{order.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-foreground">{order.customer}</div>
                          <div className="text-xs text-muted-foreground">{order.email}</div>
                        </td>
                        <td className="p-4 max-w-[220px] truncate text-muted-foreground">{order.items}</td>
                        <td className="p-4 text-muted-foreground">{order.date}</td>
                        <td className="p-4 text-right font-semibold text-foreground">${order.total.toFixed(2)}</td>
                        <td className="p-4 text-muted-foreground">{order.method}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
                              order.status === "Fulfilled" && "bg-green-500/10 text-green-600 border-green-500/20",
                              order.status === "Pending" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                              order.status === "Cancelled" && "bg-red-500/10 text-red-600 border-red-500/20"
                            )}
                          >
                            {order.status === "Fulfilled" && <CheckCircle2 className="h-3 w-3" />}
                            {order.status === "Pending" && <AlertCircle className="h-3 w-3" />}
                            {order.status === "Cancelled" && <XCircle className="h-3 w-3" />}
                            {order.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No orders matching the criteria were found.
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
