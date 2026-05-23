"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { getMarketPulse, PulseItem } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface MarketOverviewProps {
  onSelectStock: (ticker: string) => void;
  selectedTicker: string;
}

export function MarketOverview({ onSelectStock, selectedTicker }: MarketOverviewProps) {
  const [stocks, setStocks] = useState<PulseItem[]>([]);

  useEffect(() => {
    const refresh = () => setStocks(getMarketPulse());
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-900/80 border-slate-800 backdrop-blur shadow-xl">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-100 flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-emerald-500" />
          Market Overview
        </CardTitle>
        <div className="text-xs text-slate-500 font-mono">
          Live Tracking {stocks.length} Assets
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Asset</TableHead>
                <TableHead className="text-right text-slate-400">Price</TableHead>
                <TableHead className="text-right text-slate-400">24h Change</TableHead>
                <TableHead className="text-center text-slate-400">Sentiment</TableHead>
                <TableHead className="text-right text-slate-400 hidden md:table-cell">Market Cap</TableHead>
                <TableHead className="text-right text-slate-400 hidden md:table-cell">P/E Ratio</TableHead>
                <TableHead className="text-right text-slate-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((stock) => {
                const isUp = stock.change_percent >= 0;
                const isSelected = selectedTicker === stock.ticker;
                return (
                  <TableRow
                    key={stock.ticker}
                    className={`border-slate-800 transition-colors cursor-pointer hover:bg-slate-800/30 ${
                      isSelected ? "bg-slate-800/50 border-l-2 border-l-emerald-500" : ""
                    }`}
                    onClick={() => onSelectStock(stock.ticker)}
                  >
                    <TableCell className="font-bold text-slate-200">
                      {stock.ticker}
                      {stock.is_crypto && (
                        <Badge variant="outline" className="ml-2 text-[9px] px-1 py-0 bg-amber-500/10 text-amber-500 border-amber-500/30">CRYPTO</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-300">
                      ${stock.price.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                      <span className="flex items-center justify-end">
                        {isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                        {isUp ? "+" : ""}{stock.change_percent.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 ${
                          stock.sentiment === "Bullish"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {stock.sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-400 hidden md:table-cell">
                      {stock.market_cap}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-400 hidden md:table-cell">
                      {stock.is_crypto ? "N/A" : stock.pe_ratio}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={isSelected ? "secondary" : "outline"}
                        className={`h-7 text-xs px-3 ${
                          isSelected
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                            : "border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-slate-100"
                        }`}
                        onClick={(e) => { e.stopPropagation(); onSelectStock(stock.ticker); }}
                      >
                        {isSelected ? "Viewing" : "Analyze"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
