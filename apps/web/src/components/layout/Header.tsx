"use client";

import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/auth";
import { Menu, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Header() {
  const { toggleSidebar } = useUiStore();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders, products, customers..."
            className="w-full bg-background/50 pl-9 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary"></span>
          </Button>
        </motion.div>
        
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold">{user?.name || "Merchant"}</span>
            <span className="text-xs text-muted-foreground capitalize">Owner</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer shadow-sm"
          >
            {user?.name?.charAt(0).toUpperCase() || "M"}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
