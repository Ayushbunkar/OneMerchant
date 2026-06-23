"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../store/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // Monitor scroll to apply dynamic background styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide public navbar on dashboard pages
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/ai-assistant");

  if (isDashboardRoute) {
    return null;
  }

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border/80 shadow-sm"
          : "bg-background/40 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 relative group">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-foreground to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              OneMerchant
            </span>
            <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 transition-colors duration-200"
                  onMouseEnter={() => setHoveredPath(link.href)}
                  onMouseLeave={() => setHoveredPath(null)}
                >
                  <span
                    className={cn(
                      "relative z-10 font-semibold transition-colors duration-200",
                      isActive ? "text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-primary/20 rounded-full z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {hoveredPath === link.href && !isActive && (
                    <motion.div
                      layoutId="hover-nav"
                      className="absolute inset-0 bg-muted/60 rounded-full z-0"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground px-3 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-sm font-semibold text-destructive/80 transition-colors hover:text-destructive px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b bg-background/95 backdrop-blur-md"
          >
            <div className="container px-4 py-4 flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-semibold transition-colors",
                    pathname === link.href
                      ? "bg-primary/20 text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-3">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-semibold text-destructive/80 hover:bg-destructive/10"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center w-full h-10 items-center rounded-md bg-foreground text-sm font-semibold text-background shadow"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
