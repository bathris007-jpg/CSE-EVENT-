"use client";

import { useState, useEffect } from "react";
import { getStockData, buyStock, StockData } from "@/lib/mockData";
import { MarketPulse } from "@/components/MarketPulse";
import { StockChart } from "@/components/StockChart";
import { Portfolio } from "@/components/Portfolio";
import { MarketOverview } from "@/components/MarketOverview";
import { PortfolioAllocation } from "@/components/PortfolioAllocation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, DollarSign, Activity, Cpu, Coins } from "lucide-react";

export default function Dashboard() {
  const [searchTicker, setSearchTicker] = useState("NVDA");
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buyLoading, setBuyLoading] = useState(false);

  const fetchStockData = (ticker: string) => {
    if (!ticker) return;
    setSelectedStock(getStockData(ticker));
  };

  useEffect(() => {
    fetchStockData(searchTicker);
    const interval = setInterval(() => {
      if (searchTicker) fetchStockData(searchTicker);
    }, 5000);
    return () => clearInterval(interval);
  }, [searchTicker]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("ticker") as HTMLInputElement;
    if (input.value) {
      setSearchTicker(input.value.toUpperCase());
    }
  };

  const handleBuy = () => {
    if (!selectedStock) return;
    setBuyLoading(true);
    buyStock(selectedStock.ticker, buyQuantity, selectedStock.current_price);
    setTimeout(() => {
      setBuyLoading(false);
      alert(`Successfully bought ${buyQuantity} shares of ${selectedStock.ticker} at $${selectedStock.current_price.toFixed(2)}`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
      {/* Top Navbar / Market Pulse */}
      <MarketPulse />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          <Card className="bg-slate-900/80 border-slate-800 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center">
                <Search className="mr-2 h-5 w-5 text-emerald-500" />
                Asset Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  name="ticker"
                  placeholder="e.g. AAPL, MSFT, BTC"
                  className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  defaultValue={searchTicker}
                />
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Analyze
                </Button>
              </form>
            </CardContent>
          </Card>

          {selectedStock && (
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-emerald-500" />
                  Trade Execution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-md border border-slate-800">
                  <span className="text-slate-400">Current Price</span>
                  <span className="font-mono font-bold text-emerald-400">${selectedStock.current_price.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Quantity (Shares)</label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      className="border-slate-700 hover:bg-slate-800 hover:text-slate-100"
                      onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                    >-</Button>
                    <Input
                      type="number"
                      min="1"
                      value={buyQuantity}
                      onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 1)}
                      className="bg-slate-950 border-slate-800 text-center font-mono text-slate-100"
                    />
                    <Button
                      variant="outline"
                      className="border-slate-700 hover:bg-slate-800 hover:text-slate-100"
                      onClick={() => setBuyQuantity(buyQuantity + 1)}
                    >+</Button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12"
                    onClick={handleBuy}
                    disabled={buyLoading}
                  >
                    {buyLoading ? "Processing..." : `Buy for $${(selectedStock.current_price * buyQuantity).toFixed(2)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedStock?.is_crypto && (
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur shadow-xl border-t-2 border-t-amber-500">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-amber-500" />
                  Crypto Network Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-md border border-slate-800">
                  <span className="text-slate-400 flex items-center text-sm"><Coins className="mr-2 h-4 w-4" /> 24h Volume</span>
                  <span className="font-mono text-slate-200">{selectedStock.volume_24h ?? "N/A"}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-md border border-slate-800">
                  <span className="text-slate-400 flex items-center text-sm"><Activity className="mr-2 h-4 w-4" /> Circulating Supply</span>
                  <span className="font-mono text-slate-200">{selectedStock.circulating_supply ?? "N/A"}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-md border border-slate-800">
                  <span className="text-slate-400 flex items-center text-sm"><Cpu className="mr-2 h-4 w-4" /> Network Hash Rate</span>
                  <span className="font-mono text-slate-200">{selectedStock.hash_rate ?? "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <PortfolioAllocation />
        </div>

        {/* Right Main Area */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <StockChart data={selectedStock} />
          </div>
          <div>
            <MarketOverview
              onSelectStock={(ticker) => setSearchTicker(ticker)}
              selectedTicker={searchTicker}
            />
          </div>
          <div>
            <Portfolio />
          </div>
        </div>

      </main>
    </div>
  );
}
