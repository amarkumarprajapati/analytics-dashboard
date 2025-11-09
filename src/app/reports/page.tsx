"use client";

import { motion } from "framer-motion";

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      <p className="text-muted-foreground">
        View and download your analysis reports
      </p>
      
      <div className="flex items-center justify-center min-h-[400px] rounded-2xl border border-dashed">
        <p className="text-muted-foreground">Reports feature coming soon...</p>
      </div>
    </motion.div>
  );
}
