from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # アプリケーション設定
    PROJECT_NAME: str = "My Order System"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # CORS設定
    BACKEND_CORS_ORIGINS: List[str] = []
    
    # データベース設定
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/myorder")
    
    # JWT認証設定
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 初期管理者ユーザー設定
    FIRST_ADMIN_USERNAME: str = os.getenv("FIRST_ADMIN_USERNAME", "admin")
    FIRST_ADMIN_EMAIL: str = os.getenv("FIRST_ADMIN_EMAIL", "admin@example.com")
    FIRST_ADMIN_PASSWORD: str = os.getenv("FIRST_ADMIN_PASSWORD", "admin123")
    
    # Access DB設定（レガシー）
    ACCESS_DB_PATH: str = os.getenv("ACCESS_DB_PATH", "")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 