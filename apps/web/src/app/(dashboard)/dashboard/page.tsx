"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const StatCard = ({ title, value, icon: Icon, growth }: any) => (
    <Card className="glass border-white/20 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs flex items-center mt-1 text-green-500">
          <TrendingUp className="mr-1 h-3 w-3" />
          {growth}% from last month
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening with your store today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="$45,231.89" icon={DollarSign} growth={20.1} />
        <StatCard title="Orders" value="+2350" icon={ShoppingCart} growth={15.5} />
        <StatCard title="Customers" value="+12,234" icon={Users} growth={10.2} />
        <StatCard title="Total Items" value="573" icon={Package} growth={8.1} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass border-white/20 shadow-sm">
          <CardHeader>
            <CardTitle>Soft Aesthetics Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-primary/5 rounded-lg m-4">
            <p className="text-muted-foreground">Visuals are clear, calm, and focused.</p>
          </CardContent>
        </Card>

        <Card className="col-span-3 glass border-white/20 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      U{i}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">User {i} made a purchase</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="font-medium text-sm text-green-500">+$199.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
