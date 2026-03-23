"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, X, Home, MapPin, FileText, CreditCard, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import SignInButton from "./SignInButton";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: MapPin },
  { name: "Assessments", href: "/assessments", icon: FileText },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Admin", href: "/admin", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageName = useMemo(() => {
    const current = navigation.find((item) => isActive(pathname, item.href));
    return current?.name ?? "UrbanLedge";
  }, [pathname]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        theme === "light"
          ? "border-slate-200/80 bg-white/85"
          : "border-slate-700/70 bg-slate-950/70"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <Image src="/urbanledge.png" alt="UrbanLedge" width={36} height={36} priority />
            </span>
            <span className="min-w-0">
              <span className={`block truncate text-base font-semibold tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
                UrbanLedge
              </span>
              <span className={`block truncate text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                {pageName}
              </span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 xl:flex">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : theme === "light"
                    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-1 lg:flex lg:max-w-md lg:items-center">
          <label className="relative w-full">
            <Search
              size={17}
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === "light" ? "text-slate-400" : "text-slate-500"
              }`}
            />
            <input
              type="search"
              placeholder="Search properties, assessments, payments"
              className={`w-full rounded-xl border py-2.5 pl-9 pr-24 text-sm outline-none transition ${
                theme === "light"
                  ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
                  : "border-slate-700 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              }`}
            />
            <span
              className={`absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border px-2 py-0.5 text-[11px] font-medium lg:block ${
                theme === "light"
                  ? "border-slate-200 bg-white text-slate-500"
                  : "border-slate-700 bg-slate-800 text-slate-400"
              }`}
            >
              Ctrl + K
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className={`relative hidden rounded-xl border p-2.5 transition md:inline-flex ${
              theme === "light"
                ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-red-600 px-1 text-center text-[10px] font-semibold leading-4 text-white">
              3
            </span>
          </motion.button>

          <ThemeToggle />

          <div className="hidden md:block">
            <SignInButton />
          </div>

          <button
            onClick={() => setMobileMenuOpen((value) => !value)}
            className={`inline-flex rounded-xl border p-2.5 transition md:hidden ${
              theme === "light"
                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            }`}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden border-t px-4 pb-4 pt-3 sm:px-6 ${
              theme === "light" ? "border-slate-200 bg-white" : "border-slate-700 bg-slate-950"
            }`}
          >
            <label className="relative mb-3 block">
              <Search
                size={17}
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === "light" ? "text-slate-400" : "text-slate-500"
                }`}
              />
              <input
                type="search"
                placeholder="Search"
                className={`w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none ${
                  theme === "light"
                    ? "border-slate-200 bg-slate-50 text-slate-900"
                    : "border-slate-700 bg-slate-900 text-slate-100"
                }`}
              />
            </label>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : theme === "light"
                        ? "text-slate-700 hover:bg-slate-100"
                        : "text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <item.icon size={17} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 md:hidden">
              <SignInButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
