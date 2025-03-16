from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.core.security import get_password_hash, verify_password
from app.api import deps
from app.models.user import User
from app.models.settings import UserSettings
from app.schemas.settings import SystemSettings, SecuritySettings, PasswordUpdate

router = APIRouter()

class SystemSettingsResponse(BaseModel):
    language: str
    timezone: str
    dateFormat: str
    emailNotifications: bool
    pushNotifications: bool

@router.get("/system", response_model=SystemSettingsResponse)
def get_system_settings(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """
    ユーザーのシステム設定を取得します。
    設定が存在しない場合はデフォルト値を返します。
    """
    settings = db.query(UserSettings).filter(
        UserSettings.user_id == current_user.id
    ).first()

    if not settings:
        return SystemSettingsResponse(
            language="ja",
            timezone="Asia/Tokyo",
            dateFormat="YYYY/MM/DD",
            emailNotifications=True,
            pushNotifications=True
        )

    return SystemSettingsResponse(
        language=settings.language,
        timezone=settings.timezone,
        dateFormat=settings.date_format,
        emailNotifications=settings.email_notifications,
        pushNotifications=settings.push_notifications
    )

@router.put("/system", response_model=SystemSettingsResponse)
def update_system_settings(
    settings: SystemSettings,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """
    ユーザーのシステム設定を更新します。
    """
    db_settings = db.query(UserSettings).filter(
        UserSettings.user_id == current_user.id
    ).first()

    if not db_settings:
        db_settings = UserSettings(
            user_id=current_user.id,
            language=settings.language,
            timezone=settings.timezone,
            date_format=settings.dateFormat,
            email_notifications=settings.emailNotifications,
            push_notifications=settings.pushNotifications
        )
        db.add(db_settings)
    else:
        db_settings.language = settings.language
        db_settings.timezone = settings.timezone
        db_settings.date_format = settings.dateFormat
        db_settings.email_notifications = settings.emailNotifications
        db_settings.push_notifications = settings.pushNotifications

    db.commit()
    db.refresh(db_settings)

    return SystemSettingsResponse(
        language=db_settings.language,
        timezone=db_settings.timezone,
        dateFormat=db_settings.date_format,
        emailNotifications=db_settings.email_notifications,
        pushNotifications=db_settings.push_notifications
    )

@router.put("/password")
def update_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """
    ユーザーのパスワードを更新します。
    """
    if not verify_password(password_data.currentPassword, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="現在のパスワードが正しくありません"
        )

    current_user.hashed_password = get_password_hash(password_data.newPassword)
    db.commit()

    return {"message": "パスワードを更新しました"}

@router.put("/security", response_model=SecuritySettings)
def update_security_settings(
    settings: SecuritySettings,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """
    ユーザーのセキュリティ設定を更新します。
    """
    db_settings = db.query(UserSettings).filter(
        UserSettings.user_id == current_user.id
    ).first()

    if not db_settings:
        db_settings = UserSettings(
            user_id=current_user.id,
            two_factor_enabled=settings.twoFactorEnabled,
            session_timeout=settings.sessionTimeout
        )
        db.add(db_settings)
    else:
        db_settings.two_factor_enabled = settings.twoFactorEnabled
        db_settings.session_timeout = settings.sessionTimeout

    db.commit()
    db.refresh(db_settings)

    return SecuritySettings(
        twoFactorEnabled=db_settings.two_factor_enabled,
        sessionTimeout=db_settings.session_timeout
    ) 