import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { OrderStatus } from "app/types/order";

interface DashboardSummaryProps {
  orderCounts: {
    [key in OrderStatus]?: number;
  };
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export const DashboardSummary = ({
  orderCounts,
  totalOrders,
  totalCustomers,
  totalRevenue,
}: DashboardSummaryProps) => {
  const statusConfig = {
    pending: { label: "未処理", color: "#ff9800" },
    confirmed: { label: "確認済み", color: "#2196f3" },
    processing: { label: "処理中", color: "#673ab7" },
    shipped: { label: "発送済み", color: "#009688" },
    delivered: { label: "配達済み", color: "#4caf50" },
    cancelled: { label: "キャンセル", color: "#f44336" },
  };

  const summaryCards = [
    {
      title: "総注文数",
      value: totalOrders,
      unit: "件",
    },
    {
      title: "総顧客数",
      value: totalCustomers,
      unit: "名",
    },
    {
      title: "総売上",
      value: totalRevenue.toLocaleString(),
      unit: "円",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* サマリーカード */}
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4" component="div">
                  {card.value}
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ ml: 1 }}
                  >
                    {card.unit}
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* 注文ステータス別カード */}
        {Object.entries(statusConfig).map(([status, config]) => (
          <Grid item xs={12} sm={6} md={4} key={status}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {config.label}
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ color: config.color }}
                >
                  {orderCounts[status as OrderStatus] || 0}
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ ml: 1 }}
                  >
                    件
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
