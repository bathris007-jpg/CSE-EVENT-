"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface StockChartProps {
  data: any;
}

export function StockChart({ data }: StockChartProps) {
  if (!data) return (
    <Card className="w-full h-full bg-slate-900/50 border-slate-800 backdrop-blur flex items-center justify-center">
      <div className="text-slate-500 font-mono">Select a stock to view analysis</div>
    </Card>
  );

  const isBullish = data.sentiment === "Bullish";

  return (
    <Card className="w-full bg-slate-900/80 border-slate-800 backdrop-blur shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-3xl font-bold text-slate-100">{data.ticker}</CardTitle>
          <div className="text-2xl font-mono text-emerald-400">${data.current_price.toFixed(2)}</div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Badge variant="outline" className={`${isBullish ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50' : 'bg-rose-500/10 text-rose-400 border-rose-500/50'}`}>
            AI Sentiment: {data.sentiment}
          </Badge>
          <div className="flex space-x-4 text-xs font-mono text-slate-400">
            <span>MCAP: {data.market_cap}</span>
            <span>P/E: {data.pe_ratio}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isBullish ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isBullish ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke={isBullish ? "#10b981" : "#f43f5e"} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
