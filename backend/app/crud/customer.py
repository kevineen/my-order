from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.customer import Customer
from ..schemas.customer import CustomerCreate, CustomerUpdate

def get(db: Session, customer_id: int) -> Optional[Customer]:
    """
    指定されたIDの顧客を取得します
    
    Args:
        db: データベースセッション
        customer_id: 顧客ID
        
    Returns:
        Optional[Customer]: 顧客が存在する場合はその顧客、存在しない場合はNone
    """
    return db.query(Customer).filter(Customer.id == customer_id).first()

def get_by_code(db: Session, code: str) -> Optional[Customer]:
    """
    指定されたコードの顧客を取得します
    
    Args:
        db: データベースセッション
        code: 顧客コード
        
    Returns:
        Optional[Customer]: 顧客が存在する場合はその顧客、存在しない場合はNone
    """
    return db.query(Customer).filter(Customer.code == code).first()

def get_multi(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    is_active: Optional[bool] = None
) -> List[Customer]:
    """
    顧客のリストを取得します
    
    Args:
        db: データベースセッション
        skip: スキップする件数
        limit: 取得する最大件数
        is_active: アクティブな顧客のみを取得する場合はTrue
        
    Returns:
        List[Customer]: 顧客のリスト
    """
    query = db.query(Customer)
    if is_active is not None:
        query = query.filter(Customer.is_active == is_active)
    return query.offset(skip).limit(limit).all()

def create(db: Session, obj_in: CustomerCreate) -> Customer:
    """
    新しい顧客を作成します
    
    Args:
        db: データベースセッション
        obj_in: 作成する顧客のデータ
        
    Returns:
        Customer: 作成された顧客
    """
    db_obj = Customer(
        code=obj_in.code,
        name=obj_in.name,
        contact_person=obj_in.contact_person,
        email=obj_in.email,
        phone=obj_in.phone,
        address=obj_in.address,
        is_active=obj_in.is_active
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, db_obj: Customer, obj_in: CustomerUpdate) -> Customer:
    """
    顧客を更新します
    
    Args:
        db: データベースセッション
        db_obj: 更新する顧客
        obj_in: 更新データ
        
    Returns:
        Customer: 更新された顧客
    """
    update_data = obj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, customer_id: int) -> bool:
    """
    顧客を削除します
    
    Args:
        db: データベースセッション
        customer_id: 削除する顧客のID
        
    Returns:
        bool: 削除に成功した場合はTrue、顧客が存在しない場合はFalse
    """
    obj = db.query(Customer).get(customer_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True 