from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
import os

from ..core.auth import get_current_active_user
from ..database import get_db
from ..integration.excel_connector import process_order_excel, generate_order_template
from ..schemas.user import User

router = APIRouter(prefix="/excel", tags=["excel_integration"])


@router.post("/upload-order")
async def upload_order_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Excelファイル(.xlsx, .xls)をアップロードしてください")
    
    try:
        file_content = await file.read()
        order = await process_order_excel(file_content, db)
        return {
            "status": "success",
            "message": f"注文データが正常に取り込まれました",
            "order_id": order.id,
            "order_number": order.order_number
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"処理中にエラーが発生しました: {str(e)}")


@router.get("/generate-template")
async def get_excel_template(
    customer_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        template_path = generate_order_template(db, customer_id=customer_id)
        
        # レスポンスとしてファイルを返す
        return FileResponse(
            path=template_path, 
            filename=f"order_template_{os.path.basename(template_path)}",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"テンプレートの生成中にエラーが発生しました: {str(e)}")
    finally:
        # 一時ファイルの削除はレスポンス送信後に行われる
        pass
