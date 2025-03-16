from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.order import Order, OrderItem
from ..schemas.order import OrderCreate, OrderUpdate, OrderItemCreate

def get(db: Session, order_id: int) -> Optional[Order]:
    """
    指定されたIDの注文を取得します
    
    Args:
        db: データベースセッション
        order_id: 注文ID
        
    Returns:
        Optional[Order]: 注文が存在する場合はその注文、存在しない場合はNone
    """
    return db.query(Order).filter(Order.id == order_id).first()

def get_by_order_number(db: Session, order_number: str) -> Optional[Order]:
    """
    指定された注文番号の注文を取得します
    
    Args:
        db: データベースセッション
        order_number: 注文番号
        
    Returns:
        Optional[Order]: 注文が存在する場合はその注文、存在しない場合はNone
    """
    return db.query(Order).filter(Order.order_number == order_number).first()

def get_multi(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    customer_id: Optional[int] = None
) -> List[Order]:
    """
    注文のリストを取得します
    
    Args:
        db: データベースセッション
        skip: スキップする件数
        limit: 取得する最大件数
        customer_id: 特定の顧客の注文のみを取得する場合は顧客ID
        
    Returns:
        List[Order]: 注文のリスト
    """
    query = db.query(Order)
    if customer_id:
        query = query.filter(Order.customer_id == customer_id)
    return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

def create(db: Session, obj_in: OrderCreate) -> Order:
    """
    新しい注文を作成します
    
    Args:
        db: データベースセッション
        obj_in: 作成する注文のデータ
        
    Returns:
        Order: 作成された注文
    """
    # 注文の基本情報を作成
    db_obj = Order(
        customer_id=obj_in.customer_id,
        order_number=obj_in.order_number,
        order_date=obj_in.order_date or datetime.utcnow(),
        delivery_date=obj_in.delivery_date,
        status=obj_in.status,
        notes=obj_in.notes
    )
    db.add(db_obj)
    db.flush()  # IDを生成するためにflush

    # 注文明細を作成
    for item in obj_in.items:
        order_item = OrderItem(
            order_id=db_obj.id,
            item_id=item.item_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            notes=item.notes
        )
        db.add(order_item)

    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, db_obj: Order, obj_in: OrderUpdate) -> Order:
    """
    注文を更新します
    
    Args:
        db: データベースセッション
        db_obj: 更新する注文
        obj_in: 更新データ
        
    Returns:
        Order: 更新された注文
    """
    update_data = obj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, order_id: int) -> bool:
    """
    注文を削除します
    
    Args:
        db: データベースセッション
        order_id: 削除する注文のID
        
    Returns:
        bool: 削除に成功した場合はTrue、注文が存在しない場合はFalse
    """
    obj = db.query(Order).get(order_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def add_items(db: Session, order: Order, items: List[OrderItemCreate]) -> Order:
    """
    既存の注文に商品を追加します
    
    Args:
        db: データベースセッション
        order: 注文オブジェクト
        items: 追加する商品のリスト
        
    Returns:
        Order: 更新された注文
    """
    for item in items:
        order_item = OrderItem(
            order_id=order.id,
            item_id=item.item_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            notes=item.notes
        )
        db.add(order_item)
    
    db.commit()
    db.refresh(order)
    return order

def remove_item(db: Session, order_item_id: int) -> bool:
    """
    注文から商品を削除します
    
    Args:
        db: データベースセッション
        order_item_id: 削除する注文明細のID
        
    Returns:
        bool: 削除に成功した場合はTrue、注文明細が存在しない場合はFalse
    """
    obj = db.query(OrderItem).get(order_item_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True 