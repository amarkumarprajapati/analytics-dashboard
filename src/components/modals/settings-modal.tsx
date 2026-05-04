"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useAppStore } from "@/store/useAppStore";
import { Moon, Sun, Bell, BellOff, Trash2, Key, Check, AlertCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme, uploadedFiles, geminiApiKey, setGeminiApiKey, clearAllFiles } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || "");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput.trim() || null);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowApiKeyInput(false);
    }, 1500);
  };

  const handleClearAll = () => {
    clearAllFiles();
    setCleared(true);
    setTimeout(() => {
      setCleared(false);
      setShowClearConfirm(false);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {/* Theme */}
        <div>
          <h3 className="font-semibold mb-3">Appearance</h3>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              {theme === "light" ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-sky-400" />
              )}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Current: {theme === "light" ? "Light" : "Dark"}
                </p>
              </div>
            </div>
            <Button onClick={toggleTheme} variant="outline" size="sm" className="gap-2">
              {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              Switch to {theme === "light" ? "Dark" : "Light"}
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="font-semibold mb-3">Notifications</h3>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              {notificationsEnabled ? (
                <Bell className="h-5 w-5 text-emerald-500" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">
                  {notificationsEnabled ? "Notifications are enabled" : "Notifications are disabled"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                notificationsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <motion.span
                animate={{ x: notificationsEnabled ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>
        </div>

        {/* AI API Key */}
        <div>
          <h3 className="font-semibold mb-3">AI Configuration</h3>
          <div className="rounded-lg border overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Gemini API Key</p>
                  <p className="text-sm text-muted-foreground">
                    {geminiApiKey ? "API key is configured" : "No API key set"}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowApiKeyInput(!showApiKeyInput)} 
                variant="outline" 
                size="sm"
              >
                {showApiKeyInput ? "Cancel" : "Configure"}
              </Button>
            </div>
            <AnimatePresence>
              {showApiKeyInput && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t px-4 pb-4 overflow-hidden"
                >
                  <div className="pt-3 flex gap-2">
                    <Input
                      type="password"
                      placeholder="Enter your Gemini API key..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSaveApiKey} size="sm" disabled={keySaved} className="gap-1">
                      {keySaved ? <><Check className="h-3.5 w-3.5" /> Saved</> : "Save"}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Your API key is stored locally and never sent to any server.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Data */}
        <div>
          <h3 className="font-semibold mb-3">Data Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Uploaded Files</p>
                <p className="text-sm text-muted-foreground">
                  {uploadedFiles.length} file(s) stored locally
                </p>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {(uploadedFiles.reduce((acc, f) => acc + (f.size || 0), 0) / 1024).toFixed(1)} KB total
              </div>
            </div>
            
            {!showClearConfirm ? (
              <Button 
                variant="outline" 
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30" 
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                disabled={uploadedFiles.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                {cleared ? (
                  <div className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium">
                    <Check className="h-4 w-4" />
                    All data cleared!
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>Are you sure?</span>
                    </div>
                    <div className="flex-1" />
                    <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleClearAll}
                      className="gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Yes, Clear
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
