"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const insights = [
  {
    icon: TrendingUp,
    title: "Performance Increase",
    description: "Your data shows a 20% increase in performance compared to last month.",
    type: "positive",
  },
  {
    icon: AlertCircle,
    title: "Attention Needed",
    description: "User engagement dropped by 5% in the last week. Consider reviewing recent changes.",
    type: "warning",
  },
  {
    icon: Lightbulb,
    title: "Optimization Opportunity",
    description: "Peak activity occurs between 2-4 PM. Schedule important updates during off-peak hours.",
    type: "info",
  },
];

export function AIInsights() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <CardTitle>AI-Generated Insights</CardTitle>
            <CardDescription>Intelligent analysis of your data patterns</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border bg-card p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-10 w-10 rounded-lg flex items-center justify-center ${
                      insight.type === "positive"
                        ? "bg-green-500/10 text-green-500"
                        : insight.type === "warning"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
