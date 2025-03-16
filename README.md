# my-order: オーダー管理システム

オンプレミス環境をベースに外出先からもアクセスできるExcel/Access連携システム

## 概要

このシステムは、以下の特徴を持つオーダー管理システムです：

- オンプレミス環境での運用をベースとしつつ、外出先からもデータ読み書きが可能
- Excelオーダーシートとの連携機能
- Microsoft Accessデータベースとの双方向同期
- 部品マスタと在庫管理
- 発注・入荷・出荷の一元管理

## システム構成

- **バックエンド**: Python (FastAPI)
- **フロントエンド**: Next.js (TypeScript)
- **データベース**: PostgreSQL/MySQL
- **コンテナ化**: Docker/Docker Compose
- **ファイルストレージ**: MinIO (S3互換)

## 主要機能

1. **マスターデータ管理**
   - 部品マスタ
   - 顧客マスタ
   - 仕様書・図面管理

2. **オーダー管理**
   - 発注管理
   - 入荷管理
   - 在庫管理
   - 工程管理

3. **Excel/Access連携**
   - Excelテンプレート生成
   - Excelデータ取込
   - Accessとのマスタ同期
   - Access双方向データ連携

4. **外部アクセス**
   - リモートアクセス機能
   - 権限管理
   - データ同期

## インストール方法

### 前提条件

- Docker と Docker Compose
- Python 3.9以上（開発環境用）
- Node.js 16以上（開発環境用）
- Microsoft Access（連携機能用）

### セットアップ手順

1. リポジトリをクローン:
   ```
   git clone https://github.com/kevineen/my-order.git
   cd my-order
   ```

2. 環境変数ファイルを設定:
   ```
   cp .env.example .env
   # .envファイルを適切に編集
   ```

3. Docker Composeでビルド・起動:
   ```
   docker-compose up -d
   ```

4. 初期データのセットアップ:
   ```
   docker-compose exec api python -m scripts.setup_initial_data
   ```

詳細は各コンポーネントのドキュメントを参照してください。

## 開発方法

### バックエンド開発

```
cd backend
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### フロントエンド開発

```
cd frontend
npm install
npm run dev
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを開く
