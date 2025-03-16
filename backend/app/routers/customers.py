from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.auth import get_current_active_user
from ..database import get_db
from ..schemas.user import User
from ..schemas.customer import Customer, CustomerCreate, CustomerUpdate
from ..crud import customer as crud_customer

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("/", response_model=List[Customer])
def read_customers(
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    db: Session = Depends(get_db),
):
    customers = crud_customer.get_multi(db, skip=skip, limit=limit, name=name)
    return customers


@router.post("/", response_model=Customer)
def create_customer(customer_in: CustomerCreate, db: Session = Depends(get_db)):
    customer = crud_customer.get_by_code(db, code=customer_in.code)
    if customer:
        raise HTTPException(
            status_code=400,
            detail=f"顧客コード '{customer_in.code}' は既に使用されています",
        )
    return crud_customer.create(db, obj_in=customer_in)


@router.get("/{customer_id}", response_model=Customer)
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud_customer.get(db, customer_id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="顧客が見つかりません")
    return customer


@router.put("/{customer_id}", response_model=Customer)
def update_customer(customer_id: int, customer_in: CustomerUpdate, db: Session = Depends(get_db)):
    customer = crud_customer.get(db, customer_id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="顧客が見つかりません")
    return crud_customer.update(db, db_obj=customer, obj_in=customer_in)


@router.delete("/{customer_id}", response_model=Customer)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud_customer.get(db, customer_id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="顧客が見つかりません")
    return crud_customer.remove(db, customer_id=customer_id)


@router.get("/code/{code}", response_model=Customer)
def read_customer_by_code(code: str, db: Session = Depends(get_db)):
    customer = crud_customer.get_by_code(db, code=code)
    if not customer:
        raise HTTPException(status_code=404, detail="顧客が見つかりません")
    return customer
