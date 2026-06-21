import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Track and manage customer orders.</p>
        </div>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mb-4 opacity-50" />
          <p>Order management module is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
