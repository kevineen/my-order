"""
CRUD operations for orders.
"""
from typing import List, Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate

def get_order(db: Session, order_id: int) -> Optional[Order]:
    """
    指定されたIDの注文を取得する
    
    Args:
        db: データベースセッション
        order_id: 注文ID
    
    Returns:
        Optional[Order]: 注文オブジェクト（存在しない場合はNone）
    """
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    filters: List[Any] = None
) -> List[Order]:
    """
    注文一覧を取得する
    
    Args:
        db: データベースセッション
        skip: スキップする件数
        limit: 取得する最大件数
        filters: フィルター条件のリスト
    
    Returns:
        List[Order]: 注文オブジェクトのリスト
    """
    query = db.query(Order)
    if filters:
        query = query.filter(and_(*filters))
    return query.offset(skip).limit(limit).all()

def create_order(db: Session, order: OrderCreate) -> Order:
    """
    新しい注文を作成する
    
    Args:
        db: データベースセッション
        order: 作成する注文データ
    
    Returns:
        Order: 作成された注文オブジェクト
    """
    db_order = Order(
        customer_id=order.customer_id,
        item_id=order.item_id,
        quantity=order.quantity,
        order_date=order.order_date,
        status=order.status
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order(db: Session, order: Order, order_update: OrderUpdate) -> Order:
    """
    注文を更新する
    
    Args:
        db: データベースセッション
        order: 更新する注文オブジェクト
        order_update: 更新データ
    
    Returns:
        Order: 更新された注文オブジェクト
    """
    update_data = order_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

def delete_order(db: Session, order_id: int) -> None:
    """
    注文を削除する
    
    Args:
        db: データベースセッション
        order_id: 削除する注文のID
    """
    order = get_order(db=db, order_id=order_id)
    if order:
        db.delete(order)
        db.commit() 