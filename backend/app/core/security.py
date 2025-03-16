from datetime import datetime, timedelta
from typing import Optional

from passlib.context import CryptContext
from jose import jwt

# パスワードハッシュのためのコンテキストを設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    プレーンテキストのパスワードとハッシュ化されたパスワードを比較検証します
    
    Args:
        plain_password: プレーンテキストのパスワード
        hashed_password: ハッシュ化されたパスワード
        
    Returns:
        bool: パスワードが一致する場合はTrue、それ以外はFalse
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    パスワードをハッシュ化します
    
    Args:
        password: ハッシュ化するパスワード
        
    Returns:
        str: ハッシュ化されたパスワード
    """
    return pwd_context.hash(password) 