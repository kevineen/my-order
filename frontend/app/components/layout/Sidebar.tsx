import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrderIcon,
  Inventory as ProductIcon,
  People as CustomerIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

/**
 * サイドバーの幅を定義
 * Material-UIのレスポンシブデザインに合わせて設定
 */
const DRAWER_WIDTH = 240;

/**
 * サイドバーの各メニュー項目の型定義
 * @property label - メニュー項目の表示名
 * @property icon - メニュー項目のアイコン要素
 * @property path - クリック時の遷移先パス
 */
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

/**
 * メインメニューの定義
 * アプリケーションの主要な機能へのナビゲーションを提供
 */
const MAIN_MENU_ITEMS: MenuItem[] = [
  { label: "ダッシュボード", icon: <DashboardIcon />, path: "/" },
  { label: "注文管理", icon: <OrderIcon />, path: "/orders" },
  { label: "商品管理", icon: <ProductIcon />, path: "/products" },
  { label: "取引先管理", icon: <CustomerIcon />, path: "/customers" },
  { label: "レポート", icon: <ReportIcon />, path: "/reports" },
];

/**
 * 設定メニューの定義
 * アプリケーションの設定関連機能へのナビゲーションを提供
 */
const SETTING_MENU_ITEMS: MenuItem[] = [
  { label: "設定", icon: <SettingsIcon />, path: "/settings" },
];

/**
 * サイドバーコンポーネント
 * アプリケーションの主要なナビゲーション機能を提供する
 *
 * 特徴：
 * - 永続的な表示（permanent drawer）
 * - アクティブなメニュー項目のハイライト表示
 * - メインメニューと設定メニューの分離
 * - レスポンシブ対応
 */
const Sidebar: React.FC = () => {
  const router = useRouter();

  /**
   * メニュー項目をレンダリングする
   * @param items - レンダリングするメニュー項目の配列
   * @returns メニュー項目のリスト要素
   */
  const renderMenuItems = (items: MenuItem[]) => (
    <List>
      {items.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton
            selected={router.pathname === item.path}
            onClick={() => router.push(item.path)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: router.pathname === item.path ? "white" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {/* アプリケーションのロゴ/タイトル */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          受発注管理
        </Typography>
      </Box>

      <Divider />

      {/* メインメニューのレンダリング */}
      {renderMenuItems(MAIN_MENU_ITEMS)}

      <Divider />

      {/* 設定メニューのレンダリング */}
      {renderMenuItems(SETTING_MENU_ITEMS)}
    </Drawer>
  );
};

export default Sidebar;
