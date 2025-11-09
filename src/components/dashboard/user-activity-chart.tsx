"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: "Mon", activeUsers: 2400, newUsers: 400 },
  { day: "Tue", activeUsers: 1398, newUsers: 300 },
  { day: "Wed", activeUsers: 3800, newUsers: 500 },
  { day: "Thu", activeUsers: 3908, newUsers: 450 },
  { day: "Fri", activeUsers: 4800, newUsers: 600 },
  { day: "Sat", activeUsers: 3800, newUsers: 350 },
  { day: "Sun", activeUsers: 4300, newUsers: 480 },
];

export function UserActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>Active and new users this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="activeUsers" stroke="hsl(221.2 83.2% 53.3%)" strokeWidth={2} />
            <Line type="monotone" dataKey="newUsers" stroke="hsl(173 58% 39%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
