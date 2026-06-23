"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUiStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated && !pathname.startsWith("/auth")) {
      router.push("/auth/login");
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, [isAuthenticated, router, pathname, setSidebarOpen]);

  if (!mounted) return null; // Prevent hydration mismatch

  if (!isAuthenticated && !pathname.startsWith("/auth")) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
