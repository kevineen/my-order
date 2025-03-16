from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel, Field

from .customer import Customer
from .item import Item
from ..models.order import OrderStatus


class OrderItemBase(BaseModel):
    item_id: int
    quantity: int
    unit_price: float
    notes: Optional[str] = None


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemUpdate(BaseModel):
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    notes: Optional[str] = None


class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


class OrderItem(OrderItemInDBBase):
    pass


class OrderItemWithItem(OrderItem):
    item: Item


class OrderBase(BaseModel):
    """注文の基本スキーマ"""
    customer_id: int = Field(..., description="顧客ID")
    item_id: int = Field(..., description="商品ID")
    quantity: int = Field(..., gt=0, description="数量")
    status: OrderStatus = Field(default=OrderStatus.PENDING, description="注文ステータス")


class OrderCreate(OrderBase):
    """注文作成用スキーマ"""
    order_date: datetime = Field(default_factory=datetime.utcnow, description="注文日時")


class OrderUpdate(BaseModel):
    """注文更新用スキーマ"""
    quantity: Optional[int] = Field(None, gt=0, description="数量")
    status: Optional[OrderStatus] = Field(None, description="注文ステータス")


class OrderResponse(OrderBase):
    """注文レスポンス用スキーマ"""
    id: int = Field(..., description="注文ID")
    order_date: datetime = Field(..., description="注文日時")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")

    class Config:
        """Pydantic設定"""
        from_attributes = True


class OrderInDBBase(OrderBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Order(OrderInDBBase):
    pass


class OrderWithCustomer(Order):
    customer: Customer


class OrderWithItems(Order):
    items: List[OrderItemWithItem]


class OrderDetail(OrderWithCustomer):
    items: List[OrderItemWithItem]
