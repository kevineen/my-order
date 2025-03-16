from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from typing import List, Optional
from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate

def get_supplier(db: Session, supplier_id: int) -> Optional[Supplier]:
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

def get_supplier_by_code(db: Session, code: str) -> Optional[Supplier]:
    return db.query(Supplier).filter(Supplier.code == code).first()

def get_suppliers(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[Supplier]:
    return db.query(Supplier).offset(skip).limit(limit).all()

def create_supplier(db: Session, supplier: SupplierCreate) -> Supplier:
    try:
        db_supplier = Supplier(**supplier.model_dump())
        db.add(db_supplier)
        db.commit()
        db.refresh(db_supplier)
        return db_supplier
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="取引先コードが既に使用されています"
        )

def update_supplier(
    db: Session,
    supplier_id: int,
    supplier: SupplierUpdate
) -> Optional[Supplier]:
    db_supplier = get_supplier(db, supplier_id)
    if not db_supplier:
        return None

    try:
        update_data = supplier.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_supplier, key, value)

        db.commit()
        db.refresh(db_supplier)
        return db_supplier
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="取引先コードが既に使用されています"
        )

def delete_supplier(db: Session, supplier_id: int) -> bool:
    db_supplier = get_supplier(db, supplier_id)
    if not db_supplier:
        return False

    db.delete(db_supplier)
    db.commit()
    return True 