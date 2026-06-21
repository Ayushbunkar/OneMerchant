import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">View customer profiles and segmentation.</p>
        </div>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
          <Users className="h-12 w-12 mb-4 opacity-50" />
          <p>Customer CRM module is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
