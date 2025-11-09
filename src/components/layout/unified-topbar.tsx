"use client";

import { Search, Moon, Sun, Upload, Settings, FileText, LogIn, User, Bell, ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

interface UnifiedTopBarProps {
  onUploadClick: () => void;
  onSettingsClick: () => void;
  onReportsClick: () => void;
  onLoginClick: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export function UnifiedTopBar({ 
  onUploadClick, 
  onSettingsClick, 
  onReportsClick,
  onLoginClick,
  onBackClick,
  showBackButton = false
}: UnifiedTopBarProps) {
  const { theme, toggleTheme } = useAppStore();

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
          <span className="font-bold text-xl">Analytics Hub</span>
        </div>


        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUploadClick}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>

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

        

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLoginClick}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            Login
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
