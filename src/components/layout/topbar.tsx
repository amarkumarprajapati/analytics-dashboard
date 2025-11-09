"use client";

import { Search, Moon, Sun, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

export function TopBar() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-64 right-0 top-0 z-30 h-16 border-b bg-background/80 backdrop-blur-xl"
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files, reports, insights..."
              className="pl-10 bg-muted/50 border-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User Avatar */}
          <Button
            variant="ghost"
            className="gap-2 rounded-full pl-2 pr-4"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">John Doe</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
