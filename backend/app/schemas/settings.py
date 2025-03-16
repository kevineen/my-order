from pydantic import BaseModel, Field

class SystemSettings(BaseModel):
    language: str = Field(..., description="ユーザーの言語設定")
    timezone: str = Field(..., description="ユーザーのタイムゾーン")
    dateFormat: str = Field(..., description="日付の表示形式")
    emailNotifications: bool = Field(..., description="メール通知の有効/無効")
    pushNotifications: bool = Field(..., description="プッシュ通知の有効/無効")

    class Config:
        json_schema_extra = {
            "example": {
                "language": "ja",
                "timezone": "Asia/Tokyo",
                "dateFormat": "YYYY/MM/DD",
                "emailNotifications": True,
                "pushNotifications": True
            }
        }

class SecuritySettings(BaseModel):
    twoFactorEnabled: bool = Field(..., description="二要素認証の有効/無効")
    sessionTimeout: int = Field(
        ...,
        description="セッションタイムアウト時間（分）",
        ge=5,
        le=120
    )

    class Config:
        json_schema_extra = {
            "example": {
                "twoFactorEnabled": False,
                "sessionTimeout": 30
            }
        }

class PasswordUpdate(BaseModel):
    currentPassword: str = Field(..., description="現在のパスワード")
    newPassword: str = Field(..., description="新しいパスワード", min_length=8)

    class Config:
        json_schema_extra = {
            "example": {
                "currentPassword": "current123",
                "newPassword": "newpassword123"
            }
        } 