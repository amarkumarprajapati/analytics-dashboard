"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Upload, label: "Upload", href: "/upload" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card/50 backdrop-blur-xl"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Analytics</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto h-2 w-2 rounded-full bg-primary-foreground"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4">
            <p className="text-sm font-medium">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground mt-1">
              Unlock advanced analytics features
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
