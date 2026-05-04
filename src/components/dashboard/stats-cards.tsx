"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Database, FileText, Activity, Layers, Target } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

export function StatsCards() {
  const { currentFile } = useAppStore();
  const data = currentFile?.data;

  // Dynamic stat extraction
  const getStats = () => {
    const defaultStats = [
      {
        title: "Total Records",
        value: Array.isArray(data) ? data.length.toLocaleString() : "0",
        label: "Data Density",
        icon: Database,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        title: "File Extension",
        value: currentFile?.name.split('.').pop()?.toUpperCase() || "N/A",
        label: "Source Format",
        icon: FileText,
        color: "text-sky-500",
        bg: "bg-sky-500/10",
      },
      {
        title: "Footprint",
        value: currentFile ? (currentFile.size / 1024).toFixed(1) + " KB" : "0 KB",
        label: "Storage Used",
        icon: Layers,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      },
      {
        title: "Attribute Count",
        value: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]).length.toString() : "0",
        label: "Feature Space",
        icon: Target,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
    ];

    if (!Array.isArray(data) || data.length === 0) return defaultStats;

    const firstRow = data[0];
    const numericKeys = Object.keys(firstRow).filter(key => typeof firstRow[key] === 'number');
    
    if (numericKeys.length > 0) {
      const sum = data.reduce((acc, row) => acc + (row[numericKeys[0]] || 0), 0);
      defaultStats[0] = {
        title: `Aggregate ${numericKeys[0]}`,
        value: sum > 1000000 ? (sum / 1000000).toFixed(1) + "M" : sum.toLocaleString(),
        label: "Computed Sum",
        icon: DollarSign,
        color: "text-primary",
        bg: "bg-primary/10",
      };
    }

    return defaultStats;
  };

  const activeStats = getStats();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {activeStats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card overflow-hidden border-none relative group">
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                 <Icon className="h-12 w-12" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                   <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                   <div className={`p-1 rounded-md ${stat.bg} ${stat.color}`}>
                      <Activity className="h-3 w-3" />
                   </div>
                   <p className="text-[10px] font-bold uppercase tracking-tighter opacity-60">
                     {stat.label}
                   </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
