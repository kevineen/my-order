FROM node:18-alpine AS deps

WORKDIR /app

# npmのキャッシュレイヤーを作成
COPY package*.json ./
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --only=production

# 開発依存関係をインストール
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 開発モードで起動
CMD ["npm", "run", "dev"] 