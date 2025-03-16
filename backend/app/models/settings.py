from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base_class import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # システム設定
    language = Column(String, default="ja")
    timezone = Column(String, default="Asia/Tokyo")
    date_format = Column(String, default="YYYY/MM/DD")
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    
    # セキュリティ設定
    two_factor_enabled = Column(Boolean, default=False)
    session_timeout = Column(Integer, default=30)

    # リレーションシップ
    user = relationship("User", back_populates="settings")

    def __repr__(self):
        return f"<UserSettings(user_id={self.user_id})>" 