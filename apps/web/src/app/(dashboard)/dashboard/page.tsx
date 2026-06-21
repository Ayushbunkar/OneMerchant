"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from "lucide-react";
import dynamic from "next/dynamic";

const RevenueChart = dynamic(() => import("./RevenueChart"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted/5 animate-pulse rounded-lg flex items-center justify-center text-xs text-muted-foreground">
      Loading chart...
    </div>
  ),
});

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, revenueRes, productsRes] = await Promise.all([
          apiClient.get("/analytics/dashboard"),
          apiClient.get("/analytics/revenue?days=7"),
          apiClient.get("/analytics/top-products?limit=5"),
        ]);
        setStats(statsRes.data);
        setRevenueData(revenueRes.data);
        setTopProducts(productsRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;
  }

  const StatCard = ({ title, value, icon: Icon, growth, isCurrency = false }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isCurrency ? formatCurrency(value) : formatNumber(value)}</div>
        <p className={`text-xs flex items-center mt-1 ${growth >= 0 ? "text-green-500" : "text-red-500"}`}>
          {growth >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
          {Math.abs(growth)}% from last month
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening with your store today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} icon={IndianRupee} growth={stats?.revenueGrowth || 0} isCurrency />
        <StatCard title="Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} growth={stats?.orderGrowth || 0} />
        <StatCard title="Customers" value={stats?.totalCustomers || 0} icon={Users} growth={stats?.customerGrowth || 0} />
        <StatCard title="Low Stock" value={stats?.lowStockProducts || 0} icon={Package} growth={0} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 h-[300px]">
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topProducts.map((product) => (
                <div key={product.productId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{product.totalSold} sold</p>
                    </div>
                  </div>
                  <div className="font-medium text-sm">{formatCurrency(product.revenue)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
