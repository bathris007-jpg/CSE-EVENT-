// Central mock data engine - replaces all backend API calls

export const BASE_PRICES: Record<string, number> = {
  SPY: 510.5,
  QQQ: 440.2,
  NVDA: 880.1,
  AAPL: 170.3,
  MSFT: 415.6,
  F: 12.5,
  T: 16.8,
  KO: 59.2,
  INTC: 31.4,
  PFE: 28.1,
  BTC: 64500.0,
};

export const MARKET_META: Record<string, { marketCap: string; peRatio: number | null; isCrypto: boolean }> = {
  SPY:  { marketCap: "$510B",   peRatio: 22.4,  isCrypto: false },
  QQQ:  { marketCap: "$220B",   peRatio: 35.1,  isCrypto: false },
  NVDA: { marketCap: "$2.1T",   peRatio: 65.8,  isCrypto: false },
  AAPL: { marketCap: "$2.7T",   peRatio: 28.3,  isCrypto: false },
  MSFT: { marketCap: "$3.1T",   peRatio: 34.7,  isCrypto: false },
  F:    { marketCap: "$49B",    peRatio: 6.2,   isCrypto: false },
  T:    { marketCap: "$117B",   peRatio: 8.1,   isCrypto: false },
  KO:   { marketCap: "$256B",   peRatio: 23.5,  isCrypto: false },
  INTC: { marketCap: "$134B",   peRatio: 12.4,  isCrypto: false },
  PFE:  { marketCap: "$159B",   peRatio: 15.9,  isCrypto: false },
  BTC:  { marketCap: "$1.3T",   peRatio: null,  isCrypto: true  },
};

// Simulate a live price with a sin-wave random walk
export function getLivePrice(ticker: string): number {
  const base = BASE_PRICES[ticker] ?? 100;
  const t = Date.now() / 10000;
  const variance = Math.sin(t + ticker.charCodeAt(0)) * base * 0.02;
  const noise = (Math.random() - 0.5) * base * 0.005;
  return Math.round((base + variance + noise) * 100) / 100;
}

export interface PulseItem {
  ticker: string;
  price: number;
  change_percent: number;
  market_cap: string;
  pe_ratio: number | null;
  sentiment: string;
  is_crypto: boolean;
}

export function getMarketPulse(): PulseItem[] {
  return Object.keys(BASE_PRICES).map((ticker) => {
    const price = getLivePrice(ticker);
    const base = BASE_PRICES[ticker];
    const change_percent = Math.round(((price - base) / base) * 10000) / 100;
    const meta = MARKET_META[ticker];
    return {
      ticker,
      price,
      change_percent,
      market_cap: meta.marketCap,
      pe_ratio: meta.peRatio,
      sentiment: change_percent >= -0.2 ? "Bullish" : "Bearish",
      is_crypto: meta.isCrypto,
    };
  });
}

export interface HistoryPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface StockData {
  ticker: string;
  current_price: number;
  market_cap: string;
  pe_ratio: number | null;
  sentiment: string;
  history: HistoryPoint[];
  is_crypto: boolean;
  volume_24h: string | null;
  circulating_supply: string | null;
  hash_rate: string | null;
}

export function getStockData(ticker: string): StockData {
  const t = ticker.toUpperCase();
  const price = getLivePrice(t);
  const meta = MARKET_META[t] ?? { marketCap: "$100B", peRatio: 20, isCrypto: false };

  // Build 30-point history
  let base = price;
  const history: HistoryPoint[] = [];
  for (let i = 30; i > 0; i--) {
    const pt = base * (1 + (Math.random() - 0.5) * 0.05);
    history.push({
      time: `${i}m ago`,
      open: Math.round(pt * 100) / 100,
      high: Math.round(pt * 1.01 * 100) / 100,
      low:  Math.round(pt * 0.99 * 100) / 100,
      close: Math.round(pt * (1 + (Math.random() - 0.5) * 0.01) * 100) / 100,
    });
    base = pt;
  }
  history.reverse();

  return {
    ticker: t,
    current_price: price,
    market_cap: meta.marketCap,
    pe_ratio: meta.peRatio,
    sentiment: Math.random() > 0.4 ? "Bullish" : "Bearish",
    history,
    is_crypto: meta.isCrypto,
    volume_24h: meta.isCrypto ? "$45.2B" : null,
    circulating_supply: meta.isCrypto ? "19.68M BTC" : null,
    hash_rate: meta.isCrypto ? "610 EH/s" : null,
  };
}

// ----- Portfolio (localStorage-backed) -----
export interface PortfolioItem {
  id: number;
  ticker: string;
  quantity: number;
  average_cost: number;
  current_price: number;
  profit_loss: number;
}

const PORTFOLIO_KEY = "alpha_flow_portfolio";

const DEFAULT_PORTFOLIO = [
  { id: 1, ticker: "NVDA", quantity: 5,   average_cost: 860.00 },
  { id: 2, ticker: "AAPL", quantity: 10,  average_cost: 165.50 },
  { id: 3, ticker: "MSFT", quantity: 8,   average_cost: 408.20 },
  { id: 4, ticker: "BTC",  quantity: 1,   average_cost: 62000.00 },
  { id: 5, ticker: "SPY",  quantity: 4,   average_cost: 505.00 },
  { id: 6, ticker: "KO",   quantity: 20,  average_cost: 57.80 },
];

function loadRaw(): { id: number; ticker: string; quantity: number; average_cost: number }[] {
  try {
    const stored = localStorage.getItem(PORTFOLIO_KEY);
    if (!stored) {
      // Seed with defaults on first load
      localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(DEFAULT_PORTFOLIO));
      return DEFAULT_PORTFOLIO;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PORTFOLIO;
  }
}

function saveRaw(items: { id: number; ticker: string; quantity: number; average_cost: number }[]) {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(items));
}

export function getPortfolio(): PortfolioItem[] {
  return loadRaw().map((item) => {
    const live = getLivePrice(item.ticker);
    return {
      ...item,
      current_price: live,
      profit_loss: Math.round((live - item.average_cost) * item.quantity * 100) / 100,
    };
  });
}

export function buyStock(ticker: string, quantity: number, price: number) {
  const items = loadRaw();
  const existing = items.find((i) => i.ticker === ticker);
  if (existing) {
    const totalCost = existing.average_cost * existing.quantity + price * quantity;
    existing.quantity += quantity;
    existing.average_cost = Math.round((totalCost / existing.quantity) * 100) / 100;
  } else {
    items.push({ id: Date.now(), ticker, quantity, average_cost: price });
  }
  saveRaw(items);
}
