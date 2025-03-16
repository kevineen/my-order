from typing import List, Dict, Any, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from ..core.config import settings

class DBConnector:
    """
    PostgreSQLデータベースへの接続を管理するクラス
    
    このクラスは、PostgreSQLデータベースへの接続を確立し、
    データの読み取りと書き込みを行うためのメソッドを提供します。
    """
    
    def __init__(self):
        """コネクタを初期化します"""
        self._engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
        
    def execute_query(self, query: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        SQLクエリを実行し、結果を辞書のリストとして返します
        
        Args:
            query: 実行するSQLクエリ
            params: クエリパラメータ（オプション）
            
        Returns:
            List[Dict[str, Any]]: クエリ結果。各行は列名をキーとする辞書として返されます。
            
        Raises:
            Exception: クエリの実行に失敗した場合
        """
        try:
            with Session(self._engine) as session:
                result = session.execute(text(query), params or {})
                return [dict(row._mapping) for row in result]
                
        except Exception as e:
            raise Exception(f"クエリの実行に失敗しました: {str(e)}")
            
    def execute_update(self, query: str, params: Optional[Dict[str, Any]] = None) -> int:
        """
        更新系のSQLクエリを実行し、影響を受けた行数を返します
        
        Args:
            query: 実行するSQLクエリ（INSERT, UPDATE, DELETE）
            params: クエリパラメータ（オプション）
            
        Returns:
            int: 影響を受けた行数
            
        Raises:
            Exception: クエリの実行に失敗した場合
        """
        try:
            with Session(self._engine) as session:
                result = session.execute(text(query), params or {})
                affected_rows = result.rowcount
                session.commit()
                return affected_rows
                
        except Exception as e:
            raise Exception(f"更新クエリの実行に失敗しました: {str(e)}")
            
    def get_tables(self) -> List[str]:
        """
        データベース内のテーブル一覧を取得します
        
        Returns:
            List[str]: テーブル名のリスト
        """
        query = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """
        result = self.execute_query(query)
        return [row['table_name'] for row in result]
        
    def get_table_schema(self, table_name: str) -> List[Dict[str, Any]]:
        """
        指定されたテーブルのスキーマ情報を取得します
        
        Args:
            table_name: テーブル名
            
        Returns:
            List[Dict[str, Any]]: 各列の情報を含む辞書のリスト
        """
        query = """
            SELECT 
                column_name,
                data_type,
                is_nullable,
                character_maximum_length
            FROM information_schema.columns
            WHERE table_name = :table_name
            ORDER BY ordinal_position
        """
        return self.execute_query(query, {'table_name': table_name}) 