"use client";

import { Search, Upload, Settings, FileText, Bell, ArrowLeft, BarChart3, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

interface UnifiedTopBarProps {
  onUploadClick: () => void;
  onSettingsClick: () => void;
  onReportsClick: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export function UnifiedTopBar({ 
  onUploadClick, 
  onSettingsClick, 
  onReportsClick,
  onBackClick,
  showBackButton = false
}: UnifiedTopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "Welcome to Analytics Hub!", time: "Just now", read: false },
    { id: 2, text: "Upload a file to get started", time: "1m ago", read: false },
  ]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo and Back Button */}
        <div className="flex items-center gap-4">
          {showBackButton && onBackClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackClick}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">Analytics Hub</span>
          </div>
        </div>


        {/* Actions */}
        <div className="flex items-center gap-2">

          <Button
            variant="ghost"
            size="sm"
            onClick={onReportsClick}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Reports
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-full"
            >
              <Bell className="h-4 w-4" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl border shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-bold text-sm">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <p className="text-sm font-medium">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
