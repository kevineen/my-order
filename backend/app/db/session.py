from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool

from app.core.config import settings

# データベース接続URLを設定
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# エンジンを作成
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
)

# セッションファクトリを作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# セッションを取得する関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 