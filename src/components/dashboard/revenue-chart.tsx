"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppStore } from "@/store/useAppStore";

export function RevenueChart() {
  const { currentFile } = useAppStore();
  const rawData = currentFile?.data;

  const getChartData = () => {
    if (!Array.isArray(rawData) || rawData.length === 0) return { data: [], xKey: "", yKey: "" };

    const firstRow = rawData[0];
    const numericKeys = Object.keys(firstRow).filter(key => typeof firstRow[key] === 'number');
    const stringKeys = Object.keys(firstRow).filter(key => typeof firstRow[key] === 'string');

    const xKey = stringKeys[0] || Object.keys(firstRow)[0];
    const yKey = numericKeys[0] || Object.keys(firstRow)[1];

    // Limit to first 20 records for performance and readability
    const data = rawData.slice(0, 20).map(row => ({
      [xKey]: row[xKey],
      [yKey]: typeof row[yKey] === 'number' ? row[yKey] : parseFloat(row[yKey]) || 0
    }));

    return { data, xKey, yKey };
  };

  const { data, xKey, yKey } = getChartData();

  if (data.length === 0) {
    return (
      <Card className="h-full flex flex-col justify-center items-center p-12 text-center border-dashed">
        <p className="text-muted-foreground italic">No numeric data found to visualize</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{yKey} Analysis</CardTitle>
        <CardDescription>Visualizing {yKey} across {xKey}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={xKey} 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value > 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              itemStyle={{ color: "hsl(var(--primary))" }}
            />
            <Area 
              type="monotone" 
              dataKey={yKey} 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
