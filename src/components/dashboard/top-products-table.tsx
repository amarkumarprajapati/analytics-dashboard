"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  { name: "Wireless Headphones", sales: 1234, revenue: "$24,680", trend: "+12%" },
  { name: "Smart Watch", sales: 987, revenue: "$19,740", trend: "+8%" },
  { name: "Laptop Stand", sales: 856, revenue: "$17,120", trend: "+15%" },
  { name: "USB-C Hub", sales: 743, revenue: "$14,860", trend: "+5%" },
  { name: "Mechanical Keyboard", sales: 652, revenue: "$13,040", trend: "+20%" },
];

export function TopProductsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-right p-4 font-medium">Sales</th>
                <th className="text-right p-4 font-medium">Revenue</th>
                <th className="text-right p-4 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name} className="border-b last:border-0">
                  <td className="p-4">{product.name}</td>
                  <td className="text-right p-4">{product.sales}</td>
                  <td className="text-right p-4 font-medium">{product.revenue}</td>
                  <td className="text-right p-4">
                    <span className="text-green-600">{product.trend}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
