"use client";

import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Bot,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/items", label: "Items", icon: Package },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/ai-assistant", label: "AI Co-Pilot", icon: Bot },
];

export function Sidebar() {
  const { isSidebarOpen } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen fixed top-0 left-0 z-40 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-foreground to-purple-600 bg-clip-text text-transparent flex items-center gap-1.5 hover:opacity-85 transition-opacity">
          OneMerchant
          <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
        </Link>
      </div>

      <div className="p-4 border-b bg-muted/20">
        <div className="text-sm font-semibold">{user?.name || "Merchant Partner"}</div>
        <div className="text-xs text-muted-foreground capitalize mt-0.5">Role: Owner</div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1.5 px-3 relative">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/dashboard" 
              ? pathname === "/dashboard" 
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors group",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/20 rounded-lg z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={cn("mr-3 h-5 w-5 relative z-10 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t space-y-2">
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-destructive" />
          Logout
        </button>
      </div>
    </aside>
  );
}
