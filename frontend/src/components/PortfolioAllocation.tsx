"use client";

import { useEffect, useState } from "react";
import { getPortfolio, PortfolioItem } from "@/lib/mockData";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#14b8a6", "#6366f1", "#f43f5e"];

export function PortfolioAllocation() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const refresh = () => setPortfolio(getPortfolio());
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const chartData = portfolio.map((item) => ({
    name: item.ticker,
    value: item.current_price * item.quantity,
  }));

  const totalValue = chartData.reduce((acc, item) => acc + item.value, 0);

  if (portfolio.length === 0) {
    return (
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur shadow-xl h-full min-h-[320px] flex items-center justify-center">
        <div className="text-slate-500 font-mono p-6 text-center flex flex-col items-center">
          <PieChartIcon className="h-12 w-12 text-slate-700 mb-3" />
          No holdings to allocate. Start trading above.
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 border-slate-800 backdrop-blur shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-slate-100 flex items-center">
          <PieChartIcon className="mr-2 h-5 w-5 text-emerald-500" />
          Portfolio Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: unknown) => [`$${Number(value).toFixed(2)}`, "Value"]}
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#f8fafc" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 w-full text-xs font-mono px-2">
          {chartData.map((item, index) => {
            const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
            return (
              <div key={item.name} className="flex items-center justify-between border-b border-slate-800/50 pb-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-bold text-slate-300">{item.name}</span>
                </div>
                <span className="text-slate-400 font-bold">{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
