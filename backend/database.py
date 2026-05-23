from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./portfolio.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class ConditionalOrder(Base):
    __tablename__ = "conditional_orders"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    order_type = Column(String) # 'LIMIT' or 'STOP'
    trigger_price = Column(Float)
    quantity = Column(Integer)
    is_active = Column(Boolean, default=True)

class PortfolioItem(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, unique=True, index=True)
    quantity = Column(Integer, default=0)
    average_cost = Column(Float, default=0.0)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
