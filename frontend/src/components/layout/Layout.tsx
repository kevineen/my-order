import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

/**
 * レイアウトコンポーネントのプロパティ定義
 * @property children - レイアウト内に表示する子要素
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 共通レイアウトコンポーネント
 * アプリケーション全体のレイアウトを定義する
 *
 * 特徴：
 * - サイドバーとメインコンテンツのフレックスレイアウト
 * - 最小高さを画面高に設定（スクロール対応）
 * - レスポンシブデザイン対応
 * - Material-UIのテーマに準拠したスタイリング
 *
 * @param props - レイアウトコンポーネントのプロパティ
 * @returns レイアウト適用済みのJSX要素
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 永続的なサイドバーコンポーネント */}
      <Sidebar />

      {/* メインコンテンツエリア */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
