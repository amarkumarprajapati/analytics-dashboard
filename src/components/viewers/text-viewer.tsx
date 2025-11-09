"use client";

import { motion } from "framer-motion";

interface TextViewerProps {
  content: string;
  fileName?: string;
}

export function TextViewer({ content, fileName }: TextViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full rounded-lg border overflow-hidden flex flex-col"
    >
      <div className="bg-muted px-4 py-2 border-b flex-shrink-0">
        <p className="text-sm font-medium">Text Viewer - {fileName || "Untitled"}</p>
      </div>
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-6 font-mono text-sm whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </motion.div>
  );
}
