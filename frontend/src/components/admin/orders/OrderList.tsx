import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { Order, OrderStatus } from "@/types/order";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  onDeleteClick: (order: Order) => void;
  statusConfig: Record<
    OrderStatus,
    { color: "default" | "primary" | "success" | "error"; label: string }
  >;
}

export function OrderList({
  orders,
  loading,
  error,
  page,
  rowsPerPage,
  onDeleteClick,
  statusConfig,
}: OrderListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>注文番号</TableCell>
            <TableCell>顧客名</TableCell>
            <TableCell>注文日</TableCell>
            <TableCell align="right">合計金額</TableCell>
            <TableCell>ステータス</TableCell>
            <TableCell align="center">アクション</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {error ? error : "注文データがありません"}
              </TableCell>
            </TableRow>
          ) : (
            orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.order_date}</TableCell>
                  <TableCell align="right">
                    ¥
                    {order.items
                      .reduce(
                        (sum, item) => sum + item.quantity * item.unit_price,
                        0
                      )
                      .toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusConfig[order.status].label}
                      color={statusConfig[order.status].color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      title="詳細を表示"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        router.push(`/admin/orders/${order.id}/edit`)
                      }
                      title="編集"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteClick(order)}
                      title="削除"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
