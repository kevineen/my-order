import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Order, OrderStatus } from "@/types/order";
import { statusConfig } from "./index";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
}

// サンプルデータ（実際のアプリケーションではAPIから取得）
const mockOrderDetail: OrderDetail = {
  id: "1",
  orderNumber: "ORD-0001",
  customerName: "山田太郎",
  customerEmail: "yamada@example.com",
  orderDate: "2024-03-16",
  status: "processing", // OrderStatus enum uses lowercase values
  items: [
    {
      id: "1",
      name: "商品A",
      quantity: 2,
      unitPrice: 1000,
      subtotal: 2000,
    },
    {
      id: "2",
      name: "商品B",
      quantity: 1,
      unitPrice: 3000,
      subtotal: 3000,
    },
  ],
  totalAmount: 5000,
  notes: "配送時の注意事項等",
};

/**
 * 注文詳細画面
 */
export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    // 実際のアプリケーションではAPIから取得
    setOrder(mockOrderDetail);
  }, [id]);

  if (!order) {
    return (
      <AdminLayout>
        <Container maxWidth="lg">
          <Typography>Loading...</Typography>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/admin/orders")}
            sx={{ mb: 2 }}
          >
            注文一覧に戻る
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" component="h1">
              注文詳細
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={() => router.push(`/admin/orders/${id}/edit`)}
                sx={{ mr: 1 }}
              >
                編集
              </Button>
              <Button variant="contained" color="primary">
                注文書出力
              </Button>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* 注文情報 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  注文情報
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography color="textSecondary">注文番号</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{order.orderNumber}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary">注文日</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{order.orderDate}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary">ステータス</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Chip
                      label={statusConfig[order.status].label}
                      color={statusConfig[order.status].color}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* 顧客情報 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  顧客情報
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography color="textSecondary">顧客名</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{order.customerName}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary">
                      メールアドレス
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{order.customerEmail}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* 注文アイテム */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  注文アイテム
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>商品名</TableCell>
                        <TableCell align="right">単価</TableCell>
                        <TableCell align="right">数量</TableCell>
                        <TableCell align="right">小計</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">
                            ¥{item.unitPrice.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            ¥{item.subtotal.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="subtitle1">合計</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">
                            ¥{order.totalAmount.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 備考 */}
          {order.notes && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    備考
                  </Typography>
                  <Typography>{order.notes}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </AdminLayout>
  );
}
