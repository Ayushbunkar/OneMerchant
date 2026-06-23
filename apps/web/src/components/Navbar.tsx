"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../store/auth";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  // Don't show navbar on dashboard pages, dashboard has its own layout
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav className="border-b bg-card">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              OneMerchant
            </span>
          </Link>
          <div className="flex gap-6 text-sm font-medium">
            <Link
              href="/about"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/about" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/pricing"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/pricing" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-sm font-medium text-destructive transition-colors hover:text-destructive/80"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
