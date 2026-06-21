"use client";

import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { Menu, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  const { toggleSidebar } = useUiStore();
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b bg-card/80 glass sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders, products, customers..."
            className="w-full bg-background/50 pl-9 border-white/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground">{user?.role || "Owner"}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-medium text-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
