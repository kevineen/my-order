from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..integration.db_connector import DBConnector
from ..core.deps import get_db

router = APIRouter(
    prefix="/api/db",
    tags=["database"],
    responses={404: {"description": "Not found"}},
)

@router.get("/tables", response_model=List[str])
def get_tables(db: Session = Depends(get_db)):
    """
    データベース内のテーブル一覧を取得します
    """
    try:
        connector = DBConnector()
        return connector.get_tables()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tables/{table_name}/schema", response_model=List[Dict[str, Any]])
def get_table_schema(table_name: str, db: Session = Depends(get_db)):
    """
    指定されたテーブルのスキーマ情報を取得します
    """
    try:
        connector = DBConnector()
        return connector.get_table_schema(table_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=List[Dict[str, Any]])
def execute_query(query: str, params: Dict[str, Any] = None, db: Session = Depends(get_db)):
    """
    SQLクエリを実行し、結果を返します
    """
    try:
        connector = DBConnector()
        return connector.execute_query(query, params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update", response_model=int)
def execute_update(query: str, params: Dict[str, Any] = None, db: Session = Depends(get_db)):
    """
    更新系のSQLクエリを実行し、影響を受けた行数を返します
    """
    try:
        connector = DBConnector()
        return connector.execute_update(query, params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 