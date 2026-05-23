"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getMarketPulse, PulseItem } from "@/lib/mockData";

export function MarketPulse() {
  const [pulse, setPulse] = useState<PulseItem[]>([]);

  useEffect(() => {
    const refresh = () => setPulse(getMarketPulse());
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 flex overflow-x-auto p-3 space-x-6 text-sm font-mono shadow-md backdrop-blur-md">
      {pulse.map((item) => {
        const isUp = item.change_percent >= 0;
        return (
          <div key={item.ticker} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="font-bold text-slate-300">{item.ticker}</span>
            <span className="text-slate-100">${item.price.toFixed(2)}</span>
            <span className={`flex items-center ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
              {isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {Math.abs(item.change_percent).toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
