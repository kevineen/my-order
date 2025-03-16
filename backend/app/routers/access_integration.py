from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from ..core.auth import get_current_active_user
from ..core.config import settings
from ..database import get_db
from ..integration.access_connector import AccessDBConnector
from ..schemas.user import User

router = APIRouter(prefix="/access", tags=["access_integration"])


@router.post("/export-orders")
async def export_orders_to_access(
    background_tasks: BackgroundTasks,
    from_date: Optional[str] = Form(None),
    to_date: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """注文データをAccessにエクスポートするAPI"""
    try:
        # 日付の変換
        from_date_obj = datetime.strptime(from_date, "%Y-%m-%d") if from_date else None
        to_date_obj = datetime.strptime(to_date, "%Y-%m-%d") if to_date else None
        
        # バックグラウンドタスクとして実行
        def export_task():
            connector = AccessDBConnector(settings.ACCESS_DB_PATH)
            return connector.export_orders_to_access(db, from_date_obj, to_date_obj)
        
        background_tasks.add_task(export_task)
        
        return {"message": "注文データのエクスポートタスクを開始しました"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/import-orders")
async def import_orders_from_access(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """AccessからシステムにデータをインポートするAPI"""
    try:
        # バックグラウンドタスクとして実行
        def import_task():
            connector = AccessDBConnector(settings.ACCESS_DB_PATH)
            return connector.import_orders_from_access(db)
        
        background_tasks.add_task(import_task)
        
        return {"message": "注文データのインポートタスクを開始しました"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export-master")
async def export_master_data(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """マスターデータをAccessにエクスポートするAPI"""
    try:
        # バックグラウンドタスクとして実行
        def export_master_task():
            connector = AccessDBConnector(settings.ACCESS_DB_PATH)
            return connector.export_master_data(db)
        
        background_tasks.add_task(export_master_task)
        
        return {"message": "マスターデータのエクスポートタスクを開始しました"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
