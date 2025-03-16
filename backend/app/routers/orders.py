"""
Orders router module for handling order-related API endpoints.
"""
from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.core.deps import get_db, get_current_active_user
from app.crud import orders as orders_crud
from app.models.user import User
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse

router = APIRouter()

@router.post("/", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Order:
    """
    新しい注文を作成する
    """
    return orders_crud.create_order(db=db, order=order)

@router.get("/", response_model=List[OrderResponse])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    customer_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> List[Order]:
    """
    注文一覧を取得する
    フィルタリング：
    - customer_id: 特定の顧客の注文のみ
    - start_date: この日付以降の注文
    - end_date: この日付以前の注文
    """
    filters = []
    if customer_id:
        filters.append(Order.customer_id == customer_id)
    if start_date:
        filters.append(Order.order_date >= start_date)
    if end_date:
        filters.append(Order.order_date <= end_date)
    
    return orders_crud.get_orders(
        db=db,
        skip=skip,
        limit=limit,
        filters=filters
    )

@router.get("/{order_id}", response_model=OrderResponse)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Order:
    """
    特定の注文を取得する
    """
    order = orders_crud.get_order(db=db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="注文が見つかりません")
    return order

@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    order_update: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Order:
    """
    注文を更新する
    """
    order = orders_crud.get_order(db=db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="注文が見つかりません")
    return orders_crud.update_order(db=db, order=order, order_update=order_update)

@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> dict:
    """
    注文を削除する
    """
    order = orders_crud.get_order(db=db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="注文が見つかりません")
    orders_crud.delete_order(db=db, order_id=order_id)
    return {"message": "注文を削除しました"} 