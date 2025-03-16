from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class ItemBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    specification: Optional[str] = None
    unit: str = "個"
    unit_price: float = 0.0
    min_stock: int = 0
    current_stock: int = 0
    is_active: bool = True


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    specification: Optional[str] = None
    unit: Optional[str] = None
    unit_price: Optional[float] = None
    min_stock: Optional[int] = None
    current_stock: Optional[int] = None
    is_active: Optional[bool] = None


class ItemInDBBase(ItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class Item(ItemInDBBase):
    pass


class ItemWithStock(Item):
    stock_status: str  # "normal", "low", "out"
