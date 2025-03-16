import enum
from sqlalchemy import Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class InboundStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    ARRIVED = "arrived"
    INSPECTED = "inspected"
    COMPLETED = "completed"
    REJECTED = "rejected"

class Inbound(Base):
    __tablename__ = "inbounds"

    id = Column(Integer, primary_key=True, index=True)
    inbound_number = Column(String, unique=True, index=True)
    expected_date = Column(DateTime, nullable=True)
    arrival_date = Column(DateTime, nullable=True)
    status = Column(Enum(InboundStatus), default=InboundStatus.SCHEDULED)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # リレーション
    inbound_items = relationship("InboundItem", back_populates="inbound", cascade="all, delete-orphan")

class InboundItem(Base):
    __tablename__ = "inbound_items"

    id = Column(Integer, primary_key=True, index=True)
    inbound_id = Column(Integer, ForeignKey("inbounds.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    expected_quantity = Column(Integer, default=0)
    received_quantity = Column(Integer, default=0)
    notes = Column(Text, nullable=True)

    # リレーション
    inbound = relationship("Inbound", back_populates="inbound_items")
    item = relationship("Item", back_populates="inbound_items")
