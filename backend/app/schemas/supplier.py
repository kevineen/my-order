from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.supplier import SupplierStatus

class SupplierBase(BaseModel):
    code: str
    name: str
    contact_person: str
    email: EmailStr
    phone: str
    address: str
    status: SupplierStatus
    notes: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    status: Optional[SupplierStatus] = None
    notes: Optional[str] = None

class Supplier(SupplierBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 