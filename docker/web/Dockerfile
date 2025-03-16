FROM node:18-alpine AS deps

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json yarn.lock ./

# 依存関係のインストール
RUN yarn install --frozen-lockfile

# 開発依存関係をインストール
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 開発モードで起動
CMD ["yarn", "dev"] 