from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database import Base

class Customer(Base):
    """
    顧客モデル
    
    Attributes:
        id (int): 主キー
        code (str): 顧客コード（一意）
        name (str): 顧客名
        contact_person (str): 担当者名
        email (str): メールアドレス
        phone (str): 電話番号
        address (str): 住所
        is_active (bool): アクティブフラグ
        created_at (datetime): 作成日時
        updated_at (datetime): 更新日時
        orders (List[Order]): この顧客の注文リスト
    """
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # リレーションシップ
    orders = relationship("Order", back_populates="customer") 