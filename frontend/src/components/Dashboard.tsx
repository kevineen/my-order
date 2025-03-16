import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp,
  ShoppingCart,
  Inventory,
  Assessment,
} from "@mui/icons-material";

/**
 * ダッシュボードの統計カードコンポーネント
 */
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: 2,
            p: 1,
            mr: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

/**
 * 最近の活動アイテムコンポーネント
 */
const ActivityItem: React.FC<{
  title: string;
  description: string;
  date: string;
}> = ({ title, description, date }) => (
  <>
    <ListItem>
      <ListItemText
        primary={title}
        secondary={description}
        primaryTypographyProps={{ fontWeight: "medium" }}
      />
      <ListItemSecondaryAction>
        <Typography variant="caption" color="textSecondary">
          {date}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
  </>
);

/**
 * ダッシュボードコンポーネント
 * アプリケーションの主要な情報や統計を表示する
 */
const Dashboard: React.FC = () => {
  const router = useRouter();

  // サンプルデータ（実際のアプリケーションでは API から取得）
  const stats = [
    {
      title: "今月の売上",
      value: "¥1,234,567",
      icon: <TrendingUp sx={{ color: "#2196f3" }} />,
      color: "#2196f3",
    },
    {
      title: "注文件数",
      value: "156 件",
      icon: <ShoppingCart sx={{ color: "#4caf50" }} />,
      color: "#4caf50",
    },
    {
      title: "在庫アラート",
      value: "3 件",
      icon: <Inventory sx={{ color: "#f44336" }} />,
      color: "#f44336",
    },
    {
      title: "月間レポート",
      value: "12 件",
      icon: <Assessment sx={{ color: "#ff9800" }} />,
      color: "#ff9800",
    },
  ];

  const recentActivities = [
    {
      title: "新規注文",
      description: "注文 #1234 が登録されました",
      date: "5分前",
    },
    {
      title: "在庫アラート",
      description: "商品「A-123」の在庫が不足しています",
      date: "1時間前",
    },
    {
      title: "配送完了",
      description: "注文 #1230 の配送が完了しました",
      date: "2時間前",
    },
    {
      title: "新規登録",
      description: "新しい取引先が登録されました",
      date: "3時間前",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* ヘッダー部分 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          ダッシュボード
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/orders/new")}
          sx={{ borderRadius: 2 }}
        >
          新規注文
        </Button>
      </Box>

      {/* 統計カード */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* アクティビティと概要 */}
      <Grid container spacing={3}>
        {/* 最近の活動 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">最近の活動</Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push("/activities")}
                sx={{ textTransform: "none" }}
              >
                すべて表示
              </Button>
            </Box>
            <List>
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </List>
          </Paper>
        </Grid>

        {/* クイックアクション */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              クイックアクション
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => router.push("/products/new")}
              >
                商品登録
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => router.push("/customers/new")}
              >
                取引先登録
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Assessment />}
                onClick={() => router.push("/reports")}
              >
                レポート作成
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
