"use client";

import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/items", label: "Items", icon: Package },
];

export function Sidebar() {
  const { isSidebarOpen } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen fixed top-0 left-0 z-40">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="font-bold text-xl text-primary">
          OneMerchant
        </Link>
      </div>

      <div className="p-4 border-b">
        <div className="text-sm font-medium">{user?.name || "User"}</div>
        <div className="text-xs text-muted-foreground capitalize">Welcome</div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            // exact match for dashboard, startswith for others
            const isActive = item.href === "/dashboard" 
              ? pathname === "/dashboard" 
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
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
