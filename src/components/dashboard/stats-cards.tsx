"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    trend: "up",
    icon: TrendingUp,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
