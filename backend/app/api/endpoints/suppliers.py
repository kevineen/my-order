from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.crud import supplier as crud_supplier
from app.schemas.supplier import Supplier, SupplierCreate, SupplierUpdate
from app.database import get_db
from app.models.user import User

router = APIRouter()

@router.get("", response_model=List[Supplier])
def read_suppliers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """取引先一覧を取得"""
    suppliers = crud_supplier.get_suppliers(db, skip=skip, limit=limit)
    return suppliers

@router.post("", response_model=Supplier, status_code=status.HTTP_201_CREATED)
def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """取引先を新規作成"""
    db_supplier = crud_supplier.get_supplier_by_code(db, code=supplier.code)
    if db_supplier:
        raise HTTPException(
            status_code=400,
            detail="この取引先コードは既に使用されています"
        )
    return crud_supplier.create_supplier(db=db, supplier=supplier)

@router.get("/{supplier_id}", response_model=Supplier)
def read_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """取引先の詳細を取得"""
    db_supplier = crud_supplier.get_supplier(db, supplier_id=supplier_id)
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="取引先が見つかりません")
    return db_supplier

@router.put("/{supplier_id}", response_model=Supplier)
def update_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """取引先情報を更新"""
    db_supplier = crud_supplier.update_supplier(
        db=db,
        supplier_id=supplier_id,
        supplier=supplier
    )
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="取引先が見つかりません")
    return db_supplier

@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """取引先を削除"""
    success = crud_supplier.delete_supplier(db=db, supplier_id=supplier_id)
    if not success:
        raise HTTPException(status_code=404, detail="取引先が見つかりません")
    return None 