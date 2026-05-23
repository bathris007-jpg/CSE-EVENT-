"use client";

import { useEffect, useState } from "react";
import { getPortfolio, PortfolioItem } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const refresh = () => setPortfolio(getPortfolio());
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalValue = portfolio.reduce((acc, item) => acc + item.current_price * item.quantity, 0);
  const totalPL = portfolio.reduce((acc, item) => acc + item.profit_loss, 0);

  return (
    <Card className="w-full bg-slate-900/80 border-slate-800 backdrop-blur shadow-xl mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-slate-100">Your Portfolio</CardTitle>
        <div className="text-right">
          <div className="text-sm text-slate-400">Total Value</div>
          <div className="text-xl font-mono text-slate-100">${totalValue.toFixed(2)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-right">
          <div className="text-sm text-slate-400">Total P/L</div>
          <div className={`text-lg font-mono ${totalPL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {totalPL >= 0 ? "+" : ""}{totalPL.toFixed(2)}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead className="text-slate-400">Ticker</TableHead>
              <TableHead className="text-right text-slate-400">Qty</TableHead>
              <TableHead className="text-right text-slate-400">Avg Cost</TableHead>
              <TableHead className="text-right text-slate-400">Current</TableHead>
              <TableHead className="text-right text-slate-400">P/L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.length === 0 && (
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                  No positions yet. Buy a stock above to get started!
                </TableCell>
              </TableRow>
            )}
            {portfolio.map((item) => (
              <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-bold text-slate-200">{item.ticker}</TableCell>
                <TableCell className="text-right font-mono text-slate-300">{item.quantity}</TableCell>
                <TableCell className="text-right font-mono text-slate-300">${item.average_cost.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-slate-300">${item.current_price.toFixed(2)}</TableCell>
                <TableCell className={`text-right font-mono ${item.profit_loss >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {item.profit_loss >= 0 ? "+" : ""}{item.profit_loss.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
