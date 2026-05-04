"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAppStore } from "@/store/useAppStore";

export function UserActivityChart() {
  const { currentFile } = useAppStore();
  const rawData = currentFile?.data;

  const getChartData = () => {
    if (!Array.isArray(rawData) || rawData.length === 0) return { data: [], xKey: "", yKeys: [] };

    const firstRow = rawData[0];
    const numericKeys = Object.keys(firstRow).filter(key => typeof firstRow[key] === 'number');
    const stringKeys = Object.keys(firstRow).filter(key => typeof firstRow[key] === 'string');

    const xKey = stringKeys[0] || Object.keys(firstRow)[0];
    const yKeys = numericKeys.slice(0, 2); // Show top 2 numeric trends

    const data = rawData.slice(0, 15).map(row => {
      const entry: any = { [xKey]: row[xKey] };
      yKeys.forEach(key => {
        entry[key] = typeof row[key] === 'number' ? row[key] : parseFloat(row[key]) || 0;
      });
      return entry;
    });

    return { data, xKey, yKeys };
  };

  const { data, xKey, yKeys } = getChartData();

  if (data.length === 0) return null; // Already handled by RevenueChart or StatsCards showing empty states

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Trend Multi-Analysis</CardTitle>
        <CardDescription>Correlation between {yKeys.join(" and ")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={xKey} 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value > 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {yKeys.map((key, i) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={i === 0 ? "hsl(var(--primary))" : "hsl(195 85% 45%)"} 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
