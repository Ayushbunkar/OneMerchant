"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, Mail, UserCheck, Star, Calendar, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_CUSTOMERS = [
  { name: "Sophia Martinez", email: "sophia.m@gmail.com", orders: 24, totalSpend: 2450.50, date: "2024-02-15", tier: "VIP" },
  { name: "Jackson Reed", email: "j.reed@outlook.com", orders: 3, totalSpend: 189.99, date: "2026-05-10", tier: "New" },
  { name: "Ava Williams", email: "ava.w@yahoo.com", orders: 12, totalSpend: 755.20, date: "2025-08-20", tier: "Regular" },
  { name: "Liam Johnson", email: "liam.j@gmail.com", orders: 8, totalSpend: 420.00, date: "2025-11-04", tier: "Regular" },
  { name: "Emma Davis", email: "emma.d@icloud.com", orders: 35, totalSpend: 4120.00, date: "2024-01-10", tier: "VIP" },
  { name: "Noah Taylor", email: "noah.t@gmail.com", orders: 1, totalSpend: 349.99, date: "2026-06-20", tier: "New" },
  { name: "Olivia Brown", email: "olivia.b@gmail.com", orders: 0, totalSpend: 0.00, date: "2026-06-22", tier: "Inactive" }
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"All" | "VIP" | "Regular" | "New" | "Inactive">("All");

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === "All" || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage client relationships, spending patterns, and engagement.</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95">
          Invite Customer <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>

      {/* CRM Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Directory</span>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold mt-2">12,234</div>
            <p className="text-xs text-green-500 mt-1">↑ +12.4% growth since last quarter</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">VIP Tier Clients</span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold mt-2">842</div>
            <p className="text-xs text-muted-foreground mt-1">Contribute to 45% of total sales</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Avg. Retention Rate</span>
              <UserCheck className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-2">64.2%</div>
            <p className="text-xs text-green-500 mt-1">↑ +2.1% improvement this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card w-full"
          />
        </div>

        {/* Tier Filters */}
        <div className="flex gap-1.5 bg-muted p-1 rounded-lg border shrink-0">
          {(["All", "VIP", "Regular", "New", "Inactive"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTierFilter(tab)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                tierFilter === tab
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
            <Users className="h-5 w-5 text-primary" />
            Client Database ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/20 text-muted-foreground font-semibold">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Orders</th>
                  <th className="p-4 text-right">Total Spend</th>
                  <th className="p-4">Customer Since</th>
                  <th className="p-4">Segment Tier</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((cust, idx) => (
                      <motion.tr
                        key={cust.email}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="border-b hover:bg-muted/10 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary-foreground font-bold flex items-center justify-center text-xs">
                              {cust.name.charAt(0)}
                            </div>
                            <div className="font-semibold text-foreground">{cust.name}</div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 opacity-60" />
                            {cust.email}
                          </div>
                        </td>
                        <td className="p-4 text-center text-foreground font-medium">{cust.orders}</td>
                        <td className="p-4 text-right font-semibold text-foreground">${cust.totalSpend.toFixed(2)}</td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 opacity-60" />
                            {cust.date}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
                              cust.tier === "VIP" && "bg-purple-500/10 text-purple-600 border-purple-500/20",
                              cust.tier === "Regular" && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                              cust.tier === "New" && "bg-green-500/10 text-green-600 border-green-500/20",
                              cust.tier === "Inactive" && "bg-muted text-muted-foreground border-muted-foreground/20"
                            )}
                          >
                            {cust.tier}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No customers found matching search filters.
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
