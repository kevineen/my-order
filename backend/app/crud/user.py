from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..core.security import get_password_hash
from typing import Optional
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """パスワードをハッシュ化します"""
    return pwd_context.hash(password)

def get(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_multi(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create(db: Session, obj_in: UserCreate) -> User:
    db_obj = User(
        username=obj_in.username,
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
        is_active=True,
        is_admin=obj_in.is_admin if hasattr(obj_in, "is_admin") else False
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, db_obj: User, obj_in: UserUpdate) -> User:
    update_data = obj_in.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, user_id: int) -> bool:
    obj = db.query(User).get(user_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def get_user(db: Session, user_id: int) -> Optional[User]:
    """IDでユーザーを取得します"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """メールアドレスでユーザーを取得します"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """ユーザー名でユーザーを取得します"""
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """ユーザー一覧を取得します"""
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate) -> User:
    """
    新しいユーザーを作成します
    
    Args:
        db: データベースセッション
        user: 作成するユーザーの情報
        
    Returns:
        作成されたユーザーオブジェクト
        
    Raises:
        ValueError: ユーザー名またはメールアドレスが既に使用されている場合
    """
    # ユーザー名とメールアドレスの重複チェック
    if get_user_by_username(db, user.username):
        raise ValueError(f"ユーザー名 '{user.username}' は既に使用されています")
    if get_user_by_email(db, user.email):
        raise ValueError(f"メールアドレス '{user.email}' は既に使用されています")
    
    # パスワードをハッシュ化
    hashed_password = get_password_hash(user.password)
    
    # ユーザーオブジェクトを作成
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_active=user.is_active,
        is_admin=user.is_admin
    )
    
    # データベースに保存
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate) -> Optional[User]:
    """
    ユーザー情報を更新します
    
    Args:
        db: データベースセッション
        user_id: 更新するユーザーのID
        user: 更新するユーザーの情報
        
    Returns:
        更新されたユーザーオブジェクト。ユーザーが存在しない場合はNone
    """
    db_user = get_user(db, user_id)
    if not db_user:
        return None
        
    # 更新対象のフィールドを設定
    update_data = user.dict(exclude_unset=True)
    
    # パスワードが含まれている場合はハッシュ化
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    # ユーザー名の重複チェック
    if "username" in update_data and update_data["username"] != db_user.username:
        if get_user_by_username(db, update_data["username"]):
            raise ValueError(f"ユーザー名 '{update_data['username']}' は既に使用されています")
    
    # メールアドレスの重複チェック
    if "email" in update_data and update_data["email"] != db_user.email:
        if get_user_by_email(db, update_data["email"]):
            raise ValueError(f"メールアドレス '{update_data['email']}' は既に使用されています")
    
    # 各フィールドを更新
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    """
    ユーザーを削除します
    
    Args:
        db: データベースセッション
        user_id: 削除するユーザーのID
        
    Returns:
        bool: 削除に成功した場合はTrue、ユーザーが存在しない場合はFalse
    """
    db_user = get_user(db, user_id)
    if not db_user:
        return False
        
    db.delete(db_user)
    db.commit()
    
    return True 