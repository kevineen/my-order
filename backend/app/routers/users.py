from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from ..core.auth import authenticate_user, create_access_token, get_current_active_user, get_current_admin_user
from ..core.config import settings
from ..database import get_db
from ..schemas.token import Token
from ..schemas.user import User, UserCreate, UserUpdate
from ..crud import user as crud_user

router = APIRouter(prefix="/api/auth", tags=["auth"])
users_router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザー名またはパスワードが無効です",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/validate")
async def validate_token(current_user: User = Depends(get_current_active_user)):
    return {"status": "ok", "username": current_user.username}


@users_router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    user = crud_user.get_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="このユーザー名は既に使用されています",
        )
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="このメールアドレスは既に使用されています",
        )
    return crud_user.create(db, obj_in=user_in)


@users_router.get("/", response_model=List[User])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    users = crud_user.get_multi(db, skip=skip, limit=limit)
    return users


@users_router.get("/me", response_model=User)
async def read_user_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@users_router.put("/me", response_model=User)
async def update_user_me(user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    user = crud_user.update(db, db_obj=current_user, obj_in=user_in)
    return user


@users_router.get("/{user_id}", response_model=User)
async def read_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    user = crud_user.get(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return user


@users_router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    user = crud_user.get(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    user = crud_user.update(db, db_obj=user, obj_in=user_in)
    return user
