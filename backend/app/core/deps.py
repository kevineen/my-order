"""
Dependencies module for FastAPI application.
This module contains all the dependency functions used across the application.
"""
from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User

# OAuth2のトークンURL設定
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_db() -> Generator[Session, None, None]:
    """
    データベースセッションの依存関係を提供する関数
    
    Yields:
        Session: SQLAlchemyのデータベースセッション
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    現在のユーザーを取得する関数
    
    Args:
        db (Session): データベースセッション
        token (str): JWTトークン
    
    Returns:
        User: 現在のユーザーオブジェクト
    
    Raises:
        HTTPException: 認証に失敗した場合
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証情報が無効です",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    現在のアクティブなユーザーを取得する関数
    
    Args:
        current_user (User): 現在のユーザーオブジェクト
    
    Returns:
        User: アクティブなユーザーオブジェクト
    
    Raises:
        HTTPException: ユーザーが非アクティブの場合
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このユーザーは非アクティブです"
        )
    return current_user 