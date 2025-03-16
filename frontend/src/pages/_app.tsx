import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import Layout from "../components/layout/Layout";

/**
 * アプリケーション全体のテーマ設定
 * Material-UIのデフォルトテーマをカスタマイズ
 *
 * カスタマイズ内容：
 * - プライマリーカラー: #1976d2（青系）
 * - 背景色: #f5f5f5（明るいグレー）
 * - フォントファミリー: システムフォントを優先
 * - ボタンのテキスト変換を無効化
 */
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

/**
 * アプリケーションのルートコンポーネント
 * 全ページで共有される設定やレイアウトを適用する
 *
 * 提供する機能：
 * - Material-UIのテーマプロバイダー
 * - CSSベースラインのリセット
 * - 共通レイアウトの適用
 *
 * @param props - アプリケーションのプロパティ（ページコンポーネントとそのプロパティを含む）
 * @returns アプリケーションのルート要素
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
