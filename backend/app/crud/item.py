from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.item import Item
from ..schemas.item import ItemCreate, ItemUpdate

def get(db: Session, item_id: int) -> Optional[Item]:
    """
    指定されたIDの商品を取得します
    
    Args:
        db: データベースセッション
        item_id: 商品ID
        
    Returns:
        Optional[Item]: 商品が存在する場合はその商品、存在しない場合はNone
    """
    return db.query(Item).filter(Item.id == item_id).first()

def get_by_code(db: Session, code: str) -> Optional[Item]:
    """
    指定されたコードの商品を取得します
    
    Args:
        db: データベースセッション
        code: 商品コード
        
    Returns:
        Optional[Item]: 商品が存在する場合はその商品、存在しない場合はNone
    """
    return db.query(Item).filter(Item.code == code).first()

def get_multi(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    is_active: Optional[bool] = None
) -> List[Item]:
    """
    商品のリストを取得します
    
    Args:
        db: データベースセッション
        skip: スキップする件数
        limit: 取得する最大件数
        is_active: アクティブな商品のみを取得する場合はTrue
        
    Returns:
        List[Item]: 商品のリスト
    """
    query = db.query(Item)
    if is_active is not None:
        query = query.filter(Item.is_active == is_active)
    return query.offset(skip).limit(limit).all()

def create(db: Session, obj_in: ItemCreate) -> Item:
    """
    新しい商品を作成します
    
    Args:
        db: データベースセッション
        obj_in: 作成する商品のデータ
        
    Returns:
        Item: 作成された商品
    """
    db_obj = Item(
        code=obj_in.code,
        name=obj_in.name,
        description=obj_in.description,
        specification=obj_in.specification,
        unit=obj_in.unit,
        unit_price=obj_in.unit_price,
        min_stock=obj_in.min_stock,
        current_stock=obj_in.current_stock,
        is_active=obj_in.is_active
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, db_obj: Item, obj_in: ItemUpdate) -> Item:
    """
    商品を更新します
    
    Args:
        db: データベースセッション
        db_obj: 更新する商品
        obj_in: 更新データ
        
    Returns:
        Item: 更新された商品
    """
    update_data = obj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, item_id: int) -> bool:
    """
    商品を削除します
    
    Args:
        db: データベースセッション
        item_id: 削除する商品のID
        
    Returns:
        bool: 削除に成功した場合はTrue、商品が存在しない場合はFalse
    """
    obj = db.query(Item).get(item_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True 