from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel

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
        orm_mode = True


class OrderItem(OrderItemInDBBase):
    pass


class OrderItemWithItem(OrderItem):
    item: Item


class OrderBase(BaseModel):
    customer_id: int
    order_number: Optional[str] = None
    order_date: Optional[datetime] = None
    delivery_date: Optional[datetime] = None
    status: OrderStatus = OrderStatus.DRAFT
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    customer_id: Optional[int] = None
    order_date: Optional[datetime] = None
    delivery_date: Optional[datetime] = None
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None


class OrderInDBBase(OrderBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class Order(OrderInDBBase):
    pass


class OrderWithCustomer(Order):
    customer: Customer


class OrderWithItems(Order):
    items: List[OrderItemWithItem]


class OrderDetail(OrderWithCustomer):
    items: List[OrderItemWithItem]
