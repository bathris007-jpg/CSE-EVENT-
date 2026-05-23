from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import random
import time
import math
from typing import List

from database import get_db, PortfolioItem
import models

app = FastAPI(title="Alpha-Flow Backend")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock base prices (Tech + Economical/Value Stocks)
BASE_PRICES = {
    # Tech Giants
    "SPY": 510.50,
    "QQQ": 440.20,
    "NVDA": 880.10,
    "AAPL": 170.30,
    "MSFT": 415.60,
    # Economical / Value Picks
    "F": 12.50,      # Ford
    "T": 16.80,      # AT&T
    "KO": 59.20,     # Coca-Cola
    "INTC": 31.40,   # Intel
    "PFE": 28.10,     # Pfizer
    # Crypto
    "BTC": 64500.00
}


def get_live_price(ticker: str) -> float:
    # Simulate a live price with a random walk around the base price
    base = BASE_PRICES.get(ticker, 100.0)
    # small random variance based on current time
    variance = math.sin(time.time() / 10.0 + hash(ticker)) * (base * 0.02)
    noise = random.uniform(-base * 0.005, base * 0.005)
    return round(base + variance + noise, 2)

@app.get("/api/market/pulse", response_model=List[models.MarketPulseResponse])
def get_market_pulse():
    pulse = []
    for ticker, base in BASE_PRICES.items():
        price = get_live_price(ticker)
        change_pct = ((price - base) / base) * 100
        ticker_hash = abs(hash(ticker))
        
        is_crypto = ticker == "BTC"
        # Deterministic mock stats for overview
        market_cap = "$1.3T" if is_crypto else f"${(ticker_hash % 2900) + 100}B"
        pe_ratio = None if is_crypto else round((ticker_hash % 60) + 12.5, 1)
        sentiment = "Bullish" if change_pct >= -0.2 else "Bearish"
        
        pulse.append(
            models.MarketPulseResponse(
                ticker=ticker,
                price=price,
                change_percent=round(change_pct, 2),
                market_cap=market_cap,
                pe_ratio=pe_ratio,
                sentiment=sentiment,
                is_crypto=is_crypto
            )
        )
    return pulse


@app.get("/api/market/stock/{ticker}", response_model=models.StockDataResponse)
def get_stock_data(ticker: str):
    ticker = ticker.upper()
    current_price = get_live_price(ticker)
    
    # Generate mock history for charts (last 30 points)
    history = []
    base = current_price
    for i in range(30, 0, -1):
        pt_price = base * (1 + random.uniform(-0.05, 0.05))
        history.append({
            "time": f"{i}m ago",
            "open": round(pt_price, 2),
            "high": round(pt_price * 1.01, 2),
            "low": round(pt_price * 0.99, 2),
            "close": round(pt_price * (1 + random.uniform(-0.01, 0.01)), 2),
        })
        base = pt_price # walk backwards slightly
    history.reverse()

    # Mock metrics
    is_crypto = ticker == "BTC"
    sentiment = "Bullish" if random.random() > 0.4 else "Bearish"
    market_cap = "$1.3T" if is_crypto else f"${random.randint(100, 3000)}B"
    pe_ratio = None if is_crypto else round(random.uniform(10.0, 80.0), 1)
    
    volume_24h = "$45.2B" if is_crypto else None
    circulating_supply = "19.68M BTC" if is_crypto else None
    hash_rate = "610 EH/s" if is_crypto else None

    return models.StockDataResponse(
        ticker=ticker,
        current_price=current_price,
        market_cap=market_cap,
        pe_ratio=pe_ratio,
        sentiment=sentiment,
        history=history,
        is_crypto=is_crypto,
        volume_24h=volume_24h,
        circulating_supply=circulating_supply,
        hash_rate=hash_rate
    )

@app.get("/api/portfolio", response_model=List[models.PortfolioItemResponse])
def get_portfolio(db: Session = Depends(get_db)):
    items = db.query(PortfolioItem).all()
    response = []
    for item in items:
        live_price = get_live_price(item.ticker)
        profit_loss = (live_price - item.average_cost) * item.quantity
        response.append(
            models.PortfolioItemResponse(
                id=item.id,
                ticker=item.ticker,
                quantity=item.quantity,
                average_cost=item.average_cost,
                current_price=live_price,
                profit_loss=round(profit_loss, 2)
            )
        )
    return response

@app.post("/api/portfolio/buy")
def buy_stock(req: models.BuyStockRequest, db: Session = Depends(get_db)):
    ticker = req.ticker.upper()
    item = db.query(PortfolioItem).filter(PortfolioItem.ticker == ticker).first()
    
    if item:
        # Update average cost
        total_cost = (item.average_cost * item.quantity) + (req.price * req.quantity)
        item.quantity += req.quantity
        item.average_cost = total_cost / item.quantity
    else:
        # Create new
        item = PortfolioItem(
            ticker=ticker,
            quantity=req.quantity,
            average_cost=req.price
        )
        db.add(item)
    
    db.commit()
    db.refresh(item)
    return {"status": "success", "message": f"Bought {req.quantity} shares of {ticker}"}
