"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 5500 },
  { month: "Jul", revenue: 7000 },
];

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for the last 7 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="hsl(221.2 83.2% 53.3%)" fill="hsl(221.2 83.2% 53.3% / 0.2)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
