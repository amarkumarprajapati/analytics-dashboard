"use client";

import { motion } from "framer-motion";
import { FileX, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-6"
      >
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <FileX className="h-12 w-12 text-primary" />
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold mb-2">No Files Uploaded Yet</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Drag your Excel or PDF file to start analyzing your data and get valuable insights.
      </p>

      <Link href="/upload">
        <Button size="lg" className="gap-2">
          <Upload className="h-5 w-5" />
          Upload Your First File
        </Button>
      </Link>

      <div className="mt-12 grid grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-primary mb-1">📊</div>
          <p className="text-sm text-muted-foreground">Visual Analytics</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-1">🤖</div>
          <p className="text-sm text-muted-foreground">AI Insights</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-1">⚡</div>
          <p className="text-sm text-muted-foreground">Instant Results</p>
        </div>
      </div>
    </motion.div>
  );
}
