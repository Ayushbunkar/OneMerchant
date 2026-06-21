"use client";

import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  CreditCard,
  BarChart3,
  Megaphone,
  MessageSquare,
  Settings,
  LogOut,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/suppliers", label: "Suppliers", icon: Truck },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/whatsapp", label: "WhatsApp", icon: MessageSquare },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
];

export function Sidebar() {
  const { isSidebarOpen } = useUiStore();
  const { tenant, logout } = useAuthStore();
  const pathname = usePathname();

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 border-r bg-card glass flex flex-col h-screen fixed top-0 left-0 z-40">
      <div className="h-16 flex items-center px-6 border-b">
        <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          OneMerchant
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="text-sm font-medium">{tenant?.name || "My Business"}</div>
        <div className="text-xs text-muted-foreground capitalize">{tenant?.plan || "free"} Plan</div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t space-y-2">
        <Link
          href="/settings"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-destructive" />
          Logout
        </button>
      </div>
    </aside>
  );
}
