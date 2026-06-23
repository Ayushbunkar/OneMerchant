"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, Sparkles } from "lucide-react";
import RevenueChart from "./RevenueChart";
import { motion } from "framer-motion";

const MOCK_REVENUE_DATA = [
  { date: "2026-06-18", revenue: 38000 },
  { date: "2026-06-19", revenue: 42000 },
  { date: "2026-06-20", revenue: 35000 },
  { date: "2026-06-21", revenue: 51000 },
  { date: "2026-06-22", revenue: 64000 },
  { date: "2026-06-23", revenue: 58000 },
  { date: "2026-06-24", revenue: 72000 },
];

export default function DashboardPage() {
  const StatCard = ({ title, value, icon: Icon, growth, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="glass border-white/20 shadow-sm transition-all hover:shadow-md hover:border-white/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          <p className="text-xs flex items-center mt-1 text-green-500 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            {growth}% from last month
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Merchant Partner. Here is your omnichannel performance status.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="₹3,58,231.89" icon={DollarSign} growth={20.1} delay={0.0} />
        <StatCard title="Orders" value="+2,350" icon={ShoppingCart} growth={15.5} delay={0.05} />
        <StatCard title="Customers" value="+12,234" icon={Users} growth={10.2} delay={0.1} />
        <StatCard title="Total Items" value="573" icon={Package} growth={8.1} delay={0.15} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart Card */}
        <Card className="col-span-4 glass border-white/20 shadow-sm overflow-hidden flex flex-col justify-between">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>Weekly Sales Velocity</span>
              <span className="text-xs text-muted-foreground font-semibold px-2 py-0.5 rounded bg-background border">Omnichannel Sync</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] p-4 pb-0 flex flex-col justify-between">
            <RevenueChart data={MOCK_REVENUE_DATA} />
          </CardContent>
          <div className="p-4 pt-0 border-t bg-muted/10 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-purple-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold text-foreground">AI Forecasting Insight:</span> Revenue velocity is trending upwards at 20.1% week-over-week. Peak transactions are predicted on Friday between 4 PM and 7 PM. Recommend verifying stock availability for apparel items.
            </div>
          </div>
        </Card>

        {/* Recent Activity Card */}
        <Card className="col-span-3 glass border-white/20 shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {[
                { name: "Sophia Martinez", action: "purchased 1x Leather Jacket", time: "2 hours ago", amount: "+₹12,900.00" },
                { name: "Jackson Reed", action: "purchased 1x ANC Headphones", time: "3 hours ago", amount: "+₹6,400.00" },
                { name: "Ava Williams", action: "purchased 3x Ceramic Mugs", time: "5 hours ago", amount: "+₹3,600.00" },
                { name: "Emma Davis", action: "purchased 2x Soy Candles", time: "Yesterday", amount: "+₹2,800.00" }
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground font-bold text-xs">
                      {act.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-none text-foreground">{act.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{act.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs text-green-500">{act.amount}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
