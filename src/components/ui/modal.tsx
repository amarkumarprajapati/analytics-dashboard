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
            className="fixed inset-0 bg-black/20 dark:bg-black/80 backdrop-blur-[2px] z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div 
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[2.5rem] border border-border bg-white dark:bg-black text-black dark:text-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {!hideHeader && (
                <div className="flex items-center justify-between border-b border-border px-8 py-6 shrink-0 bg-white dark:bg-black">
                  <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                  {!hideCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="rounded-2xl h-11 w-11 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 active:scale-95"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  )}
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-black">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
