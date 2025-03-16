"""
Order database model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from app.database import Base

class OrderStatus(str, enum.Enum):
    """注文ステータスの列挙型"""
    PENDING = "pending"  # 保留中
    CONFIRMED = "confirmed"  # 確認済み
    PROCESSING = "processing"  # 処理中
    SHIPPED = "shipped"  # 発送済み
    DELIVERED = "delivered"  # 配達済み
    CANCELLED = "cancelled"  # キャンセル

class Order(Base):
    """
    注文モデル
    
    Attributes:
        id (int): 主キー
        customer_id (int): 顧客ID（外部キー）
        status (str): 注文ステータス
        order_date (datetime): 注文日
        created_at (datetime): 作成日時
        updated_at (datetime): 更新日時
        
        customer (Customer): 顧客（リレーション）
        items (List[OrderItem]): 注文明細リスト
    """
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    order_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    status = Column(
        String,
        nullable=False,
        default=OrderStatus.PENDING
    )
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # リレーションシップ
    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    """
    注文明細モデル
    
    Attributes:
        id (int): 主キー
        order_id (int): 注文ID（外部キー）
        item_id (int): 商品ID（外部キー）
        quantity (int): 数量
        unit_price (float): 単価
        notes (str): 備考
        
        order (Order): 注文（リレーション）
        item (Item): 商品（リレーション）
    """
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    notes = Column(String, nullable=True)

    # リレーションシップ
    order = relationship("Order", back_populates="items")
    item = relationship("Item", back_populates="order_items")
