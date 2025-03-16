import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface Order {
  id: number;
  customer: {
    name: string;
  };
  order_date: string;
  status: string;
  items: Array<{
    item: {
      name: string;
    };
    quantity: number;
    unit_price: number;
  }>;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/v1/orders");
      if (!response.ok) {
        throw new Error("注文データの取得に失敗しました");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" component="h1">
            注文一覧
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            href="/orders/new"
          >
            新規注文
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>注文番号</TableCell>
                <TableCell>顧客名</TableCell>
                <TableCell>注文日</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>合計金額</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>
                    {new Date(order.order_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    ¥
                    {order.items
                      .reduce(
                        (sum, item) => sum + item.quantity * item.unit_price,
                        0
                      )
                      .toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      href={`/orders/${order.id}`}
                    >
                      詳細
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
