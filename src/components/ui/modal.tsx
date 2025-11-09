"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  hideCloseButton?: boolean;
  hideHeader?: boolean;
}

export function Modal({ isOpen, onClose, title, children, hideCloseButton = false, hideHeader = false }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={hideCloseButton ? undefined : onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-2xl">
              {!hideHeader && (
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h2 className="text-xl font-semibold">{title}</h2>
                  {!hideCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}
              <div className="p-6 max-h-[70vh] overflow-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
