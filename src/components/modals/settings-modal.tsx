"use client";

import { Modal } from "@/components/ui/modal";
import { useAppStore } from "@/store/useAppStore";
import { Moon, Sun, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme, uploadedFiles } = useAppStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {/* Theme */}
        <div>
          <h3 className="font-semibold mb-3">Appearance</h3>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Current: {theme === "light" ? "Light" : "Dark"}
                </p>
              </div>
            </div>
            <Button onClick={toggleTheme} variant="outline" size="sm">
              Toggle
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="font-semibold mb-3">Notifications</h3>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when analysis completes
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              On
            </Button>
          </div>
        </div>

        {/* Data */}
        <div>
          <h3 className="font-semibold mb-3">Data Management</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Uploaded Files</p>
                <p className="text-sm text-muted-foreground">
                  {uploadedFiles.length} file(s) stored
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2" size="sm">
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
