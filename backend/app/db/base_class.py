from typing import Any

from sqlalchemy.ext.declarative import as_declarative, declared_attr


@as_declarative()
class Base:
    """
    SQLAlchemyのベースクラス
    全てのモデルクラスの基底クラスとなる
    """
    id: Any
    __name__: str

    # クラス名をテーブル名として使用する
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower() 