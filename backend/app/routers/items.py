from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..core.auth import get_current_active_user
from ..database import get_db
from ..schemas.user import User
from ..schemas.item import Item, ItemCreate, ItemUpdate
from ..crud import item as crud_item

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=List[Item])
def read_items(
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    db: Session = Depends(get_db),
):
    items = crud_item.get_multi(db, skip=skip, limit=limit, name=name)
    return items


@router.post("/", response_model=Item)
def create_item(item_in: ItemCreate, db: Session = Depends(get_db)):
    item = crud_item.get_by_code(db, code=item_in.code)
    if item:
        raise HTTPException(
            status_code=400,
            detail=f"部品コード '{item_in.code}' は既に使用されています",
        )
    return crud_item.create(db, obj_in=item_in)


@router.get("/{item_id}", response_model=Item)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = crud_item.get(db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="部品が見つかりません")
    return item


@router.put("/{item_id}", response_model=Item)
def update_item(item_id: int, item_in: ItemUpdate, db: Session = Depends(get_db)):
    item = crud_item.get(db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="部品が見つかりません")
    return crud_item.update(db, db_obj=item, obj_in=item_in)


@router.delete("/{item_id}", response_model=Item)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = crud_item.get(db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="部品が見つかりません")
    return crud_item.remove(db, item_id=item_id)


@router.get("/code/{code}", response_model=Item)
def read_item_by_code(code: str, db: Session = Depends(get_db)):
    item = crud_item.get_by_code(db, code=code)
    if not item:
        raise HTTPException(status_code=404, detail="部品が見つかりません")
    return item
