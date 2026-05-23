from pydantic import BaseModel
from typing import Optional, List, Dict

class BuyStockRequest(BaseModel):
    ticker: str
    quantity: int
    price: float

class ConditionalOrderRequest(BaseModel):
    ticker: str
    order_type: str # 'LIMIT' or 'STOP'
    trigger_price: float
    quantity: int

class ConditionalOrderResponse(BaseModel):
    id: int
    ticker: str
    order_type: str
    trigger_price: float
    quantity: int
    is_active: bool

    class Config:
        from_attributes = True

class PortfolioItemResponse(BaseModel):
    id: int
    ticker: str
    quantity: int
    average_cost: float
    current_price: float = 0.0
    profit_loss: float = 0.0

    class Config:
        from_attributes = True

class MarketPulseResponse(BaseModel):
    ticker: str
    price: float
    change_percent: float
    market_cap: str
    pe_ratio: Optional[float] = None
    sentiment: str
    is_crypto: bool = False


class StockDataResponse(BaseModel):
    ticker: str
    current_price: float
    market_cap: str
    pe_ratio: Optional[float] = None
    sentiment: str
    history: List[Dict]
    is_crypto: bool = False
    volume_24h: Optional[str] = None
    circulating_supply: Optional[str] = None
    hash_rate: Optional[str] = None
    predictive_confidence: Optional[float] = 0.0
    breakout_probability: Optional[float] = 0.0
    volatility_index: Optional[float] = 0.0
    volume_trend: Optional[float] = 0.0
