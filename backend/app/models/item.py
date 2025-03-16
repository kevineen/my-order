from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database import Base

class Item(Base):
    """
    商品モデル
    
    Attributes:
        id (int): 主キー
        code (str): 商品コード（一意）
        name (str): 商品名
        description (str): 商品説明
        specification (str): 仕様
        unit (str): 単位（例：個、kg、など）
        unit_price (float): 単価
        min_stock (int): 最小在庫数
        current_stock (int): 現在の在庫数
        is_active (bool): アクティブフラグ
        created_at (datetime): 作成日時
        updated_at (datetime): 更新日時
        order_items (List[OrderItem]): この商品の注文明細リスト
    """
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    specification = Column(String, nullable=True)
    unit = Column(String, default="個")
    unit_price = Column(Float, default=0.0)
    min_stock = Column(Integer, default=0)
    current_stock = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # リレーションシップ
    order_items = relationship("OrderItem", back_populates="item") 