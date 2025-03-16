import os
import logging
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.crud.user import create_user
from app.schemas.user import UserCreate
from app.models.user import User
from app.models.customer import Customer
from app.models.item import Item
from app.models.order import Order, OrderStatus
from app.core.security import get_password_hash
from app.db import base  # noqa: F401
from app.db.base_class import Base
from app.db.session import engine
# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    """
    データベースを初期化する
    
    Args:
        db: データベースセッション
    """
    try:
        # マイグレーションSQLファイルを読み込んで実行
        migrations_file = os.path.join(
            os.path.dirname(__file__),
            "migrations",
            "create_tables.sql"
        )
        
        with open(migrations_file, "r", encoding="utf-8") as f:
            sql = f.read()
            
        # SQLを実行
        db.execute(text(sql))
        db.commit()
        logger.info("テーブルの作成が完了しました")
        
        # 初期管理者ユーザーの作成
        user = db.query(User).filter(User.email == settings.FIRST_ADMIN_EMAIL).first()
        if not user:
            user = User(
                email=settings.FIRST_ADMIN_EMAIL,
                username=settings.FIRST_ADMIN_USERNAME,
                hashed_password=get_password_hash(settings.FIRST_ADMIN_PASSWORD),
                is_active=True,
                is_admin=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        logger.info("初期管理者ユーザーの作成が完了しました")
        
        # サンプルデータの作成
        # サンプル顧客
        if db.query(Customer).count() == 0:
            customers = [
                Customer(
                    code="CUST001",
                    name="株式会社サンプル",
                    contact_person="山田太郎",
                    email="sample@example.com",
                    phone="03-1234-5678",
                    address="東京都渋谷区..."
                ),
                Customer(
                    code="CUST002",
                    name="テスト商事",
                    contact_person="鈴木一郎",
                    email="test@example.com",
                    phone="06-8765-4321",
                    address="大阪府大阪市..."
                )
            ]
            for customer in customers:
                db.add(customer)
            
            # サンプル商品
            items = [
                Item(
                    code="ITEM001",
                    name="商品A",
                    description="商品Aの説明",
                    specification="商品Aの仕様",
                    unit="個",
                    unit_price=1000,
                    min_stock=10,
                    current_stock=100
                ),
                Item(
                    code="ITEM002",
                    name="商品B",
                    description="商品Bの説明",
                    specification="商品Bの仕様",
                    unit="個",
                    unit_price=2000,
                    min_stock=5,
                    current_stock=50
                )
            ]
            for item in items:
                db.add(item)
            
            db.commit()
            logger.info("サンプルデータの作成が完了しました")
        
    except Exception as e:
        logger.error(f"データベースの初期化中にエラーが発生しました: {str(e)}")
        raise 